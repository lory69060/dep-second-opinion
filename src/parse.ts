import type { DependencyChange, VersionBump } from "./types.js";

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

function collectDeps(pkg: PackageJsonDeps): Map<string, string> {
  const map = new Map<string, string>();
  for (const section of [
    pkg.dependencies,
    pkg.devDependencies,
    pkg.optionalDependencies,
    pkg.peerDependencies,
  ]) {
    if (!section) continue;
    for (const [name, range] of Object.entries(section)) {
      map.set(name, range.replace(/^[\^~>=<\s]+/, "").trim());
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
    const fromVersion = beforeMap.get(name) ?? null;
    const toVersion = afterMap.get(name) ?? null;
    if (fromVersion === toVersion) continue;
    changes.push({
      name,
      ecosystem: "npm",
      fromVersion,
      toVersion,
      bump: classifyBump(fromVersion, toVersion),
    });
  }

  return changes.sort((a, b) => a.name.localeCompare(b.name));
}

export function parsePackageJsonText(text: string): PackageJsonDeps {
  return JSON.parse(text) as PackageJsonDeps;
}
