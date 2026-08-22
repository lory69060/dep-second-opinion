import type { ChangeAnalysis, ReviewResult, Verdict } from "./types.js";
import {
  bumpWithinAutoMerge,
  DEFAULT_POLICY,
  type EscalateLevel,
  type Policy,
  type SignalAction,
} from "./policy/types.js";
import { ageDaysSince } from "./signals/npm-meta.js";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function isProdSection(section: string): boolean {
  return section === "dependencies" || section === "peerDependencies";
}

function isRegistryMissing(analysis: ChangeAnalysis): boolean {
  const s = analysis.meta?.registryStatus;
  return s === "package_missing" || s === "version_missing";
}

function isNewlyAdded(analysis: ChangeAnalysis): boolean {
  return analysis.change.fromVersion === null && analysis.change.toVersion !== null;
}

function supplyChainFlags(
  analysis: ChangeAnalysis,
  policy: Policy,
  nowMs: number,
): string[] {
  const flags: string[] = [];
  if (!isNewlyAdded(analysis)) return flags;
  if (isRegistryMissing(analysis)) return flags;

  const sc = policy.supplyChain;
  const meta = analysis.meta;
  if (!meta || meta.registryStatus !== "ok") return flags;

  if (sc.newPackageMaxAgeDays > 0) {
    const age = ageDaysSince(meta.created, nowMs);
    if (age !== null && age < sc.newPackageMaxAgeDays) {
      flags.push(
        `new_package_age=${age}d < ${sc.newPackageMaxAgeDays}d (package created ${meta.created})`,
      );
    }
  }

  if (sc.requireRepository && meta.hasRepository === false) {
    flags.push("registry repository field missing");
  }

  if (sc.minWeeklyDownloads > 0) {
    const dl = meta.weeklyDownloads;
    if (typeof dl === "number" && dl < sc.minWeeklyDownloads) {
      flags.push(`weekly_downloads=${dl} < ${sc.minWeeklyDownloads}`);
    }
  }

  return flags;
}

export function evidenceForChange(
  analysis: ChangeAnalysis,
  policy: Policy = DEFAULT_POLICY,
  nowMs: number = Date.now(),
): string[] {
  const { change, osv, meta } = analysis;
  const evidence: string[] = [];
  const scope = isProdSection(change.section) ? "production" : "dev/tooling";
  evidence.push(`scope=${scope} (\`${change.section}\`)`);
  evidence.push(`bump=\`${change.bump}\` (${change.fromVersion ?? "∅"} → ${change.toVersion ?? "∅"})`);

  if (meta?.registryStatus === "package_missing") {
    evidence.push("registry: package not found on npm (possible hallucinated / slopsquat name)");
  } else if (meta?.registryStatus === "version_missing") {
    evidence.push(
      `registry: version \`${change.toVersion}\` not published on npm`,
    );
  } else if (meta?.registryStatus === "lookup_failed") {
    evidence.push("registry: lookup failed (signal skipped)");
  } else if (meta?.registryStatus === "skipped") {
    evidence.push("registry: skipped (offline)");
  }

  if (meta?.deprecated) {
    evidence.push(`deprecated: ${meta.deprecated}`);
  }
  if (osv.length > 0) {
    evidence.push(
      `OSV on target: ${osv
        .slice(0, 3)
        .map((v) => v.id)
        .join(", ")}`,
    );
  } else if (!isRegistryMissing(analysis)) {
    evidence.push("OSV: no known vulns for target version");
  }
  if (meta?.latestVersion && change.toVersion && meta.latestVersion !== change.toVersion) {
    evidence.push(`registry latest is \`${meta.latestVersion}\` (not necessarily a risk)`);
  }
  if (meta?.created) {
    const age = ageDaysSince(meta.created, nowMs);
    if (age !== null) evidence.push(`package_age≈${age}d (created ${meta.created})`);
  }
  if (meta?.hasRepository === false) {
    evidence.push("repository: not set on npm metadata");
  }
  if (typeof meta?.weeklyDownloads === "number") {
    evidence.push(`weekly_downloads=${meta.weeklyDownloads}`);
  }
  for (const f of supplyChainFlags(analysis, policy, nowMs)) {
    evidence.push(`supply_chain: ${f}`);
  }
  return evidence;
}

export function scoreChange(
  analysis: ChangeAnalysis,
  policy: Policy = DEFAULT_POLICY,
  nowMs: number = Date.now(),
): number {
  let score = 0;
  const { change, osv, meta } = analysis;
  const prod = isProdSection(change.section);
  const scope = prod ? policy.production : policy.development;

  if (isRegistryMissing(analysis)) {
    return 100;
  }

  if (change.bump === "major") score += prod ? 45 : 25;
  else if (change.bump === "minor") score += prod ? 18 : 8;
  else if (change.bump === "prerelease") score += prod ? 28 : 15;
  else if (change.bump === "unknown") score += prod ? 22 : 12;
  else if (change.bump === "patch") score += prod ? 2 : 0;

  if (!change.fromVersion || !change.toVersion) score += prod ? 30 : 18;

  score += Math.min(50, osv.length * 25);

  if (meta?.deprecated) score += 35;

  const scFlags = supplyChainFlags(analysis, policy, nowMs);
  if (scFlags.length > 0 && policy.supplyChain.onNewPackage !== "ignore") {
    score += policy.supplyChain.onNewPackage === "high_risk" ? 40 : 22;
  }

  // Soften score when within auto-merge band and clean.
  if (
    osv.length === 0 &&
    !meta?.deprecated &&
    scFlags.length === 0 &&
    bumpWithinAutoMerge(change.bump, scope.autoMergeMaxBump)
  ) {
    score = Math.min(score, 10);
  }

  return clamp(score, 0, 100);
}

function escalate(level: EscalateLevel): Verdict {
  return level === "high_risk" ? "HIGH_RISK" : "REVIEW_RECOMMENDED";
}

function applySignalAction(action: SignalAction, current: Verdict): Verdict {
  if (action === "ignore") return current;
  const next = escalate(action);
  return rank(next) > rank(current) ? next : current;
}

export function aggregateVerdict(
  changes: ChangeAnalysis[],
  policy: Policy = DEFAULT_POLICY,
  nowMs: number = Date.now(),
): {
  verdict: Verdict;
  confidence: number;
  summary: string;
  reasons: string[];
  noCommentReason?: string;
} {
  if (changes.length === 0) {
    return {
      verdict: "NO_COMMENT",
      confidence: 1,
      summary: "No dependency version changes detected.",
      reasons: ["no_dependency_changes"],
      noCommentReason: "no_dependency_changes",
    };
  }

  const scored = changes.map((c) => {
    const evidence = evidenceForChange(c, policy, nowMs);
    return {
      ...c,
      localScore: scoreChange(c, policy, nowMs),
      evidence,
    };
  });

  const hasOsv = scored.some((c) => c.osv.length > 0);
  const hasDeprecated = scored.some((c) => Boolean(c.meta?.deprecated));
  const hasRegistryMissing = scored.some((c) => isRegistryMissing(c));
  const hasProdMajor = scored.some(
    (c) => c.change.bump === "major" && isProdSection(c.change.section),
  );
  const hasDevMajor = scored.some(
    (c) => c.change.bump === "major" && !isProdSection(c.change.section),
  );
  const prodChanges = scored.filter((c) => isProdSection(c.change.section));
  const maxScore = Math.max(...scored.map((c) => c.localScore));

  const reasons: string[] = [];
  let verdict: Verdict = "SAFE_TO_MERGE";

  if (hasRegistryMissing) {
    verdict = escalate(policy.onRegistryMissing);
    reasons.push(
      `policy on_registry_missing=${policy.onRegistryMissing}: package or version not found on npm (hallucinated / unpublished)`,
    );
  }

  if (hasDeprecated) {
    verdict = applySignalAction(policy.onDeprecated, verdict);
    reasons.push(
      `policy on_deprecated=${policy.onDeprecated}: target package marked deprecated on npm`,
    );
  }

  if (hasOsv) {
    verdict = applySignalAction(policy.onOsv, verdict);
    reasons.push(`policy on_osv=${policy.onOsv}: OSV hit on at least one target version`);
  }

  for (const c of scored) {
    const flags = supplyChainFlags(c, policy, nowMs);
    if (flags.length === 0 || policy.supplyChain.onNewPackage === "ignore") continue;
    verdict = applySignalAction(policy.supplyChain.onNewPackage, verdict);
    reasons.push(
      `policy supply_chain.on_new_package=${policy.supplyChain.onNewPackage} for \`${c.change.name}\`: ${flags.join("; ")}`,
    );
  }

  for (const c of scored) {
    const prod = isProdSection(c.change.section);
    const scope = prod ? policy.production : policy.development;
    if (isRegistryMissing(c)) continue;

    if (c.change.bump === "major") {
      const v = escalate(scope.major);
      if (rank(v) > rank(verdict)) verdict = v;
      reasons.push(
        `policy ${prod ? "production" : "development"}.major=${scope.major} for \`${c.change.name}\``,
      );
    } else if (
      !c.osv.length &&
      !c.meta?.deprecated &&
      supplyChainFlags(c, policy, nowMs).length === 0 &&
      bumpWithinAutoMerge(c.change.bump, scope.autoMergeMaxBump)
    ) {
      reasons.push(
        `\`${c.change.name}\` within ${prod ? "production" : "development"}.auto_merge_max_bump=${scope.autoMergeMaxBump}`,
      );
    } else if (
      !c.osv.length &&
      !c.meta?.deprecated &&
      supplyChainFlags(c, policy, nowMs).length === 0 &&
      !bumpWithinAutoMerge(c.change.bump, scope.autoMergeMaxBump)
    ) {
      // Exceeds auto_merge band → at least REVIEW (do not leave SAFE on soft scores).
      if (rank("REVIEW_RECOMMENDED") > rank(verdict)) verdict = "REVIEW_RECOMMENDED";
      reasons.push(
        `\`${c.change.name}\` exceeds ${prod ? "production" : "development"}.auto_merge_max_bump=${scope.autoMergeMaxBump}`,
      );
    } else if (c.localScore >= 25) {
      if (rank("REVIEW_RECOMMENDED") > rank(verdict)) verdict = "REVIEW_RECOMMENDED";
      reasons.push(`\`${c.change.name}\` score ${c.localScore} exceeds soft threshold`);
    }
  }

  if (prodChanges.length > 0) {
    reasons.push(`${prodChanges.length} production-scope change(s)`);
  }

  // If everything is within auto-merge and clean, keep SAFE.
  const allAuto =
    !hasOsv &&
    !hasDeprecated &&
    !hasRegistryMissing &&
    scored.every((c) => {
      const prod = isProdSection(c.change.section);
      const scope = prod ? policy.production : policy.development;
      return (
        supplyChainFlags(c, policy, nowMs).length === 0 &&
        bumpWithinAutoMerge(c.change.bump, scope.autoMergeMaxBump)
      );
    });
  if (allAuto) {
    verdict = "SAFE_TO_MERGE";
    reasons.push("all changes within configured auto_merge_max_bump and clean of OSV/deprecation/registry/supply-chain flags");
  }

  if (reasons.length === 0) {
    reasons.push(maxScore < 25 ? "low score with default policy" : "defaulted by score");
    if (maxScore >= 60 && rank(verdict) < rank("HIGH_RISK")) verdict = "HIGH_RISK";
    else if (maxScore >= 25 && rank(verdict) < rank("REVIEW_RECOMMENDED")) {
      verdict = "REVIEW_RECOMMENDED";
    }
  }

  const confidence = clamp(
    0.55 +
      scored.length * 0.05 +
      (hasOsv ? 0.15 : 0) +
      (hasDeprecated ? 0.1 : 0) +
      (hasRegistryMissing ? 0.2 : 0),
    0,
    0.95,
  );

  const summaryParts = [
    `${scored.length} dependency change(s)`,
    hasProdMajor ? "includes production major bump" : hasDevMajor ? "includes dev major bump" : null,
    hasRegistryMissing ? "registry missing package/version" : null,
    hasOsv ? "OSV hits present" : null,
    hasDeprecated ? "deprecated package" : null,
  ].filter(Boolean);

  return {
    verdict,
    confidence,
    summary: summaryParts.join("; ") + ".",
    reasons,
  };
}

function rank(v: Verdict): number {
  switch (v) {
    case "NO_COMMENT":
      return 0;
    case "SAFE_TO_MERGE":
      return 1;
    case "REVIEW_RECOMMENDED":
      return 2;
    case "HIGH_RISK":
      return 3;
    default: {
      const _exhaustive: never = v;
      return _exhaustive;
    }
  }
}

export function buildReviewResult(
  changes: ChangeAnalysis[],
  policy: Policy = DEFAULT_POLICY,
  nowMs: number = Date.now(),
): ReviewResult {
  const filtered = changes.filter((c) => !policy.ignore.includes(c.change.name));
  const enriched = filtered.map((c) => {
    const withScore = { ...c, localScore: scoreChange(c, policy, nowMs) };
    return {
      ...withScore,
      evidence: evidenceForChange(withScore, policy, nowMs),
    };
  });
  const agg = aggregateVerdict(enriched, policy, nowMs);
  return {
    verdict: agg.verdict,
    confidence: agg.confidence,
    summary: agg.summary,
    reasons: agg.reasons,
    changes: enriched,
    markdown: "",
    noCommentReason: agg.noCommentReason,
  };
}
