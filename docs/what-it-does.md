# What it does

Dependabot / Renovate **open** the npm dependency PR.  
**dep-second-opinion** is a **comment-only auto-merge companion** on that PR: it scores the bump against **your** policy file so you can decide whether patch/minor is safe to auto-merge.

It comments `SAFE_TO_MERGE` / `REVIEW_RECOMMENDED` / `HIGH_RISK` from `.dep-second-opinion.yml` (version span + `auto_merge_max_bump`, OSV, npm deprecation, **registry-missing / unpublished versions**, young new packages).

It does **not** edit `package.json` / lockfiles, and does **not** replace or block your existing CI.

**Complements, does not replace:**

- GitHub [Dependabot malware alerts](https://github.blog/changelog/2026-03-17-dependabot-now-detects-malware-in-npm-dependencies/) (known malicious npm versions)
- [`actions/dependency-review-action`](https://github.com/actions/dependency-review-action) (CVE / license **status check**)
- Dependabot **cooldown / min package age** (delay opening PRs for brand-new versions)
- Socket / Snyk (behavioral or full SCA)

The extra wedge: **packages or versions that are not on the npm registry** (`on_registry_missing`) — hallucinated / unpublished — plus a **policy verdict** you can wire to auto-merge.

Pin:

- `uses: lory69060/dep-second-opinion@v0.2.1`

More: [install.md](./install.md) (Path A for Dependabot) · [auto-merge pairing](./dependabot-auto-merge.md) · [findings schema](./findings-schema.md)
