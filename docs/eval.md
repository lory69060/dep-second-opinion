# Eval / release gate (short)

Before tagging a consumer release (`vX.Y.Z`):

1. `pnpm test` — must pass (fixtures + policy + gate).
2. Spot-check offline fixtures still map to expected verdicts:
   - patch clean → `SAFE_TO_MERGE`
   - OSV / deprecated / registry missing → `HIGH_RISK` (default policy)
   - prod major → `REVIEW_RECOMMENDED`
3. Do **not** ship if any fixture verdict regresses without an explicit CHANGELOG note.

Trials (`trials/log.md`) are product validation, not a substitute for this gate.
