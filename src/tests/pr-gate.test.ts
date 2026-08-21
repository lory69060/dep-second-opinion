import assert from "node:assert/strict";
import test from "node:test";
import { isDependencyBot, shouldReviewPullRequest } from "../pr-gate.js";

test("isDependencyBot matches common bots", () => {
  assert.equal(isDependencyBot("dependabot[bot]"), true);
  assert.equal(isDependencyBot("renovate[bot]"), true);
  assert.equal(isDependencyBot("alice"), false);
});

test("shouldReviewPullRequest renovate author", () => {
  const r = shouldReviewPullRequest({
    actor: "renovate[bot]",
    title: "Update dependency",
    changedPaths: ["package.json"],
  });
  assert.equal(r.review, true);
  assert.equal(r.kind, "renovate");
});
