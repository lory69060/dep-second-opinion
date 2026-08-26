import type { VersionBump } from "../types.js";

export type EscalateLevel = "review" | "high_risk";
/** Escalate, or skip the signal entirely. */
export type SignalAction = EscalateLevel | "ignore";
export type AutoMergeMaxBump = "none" | "patch" | "minor" | "major";

export interface ScopePolicy {
  /** Bumps at or below this may be SAFE_TO_MERGE when no hard signals fire. */
  autoMergeMaxBump: AutoMergeMaxBump;
  /** How to treat major bumps in this scope. */
  major: EscalateLevel;
}

export interface SupplyChainPolicy {
  /**
   * For newly added deps (no fromVersion): REVIEW/HIGH when package `created`
   * is newer than this many days. `0` disables the age check.
   */
  newPackageMaxAgeDays: number;
  onNewPackage: SignalAction;
  /** When true, missing `repository` on registry → onNewPackage action (added deps only). */
  requireRepository: boolean;
  /**
   * When > 0, weekly downloads below this (added deps only) → onNewPackage action.
   * `0` disables download checks (avoids network + false positives).
   */
  minWeeklyDownloads: number;
}

export interface Policy {
  version: 1;
  /** When true, use PR gate (Dependabot/Renovate / deps-only). Default true. */
  requireDependencyContext: boolean;
  production: ScopePolicy;
  development: ScopePolicy;
  onOsv: EscalateLevel;
  onDeprecated: EscalateLevel;
  /** Package or target version not on npm (slopsquat / hallucinated name). */
  onRegistryMissing: EscalateLevel;
  supplyChain: SupplyChainPolicy;
  /** Exact package names to ignore. */
  ignore: string[];
}

export const DEFAULT_POLICY: Policy = {
  version: 1,
  requireDependencyContext: true,
  production: {
    autoMergeMaxBump: "patch",
    major: "review",
  },
  development: {
    autoMergeMaxBump: "minor",
    major: "review",
  },
  onOsv: "high_risk",
  onDeprecated: "high_risk",
  onRegistryMissing: "high_risk",
  supplyChain: {
    newPackageMaxAgeDays: 30,
    onNewPackage: "review",
    requireRepository: false,
    minWeeklyDownloads: 0,
  },
  ignore: [],
};

const BUMP_RANK: Record<VersionBump | AutoMergeMaxBump, number> = {
  none: -1,
  patch: 0,
  minor: 1,
  major: 2,
  prerelease: 2,
  unknown: 2,
};

export function bumpWithinAutoMerge(
  bump: VersionBump,
  max: AutoMergeMaxBump,
): boolean {
  if (max === "none") return false;
  if (bump === "prerelease" || bump === "unknown") return false;
  return BUMP_RANK[bump] <= BUMP_RANK[max];
}

export function mergePolicy(partial: Partial<Policy> | null | undefined): Policy {
  if (!partial) {
    return {
      ...DEFAULT_POLICY,
      production: { ...DEFAULT_POLICY.production },
      development: { ...DEFAULT_POLICY.development },
      supplyChain: { ...DEFAULT_POLICY.supplyChain },
      ignore: [],
    };
  }
  return {
    version: 1,
    requireDependencyContext:
      partial.requireDependencyContext ?? DEFAULT_POLICY.requireDependencyContext,
    production: {
      ...DEFAULT_POLICY.production,
      ...(partial.production ?? {}),
    },
    development: {
      ...DEFAULT_POLICY.development,
      ...(partial.development ?? {}),
    },
    onOsv: partial.onOsv ?? DEFAULT_POLICY.onOsv,
    onDeprecated: partial.onDeprecated ?? DEFAULT_POLICY.onDeprecated,
    onRegistryMissing: partial.onRegistryMissing ?? DEFAULT_POLICY.onRegistryMissing,
    supplyChain: {
      ...DEFAULT_POLICY.supplyChain,
      ...(partial.supplyChain ?? {}),
    },
    ignore: partial.ignore ?? [],
  };
}
