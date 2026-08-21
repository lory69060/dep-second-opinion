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

export interface PackageMeta {
  name: string;
  latestVersion?: string;
  modified?: string;
  description?: string;
  license?: string;
  deprecated?: string;
}

export interface ChangeAnalysis {
  change: DependencyChange;
  osv: OsvVulnerability[];
  meta: PackageMeta | null;
  notes: string[];
  localScore: number;
  evidence: string[];
}

export interface ReviewResult {
  verdict: Verdict;
  confidence: number;
  summary: string;
  reasons: string[];
  changes: ChangeAnalysis[];
  markdown: string;
  noCommentReason?: string;
}
