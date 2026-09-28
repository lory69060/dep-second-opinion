# Marketplace listing checklist（W1–2）

Human-only submission. Pin customers to **`@v0.2.x`**, never `@main`.  
Copy draft: [`marketplace-listing.md`](./marketplace-listing.md).

## README / listing copy

- [ ] One-line value: **comment-only auto-merge companion** + registry-missing on npm Dependabot/Renovate PRs
- [ ] Link [what-it-does.md](./what-it-does.md) (complements GH malware alerts / DRA / cooldown; does not replace CI)
- [ ] What it does / does not (never edits lockfiles)
- [ ] Path A pin snippet: `uses: lory69060/dep-second-opinion@v0.2.1`
- [ ] Link to [install.md](./install.md) (Dependabot → Path A)
- [ ] Permissions needed (contents read, pull-requests write / comments)
- [ ] 1–3 screenshots: SAFE / REVIEW / HIGH_RISK PR comments (dogfood or trial) — prefer shot with **Dependency delta** table
- [ ] No influence-rate %, no fake customers, no “replaces Snyk”

## Submit

- [ ] Publish Action to GitHub Marketplace (owner: human)
- [ ] After submit: note date on BOARD; GrokBot remains scan-only（不喷新 Issue）

## After listing

- [ ] Update [growth-github.md](./growth-github.md) “Marketplace live” + URL
- [ ] GrokBot may answer install questions; may not invent pricing
