#!/bin/bash
set -euo pipefail
KM_PUBLISH_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KM_PUBLISH_NODE="$(command -v node)"
export KM_PUBLISH_ROOT KM_PUBLISH_NODE
python3 - <<'PY'
import os,plistlib,pathlib
root=os.environ['KM_PUBLISH_ROOT'];node=os.environ['KM_PUBLISH_NODE'];home=pathlib.Path.home()
logs=home/'Library/Application Support/KM/public-publisher';logs.mkdir(parents=True,exist_ok=True)
p=home/'Library/LaunchAgents/com.bizc0m.km-public-publisher.plist';p.parent.mkdir(parents=True,exist_ok=True)
p.write_bytes(plistlib.dumps({'Label':'com.bizc0m.km-public-publisher','ProgramArguments':[node,root+'/scripts/km-publish-m2.mjs'],'WorkingDirectory':root,'RunAtLoad':True,'StartInterval':3600,'EnvironmentVariables':{'HOME':str(home),'PATH':str(pathlib.Path(node).parent)+':/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin'},'StandardOutPath':str(logs/'launchd.out.log'),'StandardErrorPath':str(logs/'launchd.err.log')}))
PY
launchctl bootout "gui/$(id -u)/com.bizc0m.km-public-publisher" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.bizc0m.km-public-publisher.plist"
