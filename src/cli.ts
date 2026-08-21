#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { analyzePackageJsonPair } from "./analyze.js";
import { shouldReviewPullRequest } from "./pr-gate.js";
import { formatMarkdown } from "./format-comment.js";

function printHelp(): void {
  console.log(`dep-review — dependency PR second opinion (npm)

Usage:
  dep-review analyze --from <before.package.json> --to <after.package.json> [options]
  dep-review help

Options:
  --json              Print full ReviewResult JSON (includes markdown)
  --offline           Skip OSV / npm network calls
  --actor <login>     PR author (for Dependabot/Renovate gating)
  --title <title>     PR title
  --labels <a,b>      Comma-separated labels
  --changed <paths>   Comma-separated changed file paths (for gate)
  --help              Show this help
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

  const actor = getFlag(args, "--actor");
  const title = getFlag(args, "--title");
  const labelsRaw = getFlag(args, "--labels");
  const changedRaw = getFlag(args, "--changed");
  const labels = labelsRaw ? labelsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const changedPaths = changedRaw
    ? changedRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  // Gate only when caller provides PR context.
  if (actor || title || labels.length || changedPaths) {
    const gate = shouldReviewPullRequest({ actor, title, labels, changedPaths });
    if (!gate.review) {
      const skipped = {
        verdict: "NO_COMMENT" as const,
        confidence: 1,
        summary: gate.reason,
        reasons: [gate.reason],
        changes: [],
        markdown: "",
        noCommentReason: "skip_non_dependency_pr",
      };
      skipped.markdown = formatMarkdown(skipped);
      if (has(args, "--json")) console.log(JSON.stringify(skipped, null, 2));
      else console.log(skipped.markdown);
      return;
    }
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
