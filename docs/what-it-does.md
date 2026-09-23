# What it does

Dependabot / Renovate **open** the npm dependency PR.  
**dep-second-opinion** is a **lightweight supply-chain second opinion** on that PR only.

It comments `SAFE` / `REVIEW` / `HIGH_RISK` from your repo policy file (`.dep-second-opinion.yml`), using version span, OSV, npm deprecation, registry-missing, and young-package signals.

It does **not** edit `package.json` / lockfiles, and does **not** replace or block your existing CI.

Pin:

- `uses: lory69060/dep-second-opinion@v0.2.1`

More: [install.md](./install.md) (Path A for Dependabot) · [findings schema](./findings-schema.md)
