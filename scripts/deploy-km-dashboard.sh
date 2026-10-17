#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILDER="$ROOT/scripts/build-search-v1.12-html.mjs"
HTML="$ROOT/search-v2.html"
SSH_TARGET="${SSH_TARGET:-serverAll}"
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

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    log "ERROR | missing command | $1"
    exit 1
  }
}

require_cmd node
require_cmd ssh
require_cmd scp
require_cmd curl

cd "$ROOT"

log "ACTION | KM_DEPLOY | build search-v2.html"
node --check "$BUILDER"
node "$BUILDER"

log "ACTION | KM_DEPLOY | verify local autonomous HTML"
node - "$HTML" <<'NODE'
const fs = require("fs");
const html = fs.readFileSync(process.argv[2], "utf8");
const match = html.match(/const KM_INDEX=(\[.*?\]);\n/s);
if (!match) throw new Error("KM_INDEX not found");
const index = JSON.parse(match[1]);
if (!index.length) throw new Error("KM_INDEX is empty");
if (!html.includes("KM Search v2")) throw new Error("version mismatch");
const dates = index.map((item) => Date.parse(item.integratedAt || "") || 0);
for (let i = 1; i < dates.length; i += 1) {
  if (dates[i] > dates[i - 1]) {
    throw new Error(`KM_INDEX is not date-desc sorted at ${i}`);
  }
}
console.log(`${index.length} docs; first=${index[0].integratedAt} ${index[0].title}`);
NODE

ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "nginx -t"

log "ACTION | KM_DEPLOY | backup remote indexes on $SSH_TARGET"
ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "mkdir -p /opt/backups/km-dashboard"
for remote in "${REMOTE_TARGETS[@]}"; do
  dir="$(dirname "$remote")"
  name="$(printf %s "$remote" | tr / _)-$STAMP.html"
  ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "mkdir -p '$dir' && cp -a '$remote' '/opt/backups/km-dashboard/$name' 2>/dev/null || true"
done

log "ACTION | KM_DEPLOY | upload autonomous HTML"
for remote in "${REMOTE_TARGETS[@]}"; do
  scp "$HTML" "$SSH_TARGET:$remote.km-next" >/dev/null
  ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "chmod 644 '$remote.km-next' && mv '$remote.km-next' '$remote'"
done

log "ACTION | KM_DEPLOY | permissions and nginx config test"
ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "chown root:root ${REMOTE_TARGETS[*]} && chmod 644 ${REMOTE_TARGETS[*]} && nginx -t"

log "ACTION | KM_DEPLOY | verify exact published content"
EXPECTED="$(shasum -a 256 "$HTML" | cut -d ' ' -f 1)"
for remote in "${REMOTE_TARGETS[@]}"; do
  ACTUAL="$(ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "sha256sum '$remote'" | cut -d ' ' -f 1)"
  [ "$ACTUAL" = "$EXPECTED" ] || { log "ERROR | published checksum mismatch"; exit 1; }
done
ACTUAL="$(curl -fsSL --max-time 15 "$PUBLIC_URL" | shasum -a 256 | cut -d ' ' -f 1)"
[ "$ACTUAL" = "$EXPECTED" ] || { log "ERROR | public checksum mismatch"; exit 1; }

log "RESULTAT | KM_DEPLOY | OK | $PUBLIC_URL"
