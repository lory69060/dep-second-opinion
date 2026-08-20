import type { OsvVulnerability } from "../types.js";

interface OsvQueryResponse {
  vulns?: Array<{
    id: string;
    summary?: string;
    aliases?: string[];
    severity?: Array<{ type?: string; score?: string }>;
    references?: Array<{ url?: string }>;
  }>;
}

export async function queryOsvNpm(
  name: string,
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<OsvVulnerability[]> {
  const body = {
    package: { name, ecosystem: "npm" },
    version,
  };

  const res = await fetchImpl("https://api.osv.dev/v1/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`OSV query failed for ${name}@${version}: HTTP ${res.status}`);
  }

  const data = (await res.json()) as OsvQueryResponse;
  return (data.vulns ?? []).map((v) => ({
    id: v.id,
    summary: v.summary ?? "(no summary)",
    severity: v.severity?.[0]?.score,
    aliases: v.aliases,
    references: (v.references ?? [])
      .map((r) => r.url)
      .filter((u): u is string => Boolean(u)),
  }));
}
