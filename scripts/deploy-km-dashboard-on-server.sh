#!/usr/bin/env bash
set -euo pipefail

ROOT="${KM_ROOT:-/opt/km-dashboard}"
BUILDER="$ROOT/scripts/build-search-v1.12-html.mjs"
HTML="$ROOT/search-v2.html"
PUBLIC_URL="${PUBLIC_URL:-https://xn--i-zfa.dev/dashboards/km/}"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$ROOT/logs/$(date +%F).log"
REMOTE_TARGETS=(
  "/var/www/atn/dashboards/km/index.html"
  "/var/www/rub1x/dashboards/km/index.html"
)

log() {
  mkdir -p "$ROOT/logs"
  printf '[%s] %s\n' "$(date +%H:%M)" "$*" | tee -a "$LOG_FILE"
}

node_run() {
  if command -v node >/dev/null 2>&1; then
    node "$@"
    return
  fi
  docker run --rm -v "$ROOT:$ROOT" -w "$ROOT" node:22-alpine node "$@"
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    log "ERROR | missing command | $1"
    exit 1
  }
}

require_cmd docker
require_cmd curl
require_cmd grep
require_cmd nginx

cd "$ROOT"

log "ACTION | KM_SERVER_DEPLOY | build autonomous HTML"
node_run --check "$BUILDER"
node_run "$BUILDER"

log "ACTION | KM_SERVER_DEPLOY | verify local build"
node_run - "$HTML" <<'NODE'
const fs = require("fs");
const html = fs.readFileSync(process.argv[2], "utf8");
const match = html.match(/const KM_INDEX=(\[.*?\]);\n/s);
if (!match) throw new Error("KM_INDEX not found");
const index = JSON.parse(match[1]);
if (!html.includes("KM Search v2")) throw new Error("version mismatch");
const dates = index.map((item) => Date.parse(item.integratedAt || "") || 0);
for (let i = 1; i < dates.length; i += 1) {
  if (dates[i] > dates[i - 1]) throw new Error(`not date-desc at ${i}`);
}
console.log(`${index.length} docs; first=${index[0].integratedAt} ${index[0].title}`);
NODE

nginx -t

log "ACTION | KM_SERVER_DEPLOY | backup current served pages"
mkdir -p /opt/backups/km-dashboard
for remote in "${REMOTE_TARGETS[@]}"; do
  dir="$(dirname "$remote")"
  name="$(printf %s "$remote" | tr / _)-$STAMP.html"
  mkdir -p "$dir"
  cp -a "$remote" "/opt/backups/km-dashboard/$name" 2>/dev/null || true
done

log "ACTION | KM_SERVER_DEPLOY | publish served pages"
for remote in "${REMOTE_TARGETS[@]}"; do
  cp "$HTML" "$remote.km-next"
  chmod 644 "$remote.km-next"
  mv "$remote.km-next" "$remote"
  chown root:root "$remote"
  chmod 644 "$remote"
done

log "ACTION | KM_SERVER_DEPLOY | verify nginx"
nginx -t

log "ACTION | KM_SERVER_DEPLOY | verify exact published content"
EXPECTED="$(sha256sum "$HTML" | cut -d ' ' -f 1)"
for remote in "${REMOTE_TARGETS[@]}"; do
  ACTUAL="$(sha256sum "$remote" | cut -d ' ' -f 1)"
  [ "$ACTUAL" = "$EXPECTED" ] || { log "ERROR | published checksum mismatch"; exit 1; }
done
ACTUAL="$(curl -fsSL --max-time 15 "$PUBLIC_URL" | sha256sum | cut -d ' ' -f 1)"
[ "$ACTUAL" = "$EXPECTED" ] || { log "ERROR | public checksum mismatch"; exit 1; }

log "RESULTAT | KM_SERVER_DEPLOY | OK | $PUBLIC_URL"
