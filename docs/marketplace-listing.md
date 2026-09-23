# Marketplace listing draft (copy for human submit)

**Pin customers to:** `uses: lory69060/dep-second-opinion@v0.2.1`  
**Never:** `@main`

## Name

dep-second-opinion

## Short description (≤160 chars)

Lightweight supply-chain second opinion on npm Dependabot/Renovate PRs — comment-only SAFE/REVIEW/HIGH_RISK from your policy file.

## About / long description

Dependabot and Renovate open dependency upgrade PRs. Reviewers still decide what is safe to merge.

**dep-second-opinion** posts a structured, **comment-only** review on those PRs:

- Verdicts: `SAFE_TO_MERGE` / `REVIEW_RECOMMENDED` / `HIGH_RISK`
- Signals: version span, OSV, npm deprecation, registry-missing packages, young new packages
- Policy file: `.dep-second-opinion.yml` in your repo
- Output: Dependency delta table + machine-readable `findings[]` (JSON)

It does **not** edit `package.json` or lockfiles and does **not** replace your existing CI.

### Install (Path A — required for Dependabot)

```yaml
- uses: lory69060/dep-second-opinion@v0.2.1
```

Guide: https://github.com/lory69060/dep-second-opinion/blob/main/docs/install.md  
What it does: https://github.com/lory69060/dep-second-opinion/blob/main/docs/what-it-does.md

### Permissions

Typical: read contents; write pull-request comments (see Action README / workflow).

### Screenshots (attach when submitting)

1. SAFE comment with Dependency delta  
2. REVIEW or HIGH_RISK with Why / findings  

Use dogfood or trial repo screenshots. No fake customers / influence-rate claims.

## Branding notes

- Not a full SCA replacement (not “replaces Snyk”)
- GitHub Actions bot comments — normal PR email notifications
