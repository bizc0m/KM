#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MODEL="${KM_OLLAMA_MODEL:-qwen3:8b}"
OUT="${KM_NOTEPLAN_OUT:-/private/tmp/km-noteplan-runs}"
NODE_BIN="${NODE_BIN:-$(command -v node || true)}"

if [[ -z "$NODE_BIN" ]]; then
  for candidate in /opt/homebrew/bin/node /usr/local/bin/node /usr/bin/node; do
    if [[ -x "$candidate" ]]; then
      NODE_BIN="$candidate"
      break
    fi
  done
fi

if [[ -z "$NODE_BIN" ]]; then
  echo "node introuvable. Definir NODE_BIN=/chemin/vers/node." >&2
  exit 127
fi

ARGS=("--out" "$OUT")

if [[ "${1:-}" == "--ollama" ]]; then
  ARGS+=("--ollama" "--model" "$MODEL")
  shift
fi

if [[ "${1:-}" == "--input" ]]; then
  ARGS+=("--input" "$2")
  shift 2
fi

if [[ "${1:-}" == "--days" ]]; then
  ARGS+=("--days" "$2")
  shift 2
fi

"$NODE_BIN" scripts/km-noteplan-scan.mjs "${ARGS[@]}" "$@"
