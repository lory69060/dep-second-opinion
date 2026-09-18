# GrokBot standing — dep-second-opinion

Load this when writing daily HANDOFF cards. Do not re-plan strategy.

## Phase (post-G1)

**G1 done (20 Issues).** Gate now = **G2**: external installs with bot comments ≥3.  
Bottleneck = who will actually install — **not** more spray Issues.

## Product (≤4 lines)

- Comment-only GitHub Action for npm Dependabot/Renovate PRs
- Pin: `uses: lory69060/dep-second-opinion@v0.2.0` (exact; no other versions)
- Install: https://github.com/lory69060/dep-second-opinion/blob/main/docs/install.md
- Tracker: `trials/issue-tracker.md` · SOP: `docs/growth-github.md`

## Success (daily)

1. **Primary:** Soft follow-up **drafts** for open, non-declined threads (human posts). Aim install intent.
2. **Secondary:** Optional **≤2** new Issue drafts only if exceptional TARGETING fit.
3. Scan threads for interest; “how to install” = only useful lead.
4. X cold outreach **OFF** by default (`replies=0`).

## TARGETING (new Issues only; ≥2 Prefer)

**Prefer:** npm/JS + Dependabot/Renovate ~30d; small/solo; stars ~200–5k; dep PR pileup OR major fatigue; no full in-house dep-review stack in README  

**Avoid:** `github/*` / big platform CI; archived/promo-ban; already contacted; volume spray; clear “already have workflow” shops  

**Pitch:** comment-only; does **not** replace their CI; policy YAML; close if covered. No influence-rate %, fake customers, pricing, “replaces Snyk”.

## Follow-up rules

- **Do follow-up** only: still OPEN + no clear decline / close
- **Never follow-up:** explicit decline, CLOSED, or **closed as spam** (e.g. trading-signals#1358) — permanent skip
- Soft tone only — ask if Path A pin useful; offer install link; do not argue
- Do **not** re-ping a thread that already got our Quick ping within **7 days**
- Soft template:

```
Quick ping — if a comment-only second opinion on npm Dependabot/Renovate PRs would still help, Path A pin is:

uses: lory69060/dep-second-opinion@v0.2.0

Guide: https://github.com/lory69060/dep-second-opinion/blob/main/docs/install.md

If you’re already covered, please ignore or close — thanks.
```

## Caps (defaults post-G1)

`followups_drafted≤5 | issues_drafted≤2 | originals=0 | replies=0 | emails=0`

## Hard red lines

- No posting Issues/comments/PRs without owner approval
- No Marketplace submit; no 1688intel; no inventing metrics/versions
- Do not resume X cold replies as progress

## REPORT (exactly 4 lines)

```
1) scans: … | none
2) followups: n | issues: n | repos: …
3) x_replies: 0
4) tomorrow: …
```
