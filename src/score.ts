import type { ChangeAnalysis, ReviewResult, Verdict } from "./types.js";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function scoreChange(analysis: ChangeAnalysis): number {
  let score = 0;
  const { change, osv, meta } = analysis;

  if (change.bump === "major") score += 40;
  else if (change.bump === "minor") score += 15;
  else if (change.bump === "prerelease") score += 25;
  else if (change.bump === "unknown") score += 20;

  if (!change.fromVersion || !change.toVersion) score += 30;

  score += Math.min(50, osv.length * 25);

  if (meta?.deprecated) score += 35;

  return clamp(score, 0, 100);
}

export function aggregateVerdict(changes: ChangeAnalysis[]): {
  verdict: Verdict;
  confidence: number;
  summary: string;
  noCommentReason?: string;
} {
  if (changes.length === 0) {
    return {
      verdict: "NO_COMMENT",
      confidence: 1,
      summary: "No dependency version changes detected.",
      noCommentReason: "no_dependency_changes",
    };
  }

  const scored = changes.map((c) => ({
    ...c,
    localScore: scoreChange(c),
  }));

  const maxScore = Math.max(...scored.map((c) => c.localScore));
  const hasOsv = scored.some((c) => c.osv.length > 0);
  const hasMajor = scored.some((c) => c.change.bump === "major");
  const hasDeprecated = scored.some((c) => Boolean(c.meta?.deprecated));

  let verdict: Verdict;
  if (maxScore >= 60 || (hasOsv && hasMajor) || hasDeprecated) {
    verdict = "HIGH_RISK";
  } else if (maxScore >= 25 || hasMajor || hasOsv) {
    verdict = "REVIEW_RECOMMENDED";
  } else {
    verdict = "SAFE_TO_MERGE";
  }

  const confidence = clamp(0.55 + scored.length * 0.05 + (hasOsv ? 0.15 : 0), 0, 0.95);

  const summaryParts = [
    `${scored.length} dependency change(s)`,
    hasMajor ? "includes major bump" : null,
    hasOsv ? "OSV hits present" : null,
    hasDeprecated ? "deprecated package" : null,
  ].filter(Boolean);

  return {
    verdict,
    confidence,
    summary: summaryParts.join("; ") + ".",
  };
}

export function buildReviewResult(changes: ChangeAnalysis[]): ReviewResult {
  const enriched = changes.map((c) => ({
    ...c,
    localScore: scoreChange(c),
  }));
  const agg = aggregateVerdict(enriched);
  return {
    verdict: agg.verdict,
    confidence: agg.confidence,
    summary: agg.summary,
    changes: enriched,
    markdown: "",
    noCommentReason: agg.noCommentReason,
  };
}
