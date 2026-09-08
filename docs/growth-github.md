# GitHub growth SOP (short)

Opt-in promotion for `dep-second-opinion`. **No drive-by workflow PRs.**  
Sprint: Issue industrialization + Marketplace (W1–2) + Creem only after retention gates.

## Assets

| Asset | URL |
| :--- | :--- |
| Action pin | `uses: lory69060/dep-second-opinion@v0.2.0` |
| Install | [docs/install.md](./install.md) Path A (Dependabot-compatible) |
| Product | https://github.com/lory69060/dep-second-opinion |
| Issue tracker | [trials/issue-tracker.md](../trials/issue-tracker.md) |
| Marketplace checklist | [marketplace-readme-checklist.md](./marketplace-readme-checklist.md) |

## Channels (allowed)

1. **Suggestion Issues** — Bot drafts ≤5/day; human reviews and posts ≥3/day when possible. Target **≥20 issued by end of W2** (G1).
2. **Own dogfood** — [dep-second-opinion-dogfood](https://github.com/lory69060/dep-second-opinion-dogfood) Path A `@v0.2.0`.
3. **Marketplace** — human submits in W1–2; see checklist. Parallel with Issues.
4. **Repo surface** — README + topics (`github-actions`, `dependabot`, `npm`, …).

## Issue template (suggestion)

```
## Why I'm writing

Your repo gets frequent Dependabot/Renovate npm PRs. Humans still triage changelog and supply-chain risk by hand.

## Optional tool

dep-second-opinion is a comment-only GitHub Action: it posts a structured second opinion on dependency upgrade PRs and never edits package.json / lockfiles.

Pin:

- uses: lory69060/dep-second-opinion@v0.2.0

Install: https://github.com/lory69060/dep-second-opinion/blob/main/docs/install.md

Happy to close this if it's not a fit — no hard sell.
```

## Skip when

- CONTRIBUTING / CODE_OF_CONDUCT forbids unsolicited promotions
- Repo is inactive, archived, or has almost no Dependabot traffic
- Rate-limited or maintainer clearly hostile to tooling suggestions

## Do not

- Unsolicited workflow PRs
- Fake metrics / fake customers / influence-rate claims in public copy
- Creem/pricing before retention gates (≥5 external installs with comments, ≥2 retained 14d)
- Merge historical draft review PRs (#2–#6)
- Cold X install pitches as the primary channel (GrokBot = Issue drafter)
