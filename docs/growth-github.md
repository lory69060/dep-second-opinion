# GitHub growth SOP (short)

Organic, opt-in promotion for `dep-second-opinion`. No Marketplace yet. No drive-by workflow PRs.

## Assets

| Asset | URL |
| :--- | :--- |
| Action pin | `uses: lory69060/dep-second-opinion@v0.2.0` |
| Install | [docs/install.md](./install.md) Path A (Dependabot-compatible) |
| Product | https://github.com/lory69060/dep-second-opinion |

## Channels (allowed)

1. **Own dogfood** — enable Path A on a small public npm/JS repo you control; note the pin in that README.
2. **Suggestion issues** — 1–2 polite Issues on active external repos with heavy Dependabot traffic. Opt-in only; never open a workflow PR unsolicited.
3. **Repo surface** — README first viewport + GitHub topics (`github-actions`, `dependabot`, `npm`, …).

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

- Marketplace listing (deferred)
- Spam PRs that add workflows
- Fake metrics / fake customers / influence-rate claims in public copy
- Merge historical draft review PRs (#2–#6)
