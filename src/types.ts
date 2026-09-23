export type Ecosystem = "npm";

export type VersionBump = "major" | "minor" | "patch" | "prerelease" | "unknown";

export type Verdict = "SAFE_TO_MERGE" | "REVIEW_RECOMMENDED" | "HIGH_RISK" | "NO_COMMENT";

export type DependencySection =
  | "dependencies"
  | "devDependencies"
  | "optionalDependencies"
  | "peerDependencies";

export interface DependencyChange {
  name: string;
  ecosystem: Ecosystem;
  fromVersion: string | null;
  toVersion: string | null;
  bump: VersionBump;
  section: DependencySection;
}

export interface OsvVulnerability {
  id: string;
  summary: string;
  severity?: string;
  aliases?: string[];
  references?: string[];
}

/** How the npm registry lookup resolved for this package/version. */
export type RegistryStatus =
  | "ok"
  | "package_missing"
  | "version_missing"
  | "lookup_failed"
  | "skipped";

export interface PackageMeta {
  name: string;
  registryStatus: RegistryStatus;
  latestVersion?: string;
  /** Package-level `time.created` from the registry (ISO). */
  created?: string;
  /** Publish time of the target version (ISO). */
  versionPublished?: string;
  modified?: string;
  description?: string;
  license?: string;
  deprecated?: string;
  /** True when `repository` is present on the registry document. */
  hasRepository?: boolean;
  /** Weekly download count when fetched; omit when not queried. */
  weeklyDownloads?: number;
}

export interface ChangeAnalysis {
  change: DependencyChange;
  osv: OsvVulnerability[];
  meta: PackageMeta | null;
  notes: string[];
  localScore: number;
  evidence: string[];
}

/** Machine-readable finding for CI / agent consumers (stable schema v1). */
export type FindingSeverity = "info" | "low" | "medium" | "high";

export interface Finding {
  finding_id: string;
  severity: FindingSeverity;
  package: string;
  signal: string;
  evidence_urls: string[];
  summary: string;
}

export interface ReviewResult {
  verdict: Verdict;
  confidence: number;
  summary: string;
  reasons: string[];
  changes: ChangeAnalysis[];
  /** Structured findings; Markdown is rendered from the same review. */
  findings: Finding[];
  markdown: string;
  noCommentReason?: string;
}
