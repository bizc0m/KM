#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILDER="$ROOT/scripts/build-search-v1.11-html.mjs"
HTML="$ROOT/search-v1.11.html"
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

log "ACTION | KM_DEPLOY | build search-v1.11.html"
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
if (!/<option value="date">Date recente<\/option>/.test(html)) {
  throw new Error("default date sort option missing");
}
const dates = index.map((item) => Date.parse(item.integratedAt || "") || 0);
for (let i = 1; i < dates.length; i += 1) {
  if (dates[i] > dates[i - 1]) {
    throw new Error(`KM_INDEX is not date-desc sorted at ${i}`);
  }
}
console.log(`${index.length} docs; first=${index[0].integratedAt} ${index[0].title}`);
NODE

log "ACTION | KM_DEPLOY | backup remote indexes on $SSH_TARGET"
ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "mkdir -p /opt/backups/km-dashboard"
for remote in "${REMOTE_TARGETS[@]}"; do
  dir="$(dirname "$remote")"
  name="$(basename "$dir")-$(basename "$remote" .html)-$STAMP.html"
  ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "mkdir -p '$dir' && cp -a '$remote' '/opt/backups/km-dashboard/$name' 2>/dev/null || true"
done

log "ACTION | KM_DEPLOY | upload autonomous HTML"
for remote in "${REMOTE_TARGETS[@]}"; do
  scp "$HTML" "$SSH_TARGET:$remote" >/dev/null
done

log "ACTION | KM_DEPLOY | permissions and nginx config test"
ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "chown root:root ${REMOTE_TARGETS[*]} && chmod 644 ${REMOTE_TARGETS[*]} && nginx -t"

log "ACTION | KM_DEPLOY | verify remote file content"
ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_TARGET" "grep -q 'Date recente' '${REMOTE_TARGETS[0]}' && grep -q 'Notion - Les 7 Docs' '${REMOTE_TARGETS[0]}' && grep -q '114 fiches' '${REMOTE_TARGETS[0]}'"

log "ACTION | KM_DEPLOY | verify public URL $PUBLIC_URL"
curl -fsSL --max-time 15 "$PUBLIC_URL" \
  | grep -E 'KM Search v1.11|Date recente|Notion - Les 7 Docs|114 fiches' >/dev/null

log "RESULTAT | KM_DEPLOY | OK | $PUBLIC_URL"
