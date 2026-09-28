# GitHub growth SOP (short)

Opt-in promotion for `dep-second-opinion`. **No drive-by workflow PRs.**  
**2026-09-28:** Issue spray **frozen**. Creem only after retention gates.

## Lesson (2026-09-10 → 2026-09-28)

Many replies: **“we already have a fixed workflow / no third-party.”**  
Cold Issues → G2 **install_how=0** (scan 09-23).  
GitHub now ships Dependabot **malware alerts** + cooldown; DRA is the CVE gate. Pitch **auto-merge policy + registry-missing**, not “another SCA / malware bot.”

## Assets

| Asset | URL |
| :--- | :--- |
| Action pin | `uses: lory69060/dep-second-opinion@v0.2.1` |
| Explainer | [docs/what-it-does.md](./what-it-does.md) — auto-merge companion, comment-only |
| Auto-merge pairing | [docs/dependabot-auto-merge.md](./dependabot-auto-merge.md) |
| Install | [docs/install.md](./install.md) Path A (Dependabot-compatible) |
| Product | https://github.com/lory69060/dep-second-opinion |
| Issue tracker | [trials/issue-tracker.md](../trials/issue-tracker.md) |
| Marketplace checklist | [marketplace-readme-checklist.md](./marketplace-readme-checklist.md) |

## Target repos (human FU only; GrokBot does not draft new Issues)

**Prefer (need ≥2 signals):** npm/JS + Dependabot/Renovate; small/solo; stars ~200–5k; want auto-merge but no policy comment; no Socket/Snyk/DRA advertised as the whole stack.

**Avoid / Skip:** `github/*`; already contacted; decline/spam/CLOSED; “already have workflow”; spray.

## Pitch angle (body)

Lead: Dependabot opens the PR; this Action comments whether the bump is in **your auto-merge band**, and flags **registry-missing** names/versions. Complements GH malware alerts / DRA / cooldown. Comment-only.  
If they already have tooling → accept close; do not argue.

## Channels (priority)

1. **Marketplace** — human submit ([listing](./marketplace-listing.md)); passive discovery
2. **Content** — [dependabot-auto-merge.md](./dependabot-auto-merge.md) + dogfood screenshots
3. **Human FU queue only** — at most 1–2 already-drafted threads (e.g. npmx#3254); **do not expand Prefer list**
4. **Dogfood** — [dep-second-opinion-dogfood](https://github.com/lory69060/dep-second-opinion-dogfood) pin `@v0.2.1`
5. GrokBot: **scan-only** (install intent). No `issue_explain` / no new FU drafts unless TODAY raises CAPS.

## Issue template (legacy — do not spray)

```
Dependabot opens the npm PR. This Action comments SAFE / REVIEW / HIGH_RISK from a policy file so you can decide auto-merge. It also flags package names/versions that are not on the npm registry. It does not edit lockfiles and does not replace Dependabot malware alerts or dependency-review-action.

- uses: lory69060/dep-second-opinion@v0.2.1
- https://github.com/lory69060/dep-second-opinion/blob/main/docs/what-it-does.md

If you already cover this, please close — thanks.
```

## Tracker notes

- `reply=N` + `decline=workflow` when they say already have tooling
- G1 issued count is historical; **progress = G2** (external pin + bot comment)

## Do not

- Unsolicited workflow PRs; fake metrics / influence-rate %; invent pricing
- Cold X; new Issue spray; “replaces Snyk/Socket”
