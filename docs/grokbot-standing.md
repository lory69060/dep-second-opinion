# GrokBot standing — dep-second-opinion

Load this when writing daily HANDOFF cards. Do not re-plan strategy.

## Phase (post-G1)

**G1 done (20 Issues).** Gate now = **G2**: external installs with bot comments ≥3.  
Bottleneck = who will actually install — **not** more spray Issues.

## Product (≤4 lines)

- Comment-only GitHub Action for npm Dependabot/Renovate PRs
- Pin: `uses: lory69060/dep-second-opinion@v0.2.1` (exact; no other versions)
- Install: https://github.com/lory69060/dep-second-opinion/blob/main/docs/install.md
- Explainer (link this first): https://github.com/lory69060/dep-second-opinion/blob/main/docs/what-it-does.md
- Tracker: `trials/issue-tracker.md` · SOP: `docs/growth-github.md`

## Arms (multi-strategy — label every action)

Use **one primary arm** per day (default quota ~80% time). Optional **one explore arm** (~20%) only if CAPS allow.

| arm id | Meaning | Counts as progress only if |
| :--- | :--- | :--- |
| `scan` | Re-read tracked Issues for install interest / closes | install-how / Path A intent listed |
| `followup_soft` | Soft FU draft (explain-first) on OPEN non-declined | human posts; then watch reply |
| `issue_explain` | New suggestion Issue draft with what-it-does lead | human posts Issue |
| `x_cold` | **Deprecated** — do not use | never |

Reward = install intent / real pin / bot comment — **not** X reply count.

## Success (daily)

1. **Primary arm `scan`:** Scan threads; “how to install” = only useful lead.
2. **Secondary arm `followup_soft` or `issue_explain`:** ≤1 draft each day max unless TODAY raises CAPS; explain-first pitch mandatory.
3. X cold outreach **OFF** (`replies=0`). Arm `x_cold` is forbidden.

## TARGETING (new Issues / `issue_explain` only; ≥2 Prefer)

**Prefer:** npm/JS + Dependabot/Renovate ~30d; small/solo; stars ~200–5k; dep PR pileup OR major fatigue; no full in-house dep-review stack in README  

**Avoid:** `github/*` / big platform CI; archived/promo-ban; already contacted; volume spray; clear “already have workflow” shops  

**Pitch (mandatory lead):** one sentence from `docs/what-it-does.md`, then pin, then links. Do not open with the product name or a feature list.

> Dependabot (or Renovate) opens the dependency PR. This Action is a lightweight **supply-chain second opinion**: it only comments SAFE / REVIEW / HIGH_RISK from your policy file. It does not edit lockfiles and does not replace CI.

No influence-rate %, fake customers, pricing, “replaces Snyk”.

## Follow-up rules (`followup_soft`)

- **Do follow-up** only: still OPEN + no clear decline / close
- **Never follow-up:** explicit decline, CLOSED, or **closed as spam** (e.g. trading-signals#1358) — permanent skip
- Soft tone only — do not argue
- Do **not** re-ping a thread that already got our Quick ping within **7 days**
- Soft template:

```
Dependabot (or Renovate) opens the dependency PR. This Action only comments SAFE / REVIEW / HIGH_RISK from a policy file in the repo. It does not edit lockfiles and does not replace your CI.

- uses: lory69060/dep-second-opinion@v0.2.1
- https://github.com/lory69060/dep-second-opinion/blob/main/docs/what-it-does.md

If you already cover this, please ignore or close — thanks.
```

## Caps (defaults post-G1)

`followups_drafted≤1 | issues_drafted≤1 | originals=0 | replies=0 | emails=0`  
(Raise only when TODAY says so.)

## Hard red lines

- No posting Issues/comments/PRs without owner approval
- No Marketplace submit; no 1688intel; no inventing metrics/versions
- Do not resume X cold replies as progress (`arm=x_cold` forbidden)

## REPORT (exactly 4 lines)

```
1) scans: … | none
2) arm: primary=… | explore=…|none | followups:n | issues:n | repos:…
3) x_replies: 0
4) tomorrow: …
```
