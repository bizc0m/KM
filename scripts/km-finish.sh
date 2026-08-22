#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUSH=0

for arg in "$@"; do
  case "$arg" in
    --push) PUSH=1 ;;
    *) echo "Argument inconnu: $arg" >&2; exit 2 ;;
  esac
done

cd "$ROOT"

echo "== KM finish =="
echo "Root: $ROOT"

node --check scripts/build-search-v1.12-html.mjs
node --check scripts/km-local-app.mjs
npm test
npm run build
KM_ROOT="$ROOT" node scripts/build-search-v1.12-html.mjs
git diff --check

if curl -fsS -o /dev/null "http://127.0.0.1:8767/"; then
  echo "App locale: OK http://127.0.0.1:8767/"
else
  echo "App locale: non joignable, lancer npm run km:install ou npm run km:app"
fi

if curl -fsS -o /dev/null "http://127.0.0.1:8766/search-v1.12.html"; then
  echo "Dashboard local: OK http://127.0.0.1:8766/search-v1.12.html"
else
  echo "Dashboard local: serveur 8766 non joignable"
fi

if [ "$PUSH" -eq 0 ]; then
  echo "Push: ignore sans --push"
  git status --short
  exit 0
fi

if [ -n "$(git status --short)" ]; then
  git add .
  git commit -m "km: finish build dashboard"
else
  echo "Commit: aucun changement"
fi

git push origin "$(git branch --show-current)"
git status -sb
