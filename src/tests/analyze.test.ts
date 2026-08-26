import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { analyzeChanges, analyzePackageJsonPair } from "../analyze.js";
import { classifyBump, diffPackageJson } from "../parse.js";
import { mergePolicy } from "../policy/types.js";
import { shouldReviewPullRequest } from "../pr-gate.js";
import type { DependencyChange } from "../types.js";

const fixturesRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../fixtures");

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

test("registry package_missing is HIGH_RISK by default", async () => {
  const result = await analyzeChanges(
    [
      {
        name: "awesome-http-client-helper",
        ecosystem: "npm",
        fromVersion: null,
        toVersion: "1.0.0",
        bump: "unknown",
        section: "dependencies",
      },
    ],
    {
      offline: true,
      metaStub: {
        "awesome-http-client-helper": { registryStatus: "package_missing" },
      },
    },
  );
  assert.equal(result.verdict, "HIGH_RISK");
  assert.match(result.markdown, /not found|hallucinated|slopsquat|on_registry_missing/i);
});

test("registry version_missing is HIGH_RISK by default", async () => {
  const result = await analyzeChanges(
    [
      {
        name: "lodash",
        ecosystem: "npm",
        fromVersion: "4.17.20",
        toVersion: "99.99.99",
        bump: "major",
        section: "dependencies",
      },
    ],
    {
      offline: true,
      metaStub: {
        lodash: { registryStatus: "version_missing", latestVersion: "4.17.21" },
      },
    },
  );
  assert.equal(result.verdict, "HIGH_RISK");
  assert.match(result.markdown, /not published|version_missing|on_registry_missing/i);
});

test("on_registry_missing=review can downgrade missing package", async () => {
  const result = await analyzeChanges(
    [
      {
        name: "ghost-pkg",
        ecosystem: "npm",
        fromVersion: null,
        toVersion: "1.0.0",
        bump: "unknown",
        section: "dependencies",
      },
    ],
    {
      offline: true,
      policy: mergePolicy({ onRegistryMissing: "review" }),
      metaStub: { "ghost-pkg": { registryStatus: "package_missing" } },
    },
  );
  assert.equal(result.verdict, "REVIEW_RECOMMENDED");
});

test("newly added young package is REVIEW under default supply_chain", async () => {
  const nowMs = Date.parse("2026-08-22T00:00:00.000Z");
  const created = "2026-08-10T00:00:00.000Z"; // 12 days old
  const result = await analyzeChanges(
    [
      {
        name: "brand-new-pkg",
        ecosystem: "npm",
        fromVersion: null,
        toVersion: "0.1.0",
        bump: "unknown",
        section: "dependencies",
      },
    ],
    {
      offline: true,
      nowMs,
      metaStub: {
        "brand-new-pkg": {
          registryStatus: "ok",
          created,
          hasRepository: true,
        },
      },
    },
  );
  assert.equal(result.verdict, "REVIEW_RECOMMENDED");
  assert.match(result.markdown, /supply_chain\.on_new_package|new_package_age/i);
});

test("old newly-added package does not fire age flag (still REVIEW on unknown bump)", async () => {
  const nowMs = Date.parse("2026-08-22T00:00:00.000Z");
  const created = "2020-01-01T00:00:00.000Z";
  const result = await analyzeChanges(
    [
      {
        name: "left-pad",
        ecosystem: "npm",
        fromVersion: null,
        toVersion: "1.3.0",
        bump: "unknown",
        section: "dependencies",
      },
    ],
    {
      offline: true,
      nowMs,
      metaStub: {
        "left-pad": { registryStatus: "ok", created, hasRepository: true },
      },
    },
  );
  assert.equal(result.verdict, "REVIEW_RECOMMENDED");
  assert.equal(
    result.reasons.some((r) => /new_package_age|supply_chain\.on_new_package/.test(r)),
    false,
  );
});

test("fixture npm-hallucinated + metaStub → HIGH_RISK", async () => {
  const before = await readFile(
    path.join(fixturesRoot, "npm-hallucinated/before.package.json"),
    "utf8",
  );
  const after = await readFile(
    path.join(fixturesRoot, "npm-hallucinated/after.package.json"),
    "utf8",
  );
  const result = await analyzePackageJsonPair(before, after, {
    offline: true,
    metaStub: {
      lodash: { registryStatus: "ok", created: "2012-01-01T00:00:00.000Z" },
      "awesome-http-client-helper": { registryStatus: "package_missing" },
    },
  });
  assert.equal(result.verdict, "HIGH_RISK");
});
