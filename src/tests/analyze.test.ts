import assert from "node:assert/strict";
import test from "node:test";
import { analyzeChanges, analyzePackageJsonPair } from "../analyze.js";
import { classifyBump, diffPackageJson } from "../parse.js";
import { shouldReviewPullRequest } from "../pr-gate.js";
import type { DependencyChange } from "../types.js";

test("classifyBump detects major/minor/patch", () => {
  assert.equal(classifyBump("1.2.3", "2.0.0"), "major");
  assert.equal(classifyBump("1.2.3", "1.3.0"), "minor");
  assert.equal(classifyBump("1.2.3", "1.2.4"), "patch");
});

test("diffPackageJson finds version changes only and keeps section", () => {
  const changes = diffPackageJson(
    { dependencies: { leftpad: "1.0.0", lodash: "4.17.20" } },
    { dependencies: { leftpad: "1.0.0", lodash: "4.17.21" } },
  );
  assert.equal(changes.length, 1);
  assert.equal(changes[0]?.name, "lodash");
  assert.equal(changes[0]?.bump, "patch");
  assert.equal(changes[0]?.section, "dependencies");
});

test("NO_COMMENT when no dependency changes", async () => {
  const before = JSON.stringify({
    name: "demo",
    dependencies: { lodash: "4.17.21" },
  });
  const result = await analyzePackageJsonPair(before, before, { offline: true });
  assert.equal(result.verdict, "NO_COMMENT");
  assert.match(result.markdown, /NO_COMMENT/);
});

test("SAFE_TO_MERGE for offline patch bump without vulns includes Why section", async () => {
  const changes: DependencyChange[] = [
    {
      name: "lodash",
      ecosystem: "npm",
      fromVersion: "4.17.20",
      toVersion: "4.17.21",
      bump: "patch",
      section: "dependencies",
    },
  ];
  const result = await analyzeChanges(changes, { offline: true });
  assert.equal(result.verdict, "SAFE_TO_MERGE");
  assert.match(result.markdown, /SAFE_TO_MERGE|可合并/);
  assert.match(result.markdown, /Why this verdict/);
  assert.ok(result.reasons.length > 0);
});

test("OSV hit on patch bump is HIGH_RISK under default policy", async () => {
  const result = await analyzeChanges(
    [
      {
        name: "demo-pkg",
        ecosystem: "npm",
        fromVersion: "1.0.0",
        toVersion: "1.0.1",
        bump: "patch",
        section: "dependencies",
      },
    ],
    {
      offline: true,
      osvStub: {
        "demo-pkg@1.0.1": [{ id: "GHSA-test", summary: "demo vuln" }],
      },
    },
  );
  assert.equal(result.verdict, "HIGH_RISK");
  assert.match(result.markdown, /GHSA-test/);
  assert.match(result.markdown, /on_osv=high_risk/);
});

test("deprecated package is HIGH_RISK", async () => {
  const result = await analyzeChanges(
    [
      {
        name: "old-pkg",
        ecosystem: "npm",
        fromVersion: "1.0.0",
        toVersion: "1.0.1",
        bump: "patch",
        section: "dependencies",
      },
    ],
    {
      offline: true,
      metaStub: { "old-pkg": { deprecated: "use new-pkg instead" } },
    },
  );
  assert.equal(result.verdict, "HIGH_RISK");
  assert.match(result.markdown, /deprecated/i);
});

test("major bump recommends review", async () => {
  const result = await analyzeChanges(
    [
      {
        name: "react",
        ecosystem: "npm",
        fromVersion: "17.0.2",
        toVersion: "18.2.0",
        bump: "major",
        section: "dependencies",
      },
    ],
    { offline: true },
  );
  assert.equal(result.verdict, "REVIEW_RECOMMENDED");
  assert.match(result.markdown, /production major bump|production dependency/i);
});

test("devDependency major is softer wording but still review", async () => {
  const result = await analyzeChanges(
    [
      {
        name: "typescript",
        ecosystem: "npm",
        fromVersion: "4.9.5",
        toVersion: "5.8.2",
        bump: "major",
        section: "devDependencies",
      },
    ],
    { offline: true },
  );
  assert.equal(result.verdict, "REVIEW_RECOMMENDED");
  assert.match(result.markdown, /dev major|devDependency|Dev-only/i);
});

test("pr-gate allows dependabot and skips mixed feature PRs", () => {
  assert.equal(
    shouldReviewPullRequest({ actor: "dependabot[bot]", changedPaths: ["package.json", "src/a.ts"] })
      .review,
    true,
  );
  assert.equal(
    shouldReviewPullRequest({
      actor: "alice",
      title: "feat: new UI",
      changedPaths: ["package.json", "src/ui.tsx"],
    }).review,
    false,
  );
  assert.equal(
    shouldReviewPullRequest({
      actor: "alice",
      title: "chore(deps): bump lodash",
      changedPaths: ["package.json", "src/ui.tsx"],
    }).review,
    true,
  );
  assert.equal(
    shouldReviewPullRequest({
      actor: "alice",
      title: "manual bump",
      changedPaths: ["package.json", "pnpm-lock.yaml"],
    }).review,
    true,
  );
});
