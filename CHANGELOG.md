# Changelog

All notable **consumer-facing** changes to `dep-second-opinion` (GitHub Action + `dep-review` CLI).

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Pin releases with `uses: lory69060/dep-second-opinion@vX.Y.Z` — see [install guide](./docs/install.md).

## [Unreleased]

### Added

- PR comment footer shows analyzer version (`@v0.2.0` from `package.json`) so reviewers know which release ran.

### Changed

- README and install docs consistently recommend `@v0.2.0`.
- Install guide notes that **Dependabot PRs require Path A** (composite Action); repository secrets are not visible to Dependabot-triggered workflows.

## [0.2.0] - 2026-08-22

**Upgrade note:** Registry and supply-chain signals are **on by default**. PRs that add hallucinated packages or very new dependencies may flip from silent/`REVIEW` to `HIGH_RISK` / `REVIEW_RECOMMENDED`. Add or tune keys in `.dep-second-opinion.yml` if you need softer behavior.

### Added

- **`on_registry_missing`** policy (default `high_risk`): package name or target version not found on npm → `HIGH_RISK`.
- **`supply_chain.*`** policy for **newly added** dependencies:
  - `new_package_max_age_days` (default `30`) — packages younger than N days trigger `on_new_package`.
  - `on_new_package` (default `review`) — verdict when age threshold hits.
  - Optional `require_repository`, `min_weekly_downloads` (0 = disabled).
- Comment sections for registry-missing and supply-chain reasons.
- Fixture coverage: `npm-hallucinated`, `npm-new-package`.

### Changed

- npm registry lookups during analyze (online mode): 404 / unpublished version is no longer ignored — escalates per policy.
- Default example `.dep-second-opinion.yml` in README includes the new keys.

## [0.1.1] - 2026-08-21

### Fixed

- **`auto_merge_max_bump` enforcement:** production deps with a **minor** bump no longer receive `SAFE_TO_MERGE` when policy is `patch` (was a false SAFE).
- **`HIGH_RISK` + GitHub Action:** workflow posts the PR comment **before** treating CLI exit code `2` as success, so high-risk reviews are visible and the job stays green (comment-only product).

## [0.1.0] - 2026-08-21

Initial pinned release for external trials.

### Added

- GitHub Action composite (`action.yml`) and install paths (public Path A / private Path B).
- `.dep-second-opinion.yml` policy: `production` / `development` scopes, `auto_merge_max_bump`, `on_osv`, `on_deprecated`, `ignore`.
- Verdicts: `SAFE_TO_MERGE`, `REVIEW_RECOMMENDED`, `HIGH_RISK`, `NO_COMMENT`.
- PR gate: skips non-dependency PRs when `require_dependency_context: true`.
- OSV vulnerability lookup and npm deprecation metadata (online).
- Local CLI: `dep-review analyze`, exit `2` on `HIGH_RISK`.

[Unreleased]: https://github.com/lory69060/dep-second-opinion/compare/v0.2.0...main
[0.2.0]: https://github.com/lory69060/dep-second-opinion/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/lory69060/dep-second-opinion/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/lory69060/dep-second-opinion/releases/tag/v0.1.0
