import assert from "node:assert/strict";
import test from "node:test";
import { loadPolicyFromText } from "../policy/load.js";
import { analyzeChanges } from "../analyze.js";
import { bumpWithinAutoMerge, mergePolicy } from "../policy/types.js";

test("parsePolicyYaml reads nested scopes", () => {
  const policy = loadPolicyFromText(`
version: 1
require_dependency_context: true
production:
  auto_merge_max_bump: minor
  major: high_risk
development:
  auto_merge_max_bump: major
  major: review
on_osv: review
on_deprecated: high_risk
ignore:
  - left-pad
`);
  assert.equal(policy.production.autoMergeMaxBump, "minor");
  assert.equal(policy.production.major, "high_risk");
  assert.equal(policy.development.autoMergeMaxBump, "major");
  assert.equal(policy.onOsv, "review");
  assert.deepEqual(policy.ignore, ["left-pad"]);
});

test("policy can mark production major as HIGH_RISK", async () => {
  const policy = mergePolicy({
    production: { autoMergeMaxBump: "patch", major: "high_risk" },
  });
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
    { offline: true, policy, policySource: "test-policy" },
  );
  assert.equal(result.verdict, "HIGH_RISK");
  assert.match(result.markdown, /Policy.*test-policy/);
  assert.match(result.markdown, /production\.major=high_risk/);
});

test("ignore list drops packages", async () => {
  const policy = mergePolicy({ ignore: ["left-pad"] });
  const result = await analyzeChanges(
    [
      {
        name: "left-pad",
        ecosystem: "npm",
        fromVersion: "1.0.0",
        toVersion: "1.1.0",
        bump: "minor",
        section: "dependencies",
      },
    ],
    { offline: true, policy },
  );
  assert.equal(result.verdict, "NO_COMMENT");
});

test("bumpWithinAutoMerge respects max", () => {
  assert.equal(bumpWithinAutoMerge("patch", "patch"), true);
  assert.equal(bumpWithinAutoMerge("minor", "patch"), false);
  assert.equal(bumpWithinAutoMerge("minor", "minor"), true);
  assert.equal(bumpWithinAutoMerge("major", "major"), true);
  assert.equal(bumpWithinAutoMerge("prerelease", "major"), false);
});
