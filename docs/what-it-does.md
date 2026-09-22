# What it does

Dependabot (or Renovate) opens the dependency PR.  
**dep-second-opinion only comments** on that PR: `SAFE` / `REVIEW` / `HIGH_RISK`, using a policy file in your repo.

It does **not** edit `package.json` or lockfiles, and it does **not** block merge or replace your existing CI.

Pin:

- `uses: lory69060/dep-second-opinion@v0.2.0`

Install: [install.md](./install.md) (Path A for Dependabot).
