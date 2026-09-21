#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MODEL="${KM_OLLAMA_MODEL:-qwen3:8b}"
OUT="${KM_NOTEPLAN_OUT:-/private/tmp/km-noteplan-runs}"

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

node scripts/km-noteplan-scan.mjs "${ARGS[@]}" "$@"
