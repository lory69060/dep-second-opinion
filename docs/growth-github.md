# GitHub growth SOP (short)

Opt-in promotion for `dep-second-opinion`. **No drive-by workflow PRs.**  
Sprint: Issue industrialization + Marketplace (W1–2) + Creem only after retention gates.

## Lesson (2026-09-10)

Many replies: **“we already have a fixed workflow / no third-party.”**  
→ Prefer **underserved maintainers**, not orgs with full platform tooling.  
→ Pitch **non-blocking + policy YAML**, not “another bot in the stack.”

## Assets

| Asset | URL |
| :--- | :--- |
| Action pin | `uses: lory69060/dep-second-opinion@v0.2.0` |
| Install | [docs/install.md](./install.md) Path A (Dependabot-compatible) |
| Product | https://github.com/lory69060/dep-second-opinion |
| Issue tracker | [trials/issue-tracker.md](../trials/issue-tracker.md) |
| Marketplace checklist | [marketplace-readme-checklist.md](./marketplace-readme-checklist.md) |

## Target repos (GrokBot must pass)

**Prefer (need ≥2 signals):**

- npm/JS, Dependabot or Renovate active in last ~30 days
- **Small team** feel: few core maintainers, or solo-maintained library
- Stars roughly **200–5k** (not mega-corp platform monorepos)
- Open Dependabot PRs sitting / discussion of “too many dep PRs” / fear of major bumps
- No obvious in-house “dependency review” Action already advertised in README

**Avoid / Skip:**

- `github/*`, large BigTech orgs with heavy internal CI (Red Hat / DDG-scale OK only if clearly small sub-repo — default skip)
- Archived, promo-banned CONTRIBUTING, almost no dep PRs
- Already contacted (see tracker)
- Repos whose README already lists Socket/Snyk/Dependabot grouping + custom review bots as the whole story

## Pitch angle (body)

Stress: **does not replace** their workflow; **comment-only**; **policy file**; useful only if they want a second opinion on npm bumps.  
If they say they already have tooling → accept close; do not argue.

## Channels

1. **Suggestion Issues** — Bot drafts ≤5/day (targeted); human posts. G1 still ≥20 issued by W2, but **quality > spray**.
2. **Dogfood** — [dep-second-opinion-dogfood](https://github.com/lory69060/dep-second-opinion-dogfood)
3. **Marketplace** — human W1–2; passive discovery if Issues bounce on “have workflow”
4. **Repo surface** — README + topics

## Issue template (suggestion)

```
## Why I'm writing

Your repo has ongoing Dependabot/Renovate npm PRs. If triage is still mostly manual, a lightweight second opinion can help — without changing merge rules.

## Optional tool

dep-second-opinion is a **comment-only** GitHub Action: structured SAFE / REVIEW / HIGH_RISK notes on dependency upgrade PRs. It does **not** edit package.json/lockfiles and is **not** meant to replace your existing CI.

Pin:

- uses: lory69060/dep-second-opinion@v0.2.0

Install: https://github.com/lory69060/dep-second-opinion/blob/main/docs/install.md

If you already have this covered in-house, please close — no hard sell.
```

## Tracker notes

- `reply=N` + `decline=workflow` when they say already have tooling
- Counts toward G1 (issued); does **not** count toward G2 (install)

## Do not

- Unsolicited workflow PRs; fake metrics / influence-rate %; invent pricing
- Cold X as primary channel
- Spray BigTech / github.org just to hit G1 count
