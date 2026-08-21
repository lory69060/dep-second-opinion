import { readFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_POLICY, mergePolicy, type Policy } from "./types.js";

const CANDIDATES = [
  ".dep-second-opinion.yml",
  ".dep-second-opinion.yaml",
  ".dep-second-opinion.json",
];

/** Minimal YAML subset for our policy file (no dependency). */
export function parsePolicyYaml(text: string): Partial<Policy> {
  const lines = text.split(/\r?\n/);
  const root: Record<string, unknown> = {};
  let section: string | null = null;
  let listKey: string | null = null;

  for (const raw of lines) {
    const line = raw.replace(/#.*$/, "");
    if (!line.trim()) continue;

    const listItem = line.match(/^\s+-\s+(.+)\s*$/);
    if (listItem && listKey) {
      const arr = (root[listKey] as string[]) ?? [];
      arr.push(stripQuotes(listItem[1]!.trim()));
      root[listKey] = arr;
      continue;
    }

    const nested = line.match(/^\s{2}([A-Za-z0-9_]+):\s*(.*?)\s*$/);
    if (nested && section) {
      const key = camelize(nested[1]!);
      const val = nested[2]!;
      const block = (root[section] as Record<string, unknown>) ?? {};
      if (val === "") {
        // ignore empty nested header
      } else {
        block[key] = coerce(val);
      }
      root[section] = block;
      listKey = null;
      continue;
    }

    const top = line.match(/^([A-Za-z0-9_]+):\s*(.*?)\s*$/);
    if (top) {
      const key = camelize(top[1]!);
      const val = top[2]!;
      section = null;
      listKey = null;
      if (val === "") {
        if (key === "ignore") {
          root[key] = [];
          listKey = key;
        } else {
          section = key;
          root[key] = root[key] ?? {};
        }
      } else {
        root[key] = coerce(val);
      }
    }
  }

  return root as Partial<Policy>;
}

function camelize(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function stripQuotes(v: string): string {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function coerce(val: string): string | boolean | number {
  const v = stripQuotes(val.trim());
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^\d+$/.test(v)) return Number(v);
  return v;
}

export async function loadPolicy(repoRoot: string): Promise<{ policy: Policy; source: string | null }> {
  for (const name of CANDIDATES) {
    const full = path.join(repoRoot, name);
    try {
      const text = await readFile(full, "utf8");
      const partial = name.endsWith(".json")
        ? (JSON.parse(text) as Partial<Policy>)
        : parsePolicyYaml(text);
      return { policy: mergePolicy(partial), source: name };
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") continue;
      throw err;
    }
  }
  return { policy: mergePolicy(DEFAULT_POLICY), source: null };
}

export function loadPolicyFromText(
  text: string,
  format: "yaml" | "json" = "yaml",
): Policy {
  const partial =
    format === "json" ? (JSON.parse(text) as Partial<Policy>) : parsePolicyYaml(text);
  return mergePolicy(partial);
}
