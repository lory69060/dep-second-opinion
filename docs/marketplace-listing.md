# Marketplace listing draft (copy for human submit)

**Pin customers to:** `uses: lory69060/dep-second-opinion@v0.2.1`  
**Never:** `@main`

## Name

dep-second-opinion

## Short description (≤160 chars)

Comment-only auto-merge companion for npm Dependabot/Renovate PRs — SAFE/REVIEW/HIGH_RISK from your policy; flags registry-missing packages.

## About / long description

Dependabot and Renovate open dependency upgrade PRs. Reviewers still decide what is safe to **auto-merge**.

**dep-second-opinion** posts a structured, **comment-only** verdict on those PRs:

- Verdicts: `SAFE_TO_MERGE` / `REVIEW_RECOMMENDED` / `HIGH_RISK` from `.dep-second-opinion.yml`
- Signals: version span vs `auto_merge_max_bump`, OSV, npm deprecation, **registry-missing / unpublished versions**, young new packages
- Output: Dependency delta table + machine-readable `findings[]` (JSON)

It does **not** edit `package.json` or lockfiles and does **not** replace your existing CI.

**Complements** GitHub Dependabot malware alerts, `actions/dependency-review-action`, Dependabot cooldown, and Socket/Snyk. It is **not** a malware scanner or full SCA.

### Install (Path A — required for Dependabot)

```yaml
- uses: lory69060/dep-second-opinion@v0.2.1
```

Guide: https://github.com/lory69060/dep-second-opinion/blob/main/docs/install.md  
What it does: https://github.com/lory69060/dep-second-opinion/blob/main/docs/what-it-does.md  
Auto-merge pairing: https://github.com/lory69060/dep-second-opinion/blob/main/docs/dependabot-auto-merge.md

### Permissions

Typical: read contents; write pull-request comments (see Action README / workflow).

### Screenshots (attach when submitting)

1. SAFE comment with Dependency delta (auto-merge band)  
2. HIGH_RISK / REVIEW with registry-missing or policy Why  

Use dogfood or trial repo screenshots. No fake customers / influence-rate claims.

## Branding notes

- Not a full SCA / malware replacement (not “replaces Snyk” / Socket / GitHub DRA)
- GitHub Actions bot comments — normal PR email notifications
