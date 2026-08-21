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

### Use on another repo (composite action)

```yaml
# .github/workflows/dep-second-opinion.yml
name: dep-second-opinion
on:
  pull_request:
    types: [opened, synchronize, reopened]
    paths: ["**/package.json", "**/pnpm-lock.yaml", "**/package-lock.json"]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: lory69060/dep-second-opinion@v0.1.0
```

> Pin a release tag (e.g. `v0.1.0`). Avoid `@main` in other repos — it moves without notice.  
> Repo is private: the consuming workflow needs read access to this Action repo.

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
