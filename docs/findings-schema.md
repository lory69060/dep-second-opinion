# Findings schema (v1)

`dep-review --json` and Action comments share one machine-readable list: `ReviewResult.findings[]`.

## Fields

| Field | Type | Meaning |
| :--- | :--- | :--- |
| `finding_id` | string | Stable id, e.g. `bump:lodash:patch`, `osv:ms:GHSA-…` |
| `severity` | `info` \| `low` \| `medium` \| `high` | Hint for aggregators; **verdict** remains the merge gate signal |
| `package` | string | npm package name |
| `signal` | string | `bump_*` / `osv` / `npm_deprecated` / `registry_*` / `supply_chain` |
| `evidence_urls` | string[] | OSV / npm links when available |
| `summary` | string | One-line human summary |

Markdown PR comments also include a **Dependency delta** table (base → head) rendered from `changes[]`.

Verdict (`SAFE_TO_MERGE` / `REVIEW_RECOMMENDED` / `HIGH_RISK` / `NO_COMMENT`) is **not** overridden by findings severity — findings are for agents/CI that want structured rows.
