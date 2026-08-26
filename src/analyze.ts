import { formatMarkdown } from "./format-comment.js";
import { diffPackageJson, parsePackageJsonText } from "./parse.js";
import { DEFAULT_POLICY, type Policy } from "./policy/types.js";
import { buildReviewResult } from "./score.js";
import { fetchNpmMeta, fetchNpmWeeklyDownloads } from "./signals/npm-meta.js";
import { queryOsvNpm } from "./signals/osv.js";
import type {
  ChangeAnalysis,
  DependencyChange,
  PackageMeta,
  RegistryStatus,
  ReviewResult,
} from "./types.js";

export interface MetaStub {
  deprecated?: string;
  latestVersion?: string;
  registryStatus?: RegistryStatus;
  created?: string;
  versionPublished?: string;
  hasRepository?: boolean;
  weeklyDownloads?: number;
}

export interface AnalyzeOptions {
  /** Skip network calls (OSV + npm). Useful for offline unit tests. */
  offline?: boolean;
  /** Injected fetch for tests. */
  fetchImpl?: typeof fetch;
  /** Precomputed vulnerability map: "name@version" -> vuln ids present (offline stubs). */
  osvStub?: Record<string, Array<{ id: string; summary: string }>>;
  metaStub?: Record<string, MetaStub>;
  policy?: Policy;
  policySource?: string | null;
  /** Injected clock for supply-chain age checks (tests). */
  nowMs?: number;
}

async function enrichChange(
  change: DependencyChange,
  options: AnalyzeOptions,
): Promise<ChangeAnalysis> {
  const notes: string[] = [];
  const key = `${change.name}@${change.toVersion ?? ""}`;
  const policy = options.policy ?? DEFAULT_POLICY;

  let osv = options.osvStub?.[key] ?? [];
  let meta: PackageMeta | null = null;

  if (options.metaStub?.[change.name]) {
    const stub = options.metaStub[change.name]!;
    meta = {
      name: change.name,
      registryStatus: stub.registryStatus ?? "ok",
      latestVersion: stub.latestVersion,
      deprecated: stub.deprecated,
      created: stub.created,
      versionPublished: stub.versionPublished,
      hasRepository: stub.hasRepository,
      weeklyDownloads: stub.weeklyDownloads,
    };
  } else if (options.offline) {
    meta = { name: change.name, registryStatus: "skipped" };
  }

  if (!options.offline && change.toVersion && !options.metaStub?.[change.name]) {
    const fetchImpl = options.fetchImpl ?? fetch;
    try {
      osv = await queryOsvNpm(change.name, change.toVersion, fetchImpl);
    } catch (err) {
      notes.push(`OSV lookup failed: ${(err as Error).message}`);
    }
    try {
      meta = await fetchNpmMeta(change.name, change.toVersion, fetchImpl);
      if (
        meta.registryStatus === "ok" &&
        policy.supplyChain.minWeeklyDownloads > 0 &&
        change.fromVersion === null
      ) {
        const downloads = await fetchNpmWeeklyDownloads(change.name, fetchImpl);
        if (typeof downloads === "number") {
          meta = { ...meta, weeklyDownloads: downloads };
        }
      }
    } catch (err) {
      notes.push(`npm meta lookup failed: ${(err as Error).message}`);
      meta = { name: change.name, registryStatus: "lookup_failed" };
    }
  }

  if (change.bump === "major") {
    notes.push("Major version bump — review changelog for breaking changes.");
  }
  if (change.section === "devDependencies" && change.bump === "major") {
    notes.push("Dev-only major bump: lower runtime risk, still check tooling breakage.");
  }
  if (meta?.registryStatus === "package_missing") {
    notes.push(
      "Package name not on npm — treat as possible LLM hallucination / slopsquat until verified.",
    );
  }
  if (meta?.registryStatus === "version_missing") {
    notes.push("Target version is not published — do not merge until the version exists.");
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
  const policy = options.policy ?? DEFAULT_POLICY;
  const enriched: ChangeAnalysis[] = [];
  for (const change of changes) {
    if (policy.ignore.includes(change.name)) continue;
    enriched.push(await enrichChange(change, options));
  }
  const result = buildReviewResult(enriched, policy, options.nowMs ?? Date.now());
  result.markdown = formatMarkdown(result, options.policySource ?? null);
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
