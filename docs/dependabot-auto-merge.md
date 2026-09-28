# Pair with Dependabot auto-merge

Typical pattern: auto-merge **patch/minor** after required checks pass; leave majors for humans.  
This Action does **not** merge. It comments `SAFE_TO_MERGE` when the bump is inside `.dep-second-opinion.yml` `auto_merge_max_bump` and clean of OSV / deprecation / registry-missing / young-package flags.

## Suggested pairing

1. Pin Path A: `uses: lory69060/dep-second-opinion@v0.2.1`
2. Keep branch protection: tests (and optionally GitHub [dependency-review-action](https://github.com/actions/dependency-review-action)) as required checks.
3. Enable Dependabot **malware alerts** (npm) and **cooldown** if you want platform-side malware / young-version delay.
4. Auto-merge workflow (`dependabot/fetch-metadata` + `gh pr merge --auto`) only for `semver-patch` / `semver-minor`. Treat this Action’s `HIGH_RISK` / `REVIEW_RECOMMENDED` as a human stop — do not auto-merge those.

## Screenshot capture (dogfood / trial)

Use real PRs; no fake customers. Pin is now `@v0.2.1` on both repos (2026-09-28).

| Shot | Source | Caption |
| :--- | :--- | :--- |
| SAFE + delta | Trial merged [PR#19](https://github.com/lory69060/dep-second-opinion-trial/pull/19) (dayjs) or [PR#18](https://github.com/lory69060/dep-second-opinion-trial/pull/18) | policy auto-merge band |
| HIGH_RISK registry-missing | Trial canary [PR#16](https://github.com/lory69060/dep-second-opinion-trial/pull/16) | hallucinated package |
| Optional live | Open Dependabot [PR#22](https://github.com/lory69060/dep-second-opinion-trial/pull/22) after `@v0.2.1` re-run | crop secrets |

Attach (1)+(2) when submitting Marketplace ([listing draft](./marketplace-listing.md)).
