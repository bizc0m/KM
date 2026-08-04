#!/usr/bin/env bash
set -euo pipefail

ROOT="${KM_ROOT:-/opt/km-dashboard}"

cd "$ROOT"

node_run() {
  if command -v node >/dev/null 2>&1; then
    node "$@"
    return
  fi
  docker run --rm -v "$ROOT:$ROOT" -w "$ROOT" node:22-alpine node "$@"
}

node_run "$ROOT/scripts/km-raindrop-rss-ingest.mjs"
"$ROOT/scripts/deploy-km-dashboard-on-server.sh"
