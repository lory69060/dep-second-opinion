# GrokBot standing — dep-second-opinion

Load this when writing daily HANDOFF cards. Do not re-plan strategy.

## Product (≤4 lines)

- Comment-only GitHub Action for npm Dependabot/Renovate PRs
- Pin: `uses: lory69060/dep-second-opinion@v0.2.0`
- Install: https://github.com/lory69060/dep-second-opinion/blob/main/docs/install.md
- Tracker: `trials/issue-tracker.md` · SOP: `docs/growth-github.md`

## Success

Drafts for **human** review: repo URL + why_1/2/3 + title + body + risk.  
Owner posts Issues. Bot does **not** cold-pitch X as primary channel.

## TARGETING (must pass ≥2 — mandatory on every TODAY card)

**Prefer:**

- npm/JS + Dependabot/Renovate activity ~last 30 days
- Small/solo maintainer feel; stars roughly **200–5k**
- Open dep PRs piling up, or talk of hard majors / triage fatigue
- No obvious in-house full dependency-review stack in README

**Avoid:**

- `github/*` and large platform orgs with heavy internal CI (default skip)
- Archived / promo-banned / already in `trials/issue-tracker.md`
- Spray targets chosen only to inflate G1 count

**Pitch:** comment-only; does **not** replace their workflow; policy YAML; close if covered in-house.  
No influence-rate %, fake customers, pricing, “replaces Snyk”.

## Caps (defaults)

`issues_drafted≤5 | originals=0 | replies=0 | emails=0`

## Hard red lines

- No unsolicited workflow PRs / posting Issues without owner approval
- No Marketplace submit; no 1688intel in this standing
- `decline=workflow` is expected — do not argue in drafts

## REPORT (exactly 4 lines)

```
1) drafts: n | repos: …
2) x_replies: 0
3) file: <path or none>
4) tomorrow: …
```
