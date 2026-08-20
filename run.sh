#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "node not found (need Node >= 20)" >&2
  exit 1
fi

pkg_install() {
  if command -v npm >/dev/null 2>&1; then
    npm install
  elif command -v pnpm >/dev/null 2>&1; then
    pnpm install
  elif command -v bun >/dev/null 2>&1; then
    bun install
  else
    echo "need npm, pnpm, or bun to install dependencies" >&2
    exit 1
  fi
}

pkg_build() {
  if command -v npm >/dev/null 2>&1; then
    npm run build
  elif command -v pnpm >/dev/null 2>&1; then
    pnpm run build
  elif command -v bun >/dev/null 2>&1; then
    bun run build
  else
    echo "need npm, pnpm, or bun to build" >&2
    exit 1
  fi
}

if [[ ! -d node_modules ]]; then
  pkg_install
fi

pkg_build

FIXTURE="${1:-npm-minor}"
FROM=""
TO=""

case "$FIXTURE" in
  npm-minor|npm-major|no-change)
    FROM="$ROOT/fixtures/$FIXTURE/before.package.json"
    TO="$ROOT/fixtures/$FIXTURE/after.package.json"
    ;;
  *)
    # Allow: ./run.sh --from a.json --to b.json
    exec node "$ROOT/dist/cli.js" analyze "$@"
    ;;
esac

OFFLINE_ARGS=()
if [[ "${OFFLINE:-}" == "1" ]]; then
  OFFLINE_ARGS+=(--offline)
fi

echo "==> Analyzing fixture: $FIXTURE"
node "$ROOT/dist/cli.js" analyze --from "$FROM" --to "$TO" "${OFFLINE_ARGS[@]}"
