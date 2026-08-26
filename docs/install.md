# Install dep-second-opinion

Comment-only second opinion on npm dependency upgrade PRs.  
Pin **`v0.1.1`** (or newer `v0.1.x`). Never uses `@main` in customer repos.

## Before you start

| Need | Why |
| :--- | :--- |
| `pull-requests: write` | Post / upsert the review comment |
| `contents: read` | Diff base→head `package.json` |
| Optional: `.dep-second-opinion.yml` | Repo policy (auto_merge / major / ignore) |

## Path A — public composite Action (preferred)

This Action repo is **public**. Customer workflows can `uses:` it directly:

```yaml
# .github/workflows/dep-second-opinion.yml
name: dep-second-opinion
on:
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - "**/package.json"
      - "**/package-lock.json"
      - "**/pnpm-lock.yaml"
      - "**/yarn.lock"

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
      - uses: lory69060/dep-second-opinion@v0.1.1
```

## Path B — private / air-gapped (optional)

Only needed if you fork a **private** copy of the Action, or cannot pull public Actions.  
Checkout the analyzer with a read token (same pattern the trial host used before public):

1. Create a classic PAT or fine-grained token with **Contents: Read** on `lory69060/dep-second-opinion`.
2. Add repo secret `DEP_REVIEW_READ`.
3. Use this workflow:

```yaml
# .github/workflows/dep-second-opinion.yml
name: dep-second-opinion
on:
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - "**/package.json"
      - "**/package-lock.json"
      - "**/pnpm-lock.yaml"
      - "**/yarn.lock"

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

      - uses: actions/checkout@v4
        with:
          repository: lory69060/dep-second-opinion
          ref: v0.1.1
          token: ${{ secrets.DEP_REVIEW_READ }}
          path: .dep-review

      - uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install & build analyzer
        working-directory: .dep-review
        run: |
          npm install
          npm run build

      - name: Review dependency changes
        env:
          GH_TOKEN: ${{ github.token }}
          GITHUB_TOKEN: ${{ github.token }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          GITHUB_EVENT_PATH: ${{ github.event_path }}
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: bash .dep-review/scripts/github-pr-review.sh
```

## Policy (optional)

Copy [`.dep-second-opinion.yml`](../.dep-second-opinion.yml) to the consuming repo root and tune `auto_merge_max_bump` / `ignore`.

## Verify

1. Open a Dependabot/Renovate PR (or a title containing `Bump` / `deps`) that only touches manifests.
2. Expect a `github-actions[bot]` comment with Verdict / Why / Evidence.
3. Mixed feature+manifest PRs should stay silent (`NO_COMMENT`) when `require_dependency_context: true`.

## What this is not

- Not Socket / Snyk (no full supply-chain scan product)
- Not auto-merge / auto-replace of packages
- Not a Cursor-branded bot (comments are GitHub Actions)
