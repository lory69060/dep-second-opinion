import type { ChangeAnalysis, Finding, FindingSeverity } from "./types.js";

function severityForBump(bump: string): FindingSeverity {
  if (bump === "major") return "medium";
  if (bump === "minor") return "low";
  return "info";
}

/** Build machine-readable findings from enriched change analyses (comment/JSON consumers). */
export function buildFindings(changes: ChangeAnalysis[]): Finding[] {
  const findings: Finding[] = [];

  for (const item of changes) {
    const pkg = item.change.name;
    const from = item.change.fromVersion ?? "∅";
    const to = item.change.toVersion ?? "∅";

    findings.push({
      finding_id: `bump:${pkg}:${item.change.bump}`,
      severity: severityForBump(item.change.bump),
      package: pkg,
      signal: `bump_${item.change.bump}`,
      evidence_urls: [],
      summary: `${pkg} ${from} → ${to} (${item.change.section}, ${item.change.bump})`,
    });

    if (item.meta?.registryStatus === "package_missing") {
      findings.push({
        finding_id: `registry:package_missing:${pkg}`,
        severity: "high",
        package: pkg,
        signal: "registry_package_missing",
        evidence_urls: [`https://www.npmjs.com/package/${encodeURIComponent(pkg)}`],
        summary: `Package ${pkg} not found on npm (possible hallucinated dependency)`,
      });
    } else if (item.meta?.registryStatus === "version_missing") {
      findings.push({
        finding_id: `registry:version_missing:${pkg}@${to}`,
        severity: "high",
        package: pkg,
        signal: "registry_version_missing",
        evidence_urls: [`https://www.npmjs.com/package/${encodeURIComponent(pkg)}`],
        summary: `Version ${to} of ${pkg} is not published on npm`,
      });
    }

    if (item.meta?.deprecated) {
      findings.push({
        finding_id: `deprecated:${pkg}`,
        severity: "high",
        package: pkg,
        signal: "npm_deprecated",
        evidence_urls: [`https://www.npmjs.com/package/${encodeURIComponent(pkg)}`],
        summary: `Deprecated on npm: ${item.meta.deprecated}`,
      });
    }

    for (const v of item.osv) {
      const urls = [
        `https://osv.dev/vulnerability/${encodeURIComponent(v.id)}`,
        ...(v.references ?? []).slice(0, 3),
      ];
      findings.push({
        finding_id: `osv:${pkg}:${v.id}`,
        severity: "high",
        package: pkg,
        signal: "osv",
        evidence_urls: urls,
        summary: `${v.id}: ${v.summary}`,
      });
    }

    for (const e of item.evidence) {
      if (e.startsWith("supply_chain:")) {
        const slug = e.replace(/^supply_chain:\s*/, "").slice(0, 48);
        findings.push({
          finding_id: `supply_chain:${pkg}:${slug.replace(/\s+/g, "_")}`,
          severity: "medium",
          package: pkg,
          signal: "supply_chain",
          evidence_urls: [],
          summary: e,
        });
      }
    }
  }

  return findings;
}
