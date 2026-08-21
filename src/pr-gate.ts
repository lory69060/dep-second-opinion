/**
 * Decide whether this PR is in-scope for dependency second opinion.
 * Prefer Dependabot/Renovate; also allow manual PRs that only touch package manifests.
 */
export interface PrGateInput {
  actor?: string;
  title?: string;
  labels?: string[];
  changedPaths?: string[];
}

export interface PrGateResult {
  review: boolean;
  reason: string;
  kind: "dependabot" | "renovate" | "deps_title" | "manifest_only" | "skip";
}

const BOT_ACTORS = [
  /^dependabot(\[bot\])?$/i,
  /^renovate(\[bot\])?$/i,
  /^dependabot-preview(\[bot\])?$/i,
];

const DEPS_TITLE =
  /\b(dependabot|renovate|bump|dependencies|deps?)\b|\bchore\s*\(\s*deps(?:-dev)?\s*\)/i;

const MANIFEST_PATH =
  /(^|\/)(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|npm-shrinkwrap\.json)$/;

export function isDependencyBot(actor: string | undefined): boolean {
  if (!actor) return false;
  return BOT_ACTORS.some((re) => re.test(actor.trim()));
}

export function shouldReviewPullRequest(input: PrGateInput): PrGateResult {
  const actor = input.actor?.trim() ?? "";
  const title = input.title?.trim() ?? "";
  const labels = (input.labels ?? []).map((l) => l.toLowerCase());
  const paths = input.changedPaths ?? [];

  if (isDependencyBot(actor)) {
    return {
      review: true,
      reason: `author looks like a dependency bot (${actor})`,
      kind: actor.toLowerCase().includes("renovate") ? "renovate" : "dependabot",
    };
  }

  if (labels.some((l) => l === "dependencies" || l.includes("dependabot") || l.includes("renovate"))) {
    return {
      review: true,
      reason: "PR labeled as dependency-related",
      kind: "deps_title",
    };
  }

  if (DEPS_TITLE.test(title)) {
    return {
      review: true,
      reason: "PR title matches dependency-upgrade patterns",
      kind: "deps_title",
    };
  }

  const manifestChanges = paths.filter((p) => MANIFEST_PATH.test(p));
  const nonManifest = paths.filter((p) => !MANIFEST_PATH.test(p));

  if (manifestChanges.length > 0 && nonManifest.length === 0) {
    return {
      review: true,
      reason: "PR only changes package manifests/lockfiles",
      kind: "manifest_only",
    };
  }

  if (manifestChanges.length === 0) {
    return {
      review: false,
      reason: "no package manifest changes",
      kind: "skip",
    };
  }

  return {
    review: false,
    reason:
      "package.json changed together with non-manifest files, and author/title is not dependency-bot-like — skipping to avoid noise",
    kind: "skip",
  };
}
