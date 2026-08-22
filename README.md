# dep-second-opinion

Opt-in **second opinion** for npm dependency upgrade PRs.  
**Comment-only** — never edits `package.json` / lockfiles.

## Repository policy

Add `.dep-second-opinion.yml` at the repo root (see example in this repository):

```yaml
version: 1
require_dependency_context: true
production:
  auto_merge_max_bump: patch
  major: review
development:
  auto_merge_max_bump: minor
  major: review
on_osv: high_risk
on_deprecated: high_risk
on_registry_missing: high_risk
supply_chain:
  new_package_max_age_days: 30
  on_new_package: review
  require_repository: false
  min_weekly_downloads: 0
ignore: []
```

## Formal shell (what customers see)

**GitHub Actions** posts as `github-actions[bot]`.  
PR emails are normal **GitHub** notifications — not Cursor-branded.

| Channel | Role |
| :--- | :--- |
| **GitHub Action** (this repo) | Product shell for non-Cursor users |
| CLI (`dep-review`) | Same engine, local/CI |
| Cursor Automation | Internal demo only (optional) |

### Enable on this repo

Workflow: [`.github/workflows/dep-second-opinion.yml`](./.github/workflows/dep-second-opinion.yml)

On any PR that touches `package.json` / lockfiles, it analyzes base→head and upserts a PR comment.

### Use on another repo

See **[docs/install.md](./docs/install.md)** (Path A public composite · Path B private checkout + `DEP_REVIEW_READ`).

```yaml
# Path A (when Action repo is public)
- uses: lory69060/dep-second-opinion@v0.2.0
```

> Pin a release tag (e.g. `v0.2.0`). Avoid `@main`.  
> Action repo is **public** — Path A is the default. Path B remains for private forks.

## Local CLI

```bash
./run.sh npm-minor
OFFLINE=1 ./run.sh npm-major
pnpm test   # or: npm test
```

```bash
pnpm install && pnpm run build
node dist/cli.js analyze --from fixtures/npm-minor/before.package.json --to fixtures/npm-minor/after.package.json
```

Exit codes: `0` ok · `1` error · `2` `HIGH_RISK`

## Plan

See [`PLAN.md`](./PLAN.md).
