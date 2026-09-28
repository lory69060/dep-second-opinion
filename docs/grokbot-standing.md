# GrokBot standing — dep-second-opinion

Load this when writing daily HANDOFF cards. Do not re-plan strategy.

## Phase (post-G1; spray frozen 2026-09-28)

**G1 done (20 Issues).** Gate = **G2**: external Path A pin + bot comment.  
**Explore arms default OFF.** Do not draft new Issues or extra FUs. Human posts at most the existing queue.

## Product (≤4 lines)

- Comment-only **auto-merge companion** for npm Dependabot/Renovate PRs (policy SAFE/REVIEW/HIGH_RISK + registry-missing)
- Complements GH malware alerts / DRA / cooldown — does **not** replace them
- Pin: `uses: lory69060/dep-second-opinion@v0.2.1` (exact)
- Explainer: https://github.com/lory69060/dep-second-opinion/blob/main/docs/what-it-does.md
- Pairing: https://github.com/lory69060/dep-second-opinion/blob/main/docs/dependabot-auto-merge.md

## Arms

| arm id | Meaning | Default |
| :--- | :--- | :--- |
| `scan` | Re-read tracked Issues for **install-how / Path A / pin** only | **primary; ON** |
| `followup_soft` | New FU draft | **OFF** unless TODAY CAPS raise |
| `issue_explain` | New suggestion Issue | **OFF** (frozen) |
| `x_cold` | Deprecated | **forbidden** |

Progress = install intent / real pin / bot comment — not drafts or X replies.

## Success (daily)

1. **Primary `scan`:** list only install-how / Path A / pin. Ignore “already have workflow.”
2. **Explore:** none unless TODAY says `followups_drafted≤1` for a named human-queue thread.
3. `replies=0`. `arm=x_cold` forbidden.

## TARGETING (do not open new Issues)

Prefer leftover OPEN never-soft only if TODAY explicitly asks a draft: node-semver#900 · ajv#2670 · ddg#3022 · mento#927.

**Avoid:** `github/*`; decline/CLOSED/spam; 7d silent re-ping; volume spray.

**Pitch (if TODAY allows one draft):** what-it-does lead → pin `@v0.2.1` → explainer. No product-name opener. No “replaces Snyk.”

> Dependabot opens the npm PR. This Action comments SAFE / REVIEW / HIGH_RISK from your policy file so you can decide auto-merge, and flags package names or versions that are not on the npm registry. It does not edit lockfiles and does not replace Dependabot malware alerts or dependency-review-action.

## Follow-up rules

- Human queue (leave unless owner posts): npmx#3254 · Code-Hex#1572 · JSPrismarine#2504 · langx#1248
- NEVER: trading-signals#1358 (spam); declines; CLOSED
- Silent 7d unlock ≠ re-ping (cashify / pwned / njt: skip unless maintainer activity)

Soft template (only if TODAY allows):

```
Dependabot opens the npm PR. This Action comments SAFE / REVIEW / HIGH_RISK from a policy file so you can decide auto-merge, and flags names/versions missing on the npm registry. It does not edit lockfiles and does not replace Dependabot malware alerts or dependency-review-action.

- uses: lory69060/dep-second-opinion@v0.2.1
- https://github.com/lory69060/dep-second-opinion/blob/main/docs/what-it-does.md

If you already cover this, please ignore or close — thanks.
```

## Caps (defaults)

`followups_drafted=0 | issues_drafted=0 | originals=0 | replies=0 | emails=0`

## Hard red lines

- No posting without owner approval
- No Marketplace submit; no 1688intel; no inventing metrics/versions
- No new Issue spray; no x_cold

## REPORT (exactly 4 lines)

```
1) scans: …
2) arm: primary=scan | explore=none | followups:0 | issues:0 | repos:…
3) x_replies: 0
4) tomorrow: …
```
