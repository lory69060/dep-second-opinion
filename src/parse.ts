import type { DependencyChange, DependencySection, VersionBump } from "./types.js";

function parseSemverParts(version: string): number[] | null {
  const cleaned = version.replace(/^v/, "").split("-")[0]?.split("+")[0];
  if (!cleaned) return null;
  const parts = cleaned.split(".").map((p) => Number.parseInt(p, 10));
  if (parts.length < 1 || parts.some((n) => Number.isNaN(n))) return null;
  while (parts.length < 3) parts.push(0);
  return parts.slice(0, 3);
}

export function classifyBump(
  fromVersion: string | null,
  toVersion: string | null,
): VersionBump {
  if (!fromVersion || !toVersion) return "unknown";
  if (fromVersion.includes("-") || toVersion.includes("-")) return "prerelease";
  const from = parseSemverParts(fromVersion);
  const to = parseSemverParts(toVersion);
  if (!from || !to) return "unknown";
  if (to[0] !== from[0]) return "major";
  if (to[1] !== from[1]) return "minor";
  if (to[2] !== from[2]) return "patch";
  return "unknown";
}

type PackageJsonDeps = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

type DepEntry = { version: string; section: DependencySection };

const SECTIONS: DependencySection[] = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

function stripRange(range: string): string {
  return range.replace(/^[\^~>=<\s]+/, "").trim();
}

function collectDeps(pkg: PackageJsonDeps): Map<string, DepEntry> {
  const map = new Map<string, DepEntry>();
  for (const section of SECTIONS) {
    const block = pkg[section];
    if (!block) continue;
    for (const [name, range] of Object.entries(block)) {
      // Prefer production section if duplicated.
      if (map.has(name) && section !== "dependencies") continue;
      map.set(name, { version: stripRange(range), section });
    }
  }
  return map;
}

/** Compare two package.json objects and emit dependency version changes. */
export function diffPackageJson(
  before: PackageJsonDeps,
  after: PackageJsonDeps,
): DependencyChange[] {
  const beforeMap = collectDeps(before);
  const afterMap = collectDeps(after);
  const names = new Set([...beforeMap.keys(), ...afterMap.keys()]);
  const changes: DependencyChange[] = [];

  for (const name of names) {
    const from = beforeMap.get(name);
    const to = afterMap.get(name);
    const fromVersion = from?.version ?? null;
    const toVersion = to?.version ?? null;
    if (fromVersion === toVersion && from?.section === to?.section) continue;
    if (fromVersion === toVersion) continue;
    changes.push({
      name,
      ecosystem: "npm",
      fromVersion,
      toVersion,
      bump: classifyBump(fromVersion, toVersion),
      section: to?.section ?? from?.section ?? "dependencies",
    });
  }

  return changes.sort((a, b) => a.name.localeCompare(b.name));
}

export function parsePackageJsonText(text: string): PackageJsonDeps {
  return JSON.parse(text) as PackageJsonDeps;
}
