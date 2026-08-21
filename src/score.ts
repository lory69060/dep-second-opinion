import type { ChangeAnalysis, ReviewResult, Verdict } from "./types.js";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function isProdSection(section: string): boolean {
  return section === "dependencies" || section === "peerDependencies";
}

export function evidenceForChange(analysis: ChangeAnalysis): string[] {
  const { change, osv, meta } = analysis;
  const evidence: string[] = [];
  const scope = isProdSection(change.section) ? "production" : "dev/tooling";
  evidence.push(`scope=${scope} (\`${change.section}\`)`);
  evidence.push(`bump=\`${change.bump}\` (${change.fromVersion ?? "∅"} → ${change.toVersion ?? "∅"})`);

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
  } else {
    evidence.push("OSV: no known vulns for target version");
  }
  if (meta?.latestVersion && change.toVersion && meta.latestVersion !== change.toVersion) {
    evidence.push(`registry latest is \`${meta.latestVersion}\` (not necessarily a risk)`);
  }
  return evidence;
}

export function scoreChange(analysis: ChangeAnalysis): number {
  let score = 0;
  const { change, osv, meta } = analysis;
  const prod = isProdSection(change.section);

  if (change.bump === "major") score += prod ? 45 : 25;
  else if (change.bump === "minor") score += prod ? 18 : 8;
  else if (change.bump === "prerelease") score += prod ? 28 : 15;
  else if (change.bump === "unknown") score += prod ? 22 : 12;
  else if (change.bump === "patch") score += prod ? 2 : 0;

  if (!change.fromVersion || !change.toVersion) score += prod ? 30 : 18;

  score += Math.min(50, osv.length * 25);

  if (meta?.deprecated) score += 35;

  return clamp(score, 0, 100);
}

export function aggregateVerdict(changes: ChangeAnalysis[]): {
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
    const evidence = evidenceForChange(c);
    return {
      ...c,
      localScore: scoreChange(c),
      evidence,
    };
  });

  const maxScore = Math.max(...scored.map((c) => c.localScore));
  const hasOsv = scored.some((c) => c.osv.length > 0);
  const hasProdMajor = scored.some(
    (c) => c.change.bump === "major" && isProdSection(c.change.section),
  );
  const hasDevMajor = scored.some(
    (c) => c.change.bump === "major" && !isProdSection(c.change.section),
  );
  const hasDeprecated = scored.some((c) => Boolean(c.meta?.deprecated));
  const prodChanges = scored.filter((c) => isProdSection(c.change.section));

  const reasons: string[] = [];
  if (hasDeprecated) reasons.push("target package marked deprecated on npm");
  if (hasOsv) reasons.push("OSV reports vulnerability on at least one target version");
  if (hasProdMajor) reasons.push("production dependency has a major bump (breaking-change risk)");
  else if (hasDevMajor) reasons.push("devDependency has a major bump (usually lower runtime risk)");
  if (prodChanges.length > 0) {
    reasons.push(`${prodChanges.length} production-scope change(s)`);
  }
  if (maxScore < 25 && !hasMajorLike(scored) && !hasOsv && !hasDeprecated) {
    reasons.push("only low-risk patch/minor signals with no OSV/deprecation");
  }

  let verdict: Verdict;
  if (maxScore >= 60 || hasDeprecated || (hasOsv && hasProdMajor)) {
    verdict = "HIGH_RISK";
  } else if (maxScore >= 25 || hasProdMajor || hasOsv || hasDevMajor) {
    verdict = "REVIEW_RECOMMENDED";
  } else {
    verdict = "SAFE_TO_MERGE";
  }

  const confidence = clamp(
    0.55 + scored.length * 0.05 + (hasOsv ? 0.15 : 0) + (hasDeprecated ? 0.1 : 0),
    0,
    0.95,
  );

  const summaryParts = [
    `${scored.length} dependency change(s)`,
    hasProdMajor ? "includes production major bump" : hasDevMajor ? "includes dev major bump" : null,
    hasOsv ? "OSV hits present" : null,
    hasDeprecated ? "deprecated package" : null,
  ].filter(Boolean);

  return {
    verdict,
    confidence,
    summary: summaryParts.join("; ") + ".",
    reasons: reasons.length > 0 ? reasons : ["insufficient distinct signals; defaulted by score"],
  };
}

function hasMajorLike(scored: ChangeAnalysis[]): boolean {
  return scored.some((c) => c.change.bump === "major" || c.change.bump === "unknown");
}

export function buildReviewResult(changes: ChangeAnalysis[]): ReviewResult {
  const enriched = changes.map((c) => {
    const withScore = { ...c, localScore: scoreChange(c) };
    return {
      ...withScore,
      evidence: evidenceForChange(withScore),
    };
  });
  const agg = aggregateVerdict(enriched);
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
