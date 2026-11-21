#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LABEL="${KM_NOTEPLAN_LAUNCHD_LABEL:-com.bizc0m.km-noteplan-scan}"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
OUT="${KM_NOTEPLAN_OUT:-/private/tmp/km-noteplan-runs}"
MODEL="${KM_OLLAMA_MODEL:-qwen3:8b}"
HOUR="${KM_NOTEPLAN_HOUR:-8}"
MINUTE="${KM_NOTEPLAN_MINUTE:-30}"
LOG_DIR="$ROOT/logs/noteplan-scan"

mkdir -p "$HOME/Library/LaunchAgents" "$LOG_DIR" "$OUT"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>WorkingDirectory</key>
  <string>$ROOT</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$ROOT/scripts/km-noteplan-scan.sh</string>
    <string>--ollama</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>KM_NOTEPLAN_OUT</key>
    <string>$OUT</string>
    <key>KM_OLLAMA_MODEL</key>
    <string>$MODEL</string>
  </dict>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>$HOUR</integer>
    <key>Minute</key>
    <integer>$MINUTE</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>$LOG_DIR/launchd.out.log</string>
  <key>StandardErrorPath</key>
  <string>$LOG_DIR/launchd.err.log</string>
</dict>
</plist>
PLIST

if launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)" "$PLIST" >/dev/null 2>&1 || true
fi
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl enable "gui/$(id -u)/$LABEL"

echo "Installed $LABEL"
echo "Plist: $PLIST"
echo "Schedule: ${HOUR}:${MINUTE}"
echo "Output: $OUT"
echo "Logs: $LOG_DIR"
