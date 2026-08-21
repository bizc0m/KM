#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/com.job.km-monitor-local-app.plist"
PORT="${KM_LOCAL_APP_PORT:-8767}"

mkdir -p "$HOME/.km-monitor" "$HOME/Library/LaunchAgents"

if [ ! -f "$HOME/.km-monitor/config.json" ]; then
  cat > "$HOME/.km-monitor/config.json" <<JSON
{
  "kmRoot": "$ROOT",
  "dashboard": "search-v1.12.html",
  "sources": {
    "rss": [],
    "twitter": [],
    "reddit": []
  }
}
JSON
fi

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.job.km-monitor-local-app</string>
  <key>ProgramArguments</key>
  <array>
    <string>$(command -v node)</string>
    <string>$ROOT/scripts/km-local-app.mjs</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>KM_LOCAL_APP_PORT</key>
    <string>$PORT</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$HOME/.km-monitor/local-app.log</string>
  <key>StandardErrorPath</key>
  <string>$HOME/.km-monitor/local-app.err</string>
  <key>WorkingDirectory</key>
  <string>$ROOT</string>
</dict>
</plist>
PLIST

launchctl unload "$PLIST" >/dev/null 2>&1 || true
launchctl load "$PLIST"

echo "KM Monitor Local installe: http://127.0.0.1:$PORT"
echo "Config: $HOME/.km-monitor/config.json"
