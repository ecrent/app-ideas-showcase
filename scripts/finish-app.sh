#!/usr/bin/env bash
# finish-app.sh — mark the current app as complete
# Usage: ./scripts/finish-app.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

cd "$PROJECT_DIR"

APP_JSON=$(current_app)
if [[ "$APP_JSON" == "null" ]]; then
  error "No app in progress. Run ./scripts/start-app.sh first."
  exit 1
fi

FOLDER=$(echo "$APP_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['folder'])")
NAME=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['name'])")
INDEX=$(echo "$APP_JSON"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['index'])")
COMMITS=$(echo "$APP_JSON"| python3 -c "import sys,json; d=json.load(sys.stdin); print(d['commits'])")

TODAY=$(date +%Y-%m-%d)

tracker_update_app "$INDEX" "status"   "completed"
tracker_update_app "$INDEX" "end_date" "$TODAY"
tracker_set_meta   "completed_apps"    "$(python3 -c "
import json
with open('$TRACKER') as f: d=json.load(f)
print(sum(1 for a in d['apps'] if a['status']=='completed'))
")"

"$SCRIPT_DIR/update-readme.sh"

git add app-tracker.json README.md
git commit -m "feat(${FOLDER}): complete app $INDEX — $NAME

$COMMITS commits | Finished on $TODAY"

git_push

success "Completed: $NAME ($COMMITS commits)"
info "Run ./scripts/start-app.sh to begin the next app."
