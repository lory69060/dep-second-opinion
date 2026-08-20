#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { analyzePackageJsonPair } from "./analyze.js";

function printHelp(): void {
  console.log(`dep-review — dependency PR second opinion (npm)

Usage:
  dep-review analyze --from <before.package.json> --to <after.package.json> [--json] [--offline]
  dep-review help

Options:
  --json      Print full ReviewResult JSON (includes markdown)
  --offline   Skip OSV / npm network calls
  --help      Show this help
`);
}

function getFlag(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function has(args: string[], name: string): boolean {
  return args.includes(name);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const cmd = args[0] ?? "help";

  if (cmd === "help" || has(args, "--help") || has(args, "-h")) {
    printHelp();
    return;
  }

  if (cmd !== "analyze") {
    console.error(`Unknown command: ${cmd}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  const fromPath = getFlag(args, "--from");
  const toPath = getFlag(args, "--to");
  if (!fromPath || !toPath) {
    console.error("analyze requires --from and --to");
    printHelp();
    process.exitCode = 1;
    return;
  }

  const beforeText = await readFile(path.resolve(fromPath), "utf8");
  const afterText = await readFile(path.resolve(toPath), "utf8");
  const result = await analyzePackageJsonPair(beforeText, afterText, {
    offline: has(args, "--offline"),
  });

  if (has(args, "--json")) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result.markdown);
  }

  if (result.verdict === "HIGH_RISK") process.exitCode = 2;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
