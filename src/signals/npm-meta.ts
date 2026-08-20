import type { PackageMeta } from "../types.js";

interface NpmRegistryResponse {
  name?: string;
  description?: string;
  "dist-tags"?: { latest?: string };
  time?: { modified?: string };
  license?: string;
  versions?: Record<string, { deprecated?: string; license?: string }>;
}

export async function fetchNpmMeta(
  name: string,
  version: string | null,
  fetchImpl: typeof fetch = fetch,
): Promise<PackageMeta | null> {
  const encoded = name
    .split("/")
    .map((p) => encodeURIComponent(p))
    .join("/");
  const res = await fetchImpl(`https://registry.npmjs.org/${encoded}`, {
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`npm registry failed for ${name}: HTTP ${res.status}`);
  }

  const data = (await res.json()) as NpmRegistryResponse;
  const deprecated =
    version && data.versions?.[version]?.deprecated
      ? data.versions[version].deprecated
      : undefined;

  return {
    name: data.name ?? name,
    latestVersion: data["dist-tags"]?.latest,
    modified: data.time?.modified,
    description: data.description,
    license: version
      ? data.versions?.[version]?.license ?? data.license
      : data.license,
    deprecated,
  };
}
