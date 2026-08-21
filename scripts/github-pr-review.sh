#!/usr/bin/env bash
# Post dep-second-opinion review on the current GitHub PR.
# Comments as github-actions[bot] when using GITHUB_TOKEN (not Cursor-branded).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# When used as a composite action, analyzer lives in the action checkout;
# the PR git history lives in GITHUB_WORKSPACE.
REPO_ROOT="${GITHUB_WORKSPACE:-$ROOT}"
cd "$REPO_ROOT"

export GH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"
if [[ -z "$GH_TOKEN" ]]; then
  echo "GITHUB_TOKEN/GH_TOKEN required" >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY required}"

if [[ -z "${PR_NUMBER:-}" && -n "${GITHUB_EVENT_PATH:-}" ]]; then
  PR_NUMBER="$(node -e "console.log(require(process.env.GITHUB_EVENT_PATH).pull_request?.number||'')")"
fi
if [[ -z "${PR_NUMBER:-}" ]]; then
  echo "PR_NUMBER required" >&2
  exit 1
fi

if [[ -z "${BASE_SHA:-}" && -n "${GITHUB_EVENT_PATH:-}" ]]; then
  BASE_SHA="$(node -e "console.log(require(process.env.GITHUB_EVENT_PATH).pull_request?.base?.sha||'')")"
fi
if [[ -z "${HEAD_SHA:-}" && -n "${GITHUB_EVENT_PATH:-}" ]]; then
  HEAD_SHA="$(node -e "console.log(require(process.env.GITHUB_EVENT_PATH).pull_request?.head?.sha||'')")"
fi
if [[ -z "${BASE_SHA:-}" || -z "${HEAD_SHA:-}" ]]; then
  echo "BASE_SHA/HEAD_SHA required" >&2
  exit 1
fi

CHANGED="$(git diff --name-only "$BASE_SHA" "$HEAD_SHA" -- || true)"
MANIFEST_CHANGED="$(git diff --name-only "$BASE_SHA" "$HEAD_SHA" -- '*package.json' || true)"
if [[ -z "$MANIFEST_CHANGED" ]]; then
  echo "No package.json changes; skipping comment."
  exit 0
fi

if echo "$MANIFEST_CHANGED" | grep -qx 'package.json'; then
  TARGET="package.json"
else
  TARGET="$(echo "$MANIFEST_CHANGED" | head -n1)"
fi

# PR context for gating (Dependabot/Renovate / deps-only)
PR_AUTHOR="$(gh api "repos/${REPO}/pulls/${PR_NUMBER}" --jq '.user.login' 2>/dev/null || true)"
PR_TITLE="$(gh api "repos/${REPO}/pulls/${PR_NUMBER}" --jq '.title' 2>/dev/null || true)"
PR_LABELS="$(gh api "repos/${REPO}/pulls/${PR_NUMBER}" --jq '[.labels[].name] | join(",")' 2>/dev/null || true)"
CHANGED_CSV="$(echo "$CHANGED" | paste -sd, -)"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
BEFORE="$TMP_DIR/before.package.json"
AFTER="$TMP_DIR/after.package.json"
BODY_FILE="$TMP_DIR/comment.md"

if ! git show "${BASE_SHA}:${TARGET}" >"$BEFORE" 2>/dev/null; then
  printf '%s\n' '{"private":true,"dependencies":{}}' >"$BEFORE"
fi
git show "${HEAD_SHA}:${TARGET}" >"$AFTER"

if [[ ! -f "$ROOT/dist/cli.js" ]]; then
  if [[ -f "$ROOT/pnpm-lock.yaml" ]] && command -v pnpm >/dev/null 2>&1; then
    (cd "$ROOT" && pnpm install && pnpm run build)
  else
    (cd "$ROOT" && npm install && npm run build)
  fi
fi

JSON_OUT="$TMP_DIR/result.json"
GATE_ARGS=()
if [[ -n "${PR_AUTHOR:-}" ]]; then GATE_ARGS+=(--actor "$PR_AUTHOR"); fi
if [[ -n "${PR_TITLE:-}" ]]; then GATE_ARGS+=(--title "$PR_TITLE"); fi
if [[ -n "${PR_LABELS:-}" ]]; then GATE_ARGS+=(--labels "$PR_LABELS"); fi
if [[ -n "${CHANGED_CSV:-}" ]]; then GATE_ARGS+=(--changed "$CHANGED_CSV"); fi

node "$ROOT/dist/cli.js" analyze --from "$BEFORE" --to "$AFTER" --json --repo-root "$REPO_ROOT" "${GATE_ARGS[@]}" >"$JSON_OUT"

VERDICT="$(node -e "const fs=require('fs'); const r=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); console.log(r.verdict)" "$JSON_OUT")"
if [[ "$VERDICT" == "NO_COMMENT" ]]; then
  echo "Verdict NO_COMMENT; not posting."
  exit 0
fi

MARKER="<!-- dep-second-opinion -->"
node -e "
const fs=require('fs');
const r=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));
const footer='\n\n_Posted by **dep-second-opinion** via GitHub Actions. Comment-only; never modifies dependency files._\n';
fs.writeFileSync(process.argv[2], r.markdown + footer);
" "$JSON_OUT" "$BODY_FILE"

EXISTING_ID="$(gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" --paginate \
  --jq ".[] | select(.body | contains(\"${MARKER}\")) | .id" 2>/dev/null | head -n1 || true)"

if [[ -n "$EXISTING_ID" ]]; then
  gh api -X PATCH "repos/${REPO}/issues/comments/${EXISTING_ID}" -F body=@"$BODY_FILE" >/dev/null
  echo "Updated comment $EXISTING_ID (verdict=$VERDICT target=$TARGET)"
else
  gh api -X POST "repos/${REPO}/issues/${PR_NUMBER}/comments" -F body=@"$BODY_FILE" >/dev/null
  echo "Created comment (verdict=$VERDICT target=$TARGET)"
fi
