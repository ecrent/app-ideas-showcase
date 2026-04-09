#!/usr/bin/env bash
# commit.sh — stage, commit, and push changes for the current app
# Usage: ./scripts/commit.sh "your commit message"
#        ./scripts/commit.sh  (prompts for message)

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

cd "$PROJECT_DIR"

# ── get message ───────────────────────────────────────────────────────────────
if [[ $# -ge 1 ]]; then
  MSG="$*"
else
  echo -n "Commit message: "
  read -r MSG
fi

if [[ -z "$MSG" ]]; then
  error "Commit message cannot be empty."
  exit 1
fi

# ── find current app ──────────────────────────────────────────────────────────
APP_JSON=$(current_app)
if [[ "$APP_JSON" == "null" ]]; then
  error "No app in progress. Run ./scripts/start-app.sh first."
  exit 1
fi

FOLDER=$(echo "$APP_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['folder'])")
NAME=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['name'])")
INDEX=$(echo "$APP_JSON"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['index'])")
COMMITS=$(echo "$APP_JSON"| python3 -c "import sys,json; d=json.load(sys.stdin); print(d['commits'])")

# ── stage & commit ────────────────────────────────────────────────────────────
# Stage the current app folder + tracker
git add "apps/$FOLDER" app-tracker.json README.md 2>/dev/null || true
git add -u 2>/dev/null || true

if git diff --cached --quiet; then
  warn "Nothing staged to commit."
  exit 0
fi

NEW_COMMITS=$((COMMITS + 1))
tracker_update_app "$INDEX" "commits" "$NEW_COMMITS"
git add app-tracker.json

git commit -m "${FOLDER}: $MSG

App $INDEX/82 — $NAME (commit $NEW_COMMITS)"

git_push

success "Committed and pushed: \"$MSG\" (commit $NEW_COMMITS for $NAME)"
