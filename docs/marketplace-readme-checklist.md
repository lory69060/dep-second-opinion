# Marketplace listing checklist（W1–2）

Human-only submission. Pin customers to **`@v0.2.x`**, never `@main`.

## README / listing copy

- [ ] One-line value: comment-only second opinion on npm Dependabot/Renovate PRs
- [ ] What it does / does not (never edits lockfiles)
- [ ] Path A pin snippet: `uses: lory69060/dep-second-opinion@v0.2.0`
- [ ] Link to [install.md](./install.md) (Dependabot → Path A)
- [ ] Permissions needed (contents read, pull-requests write / comments)
- [ ] 1–3 screenshots: SAFE / REVIEW / HIGH_RISK PR comments (dogfood or trial)
- [ ] No influence-rate %, no fake customers, no “replaces Snyk”

## Submit

- [ ] Publish Action to GitHub Marketplace (owner: human)
- [ ] After submit: note date on BOARD; keep Issue cadence in parallel

## After listing

- [ ] Update [growth-github.md](./growth-github.md) “Marketplace live” + URL
- [ ] GrokBot may answer install questions; may not invent pricing
