#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="$ROOT/noteplan-km-bridge"
DEFAULT_DIR="$HOME/Library/Containers/co.noteplan.NotePlan3/Data/Library/Application Support/co.noteplan.NotePlan3/Plugins"
TARGET_DIR="${NOTEPLAN_PLUGIN_DIR:-$DEFAULT_DIR}"
TARGET="$TARGET_DIR/av.km-bridge"

if [ ! -d "$SOURCE" ]; then
  echo "Source plugin introuvable: $SOURCE" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
rm -rf "$TARGET"
cp -R "$SOURCE" "$TARGET"

echo "KM Bridge installe dans:"
echo "$TARGET"
echo
echo "Relancer NotePlan si le plugin n'apparait pas."
