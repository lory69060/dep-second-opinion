# dep-second-opinion

Opt-in **second opinion** for npm dependency upgrade PRs.  
Designed for **Cursor Origin Automations** (comment-only; never edits deps).

## Quick start

```bash
./run.sh npm-minor          # patch/minor style fixture (may call OSV/npm)
OFFLINE=1 ./run.sh npm-major
npm test
```

CLI:

```bash
npm install && npm run build
node dist/cli.js analyze --from fixtures/npm-minor/before.package.json --to fixtures/npm-minor/after.package.json
```

Exit codes: `0` ok · `1` error · `2` `HIGH_RISK`

## Origin Automation

See [`automations/origin-pr-review.md`](./automations/origin-pr-review.md).

1. Push this repo to Origin (or mirror).
2. Create an Automation on PR opened/pushed.
3. Paste the prompt file contents.
4. Confirm the agent **only comments**.

## Plan / acceptance

See [`PLAN.md`](./PLAN.md).
