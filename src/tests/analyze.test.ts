import assert from "node:assert/strict";
import test from "node:test";
import { analyzeChanges, analyzePackageJsonPair } from "../analyze.js";
import { classifyBump, diffPackageJson } from "../parse.js";
import type { DependencyChange } from "../types.js";

test("classifyBump detects major/minor/patch", () => {
  assert.equal(classifyBump("1.2.3", "2.0.0"), "major");
  assert.equal(classifyBump("1.2.3", "1.3.0"), "minor");
  assert.equal(classifyBump("1.2.3", "1.2.4"), "patch");
});

test("diffPackageJson finds version changes only", () => {
  const changes = diffPackageJson(
    { dependencies: { leftpad: "1.0.0", lodash: "4.17.20" } },
    { dependencies: { leftpad: "1.0.0", lodash: "4.17.21" } },
  );
  assert.equal(changes.length, 1);
  assert.equal(changes[0]?.name, "lodash");
  assert.equal(changes[0]?.bump, "patch");
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

test("SAFE_TO_MERGE for offline patch bump without vulns", async () => {
  const changes: DependencyChange[] = [
    {
      name: "lodash",
      ecosystem: "npm",
      fromVersion: "4.17.20",
      toVersion: "4.17.21",
      bump: "patch",
    },
  ];
  const result = await analyzeChanges(changes, { offline: true });
  assert.equal(result.verdict, "SAFE_TO_MERGE");
  assert.match(result.markdown, /SAFE_TO_MERGE|可合并/);
});

test("OSV hit on patch bump recommends review", async () => {
  const result = await analyzeChanges(
    [
      {
        name: "demo-pkg",
        ecosystem: "npm",
        fromVersion: "1.0.0",
        toVersion: "1.0.1",
        bump: "patch",
      },
    ],
    {
      offline: true,
      osvStub: {
        "demo-pkg@1.0.1": [{ id: "GHSA-test", summary: "demo vuln" }],
      },
    },
  );
  assert.equal(result.verdict, "REVIEW_RECOMMENDED");
  assert.match(result.markdown, /GHSA-test/);
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
      },
    ],
    {
      offline: true,
      metaStub: { "old-pkg": { deprecated: "use new-pkg instead" } },
    },
  );
  assert.equal(result.verdict, "HIGH_RISK");
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
      },
    ],
    { offline: true },
  );
  assert.equal(result.verdict, "REVIEW_RECOMMENDED");
});
