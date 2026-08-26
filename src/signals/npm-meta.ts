import type { PackageMeta, RegistryStatus } from "../types.js";

interface NpmRegistryResponse {
  name?: string;
  description?: string;
  "dist-tags"?: { latest?: string };
  time?: Record<string, string | undefined> & {
    created?: string;
    modified?: string;
  };
  license?: string;
  repository?: string | { url?: string; type?: string };
  versions?: Record<string, { deprecated?: string; license?: string }>;
}

function hasRepositoryField(
  repository: NpmRegistryResponse["repository"],
): boolean {
  if (!repository) return false;
  if (typeof repository === "string") return repository.trim().length > 0;
  return Boolean(repository.url && repository.url.trim().length > 0);
}

export async function fetchNpmMeta(
  name: string,
  version: string | null,
  fetchImpl: typeof fetch = fetch,
): Promise<PackageMeta> {
  const encoded = name
    .split("/")
    .map((p) => encodeURIComponent(p))
    .join("/");
  const res = await fetchImpl(`https://registry.npmjs.org/${encoded}`, {
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    return { name, registryStatus: "package_missing" };
  }
  if (!res.ok) {
    throw new Error(`npm registry failed for ${name}: HTTP ${res.status}`);
  }

  const data = (await res.json()) as NpmRegistryResponse;
  const versions = data.versions ?? {};
  let registryStatus: RegistryStatus = "ok";
  if (version && !versions[version]) {
    registryStatus = "version_missing";
  }

  const deprecated =
    version && versions[version]?.deprecated
      ? versions[version].deprecated
      : undefined;

  const versionPublished =
    version && data.time?.[version] ? data.time[version] : undefined;

  return {
    name: data.name ?? name,
    registryStatus,
    latestVersion: data["dist-tags"]?.latest,
    created: data.time?.created,
    versionPublished,
    modified: data.time?.modified,
    description: data.description,
    license: version
      ? versions[version]?.license ?? data.license
      : data.license,
    deprecated,
    hasRepository: hasRepositoryField(data.repository),
  };
}

/** Optional weekly downloads; returns undefined on failure (non-fatal). */
export async function fetchNpmWeeklyDownloads(
  name: string,
  fetchImpl: typeof fetch = fetch,
): Promise<number | undefined> {
  const encoded = name
    .split("/")
    .map((p) => encodeURIComponent(p))
    .join("/");
  const res = await fetchImpl(
    `https://api.npmjs.org/downloads/point/last-week/${encoded}`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) return undefined;
  const data = (await res.json()) as { downloads?: number };
  return typeof data.downloads === "number" ? data.downloads : undefined;
}

/** Age in whole days from an ISO timestamp to now; null if unparseable. */
export function ageDaysSince(iso: string | undefined, nowMs: number = Date.now()): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((nowMs - t) / (24 * 60 * 60 * 1000));
}
