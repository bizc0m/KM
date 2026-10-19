#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABEL=com.bizc0m.km-technical-pipeline
DATA="$HOME/Library/Application Support/KM/pipeline"
NODE_BIN="${NODE_BIN:-/opt/homebrew/bin/node}"
mkdir -p "$DATA" "$HOME/Library/LaunchAgents"
chmod 700 "$DATA"
export ROOT DATA NODE_BIN LABEL
/usr/bin/python3 - <<'PY'
import os,plistlib
e=os.environ
data={'Label':e['LABEL'],'ProgramArguments':[e['NODE_BIN'],e['ROOT']+'/scripts/km-technical-run.mjs'],'WorkingDirectory':e['ROOT'],'EnvironmentVariables':{'HOME':e['HOME'],'PATH':'/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin','KM_ROOT':e['ROOT'],'KM_PIPELINE_DATA':e['DATA'],'KM_OLLAMA_MODEL':'qwen3:8b','KM_NOTEPLAN_SSH':'1'},'StartCalendarInterval':[{'Hour':h,'Minute':30} for h in (2,8,14,20)],'RunAtLoad':True,'ProcessType':'Background','StandardOutPath':e['DATA']+'/launchd.out.log','StandardErrorPath':e['DATA']+'/launchd.err.log'}
with open(os.path.expanduser('~/Library/LaunchAgents/'+e['LABEL']+'.plist'),'wb') as f:plistlib.dump(data,f)
server={'Label':'com.bizc0m.km-technical-server','ProgramArguments':[e['NODE_BIN'],e['ROOT']+'/scripts/km-technical-server.mjs'],'WorkingDirectory':e['ROOT'],'RunAtLoad':True,'KeepAlive':True,'EnvironmentVariables':{'KM_ROOT':e['ROOT']},'StandardOutPath':e['DATA']+'/server.out.log','StandardErrorPath':e['DATA']+'/server.err.log'}
health={'Label':'com.bizc0m.km-technical-health','ProgramArguments':[e['NODE_BIN'],e['ROOT']+'/scripts/km-technical-health.mjs'],'StartInterval':3600,'RunAtLoad':True,'StandardOutPath':e['DATA']+'/health.out.log','StandardErrorPath':e['DATA']+'/health.err.log'}
for item in [server,health]:
 with open(os.path.expanduser('~/Library/LaunchAgents/'+item['Label']+'.plist'),'wb') as f:plistlib.dump(item,f)
PY
load_agent() {
  local label="$1"
  launchctl bootout "gui/$(id -u)/$label" 2>/dev/null || true
  for attempt in 1 2 3; do
    if launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/$label.plist"; then
      launchctl enable "gui/$(id -u)/$label"
      return 0
    fi
    sleep 1
  done
  launchctl print "gui/$(id -u)/$label" >/dev/null
}
for LABEL_TO_LOAD in "$LABEL" com.bizc0m.km-technical-server com.bizc0m.km-technical-health; do load_agent "$LABEL_TO_LOAD"; done
echo "Installed $LABEL : 02:30 / 08:30 / 14:30 / 20:30, timezone of M2"
