import { formatMarkdown } from "./format-comment.js";
import { diffPackageJson, parsePackageJsonText } from "./parse.js";
import { buildReviewResult } from "./score.js";
import { fetchNpmMeta } from "./signals/npm-meta.js";
import { queryOsvNpm } from "./signals/osv.js";
import type {
  ChangeAnalysis,
  DependencyChange,
  PackageMeta,
  ReviewResult,
} from "./types.js";

export interface AnalyzeOptions {
  /** Skip network calls (OSV + npm). Useful for offline unit tests. */
  offline?: boolean;
  /** Injected fetch for tests. */
  fetchImpl?: typeof fetch;
  /** Precomputed vulnerability map: "name@version" -> vuln ids present (offline stubs). */
  osvStub?: Record<string, Array<{ id: string; summary: string }>>;
  metaStub?: Record<string, { deprecated?: string; latestVersion?: string }>;
}

async function enrichChange(
  change: DependencyChange,
  options: AnalyzeOptions,
): Promise<ChangeAnalysis> {
  const notes: string[] = [];
  const key = `${change.name}@${change.toVersion ?? ""}`;

  let osv = options.osvStub?.[key] ?? [];
  let meta: PackageMeta | null = options.metaStub?.[change.name]
    ? {
        name: change.name,
        latestVersion: options.metaStub[change.name].latestVersion,
        deprecated: options.metaStub[change.name].deprecated,
      }
    : null;

  if (!options.offline && change.toVersion) {
    const fetchImpl = options.fetchImpl ?? fetch;
    try {
      osv = await queryOsvNpm(change.name, change.toVersion, fetchImpl);
    } catch (err) {
      notes.push(`OSV lookup failed: ${(err as Error).message}`);
    }
    try {
      meta = await fetchNpmMeta(change.name, change.toVersion, fetchImpl);
    } catch (err) {
      notes.push(`npm meta lookup failed: ${(err as Error).message}`);
    }
  }

  if (change.bump === "major") {
    notes.push("Major version bump — review changelog for breaking changes.");
  }
  if (change.section === "devDependencies" && change.bump === "major") {
    notes.push("Dev-only major bump: lower runtime risk, still check tooling breakage.");
  }

  return {
    change,
    osv,
    meta,
    notes,
    localScore: 0,
    evidence: [],
  };
}

export async function analyzeChanges(
  changes: DependencyChange[],
  options: AnalyzeOptions = {},
): Promise<ReviewResult> {
  const enriched: ChangeAnalysis[] = [];
  for (const change of changes) {
    enriched.push(await enrichChange(change, options));
  }
  const result = buildReviewResult(enriched);
  result.markdown = formatMarkdown(result);
  return result;
}

export async function analyzePackageJsonPair(
  beforeText: string,
  afterText: string,
  options: AnalyzeOptions = {},
): Promise<ReviewResult> {
  const before = parsePackageJsonText(beforeText);
  const after = parsePackageJsonText(afterText);
  const changes = diffPackageJson(before, after);
  return analyzeChanges(changes, options);
}
