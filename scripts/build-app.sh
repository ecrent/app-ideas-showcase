#!/usr/bin/env bash
# build-app.sh — triggered by cron at 3 PM
# Runs a Claude Code agent that builds the current/next app

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

cd "$PROJECT_DIR"

# ── figure out what to build ──────────────────────────────────────────────────
APP_JSON=$(current_app)

# If nothing in progress, start the next one first
if [[ "$APP_JSON" == "null" ]]; then
  info "No app in progress — starting next app..."
  "$SCRIPT_DIR/start-app.sh"
  APP_JSON=$(current_app)
fi

if [[ "$APP_JSON" == "null" ]]; then
  success "All 82 apps complete!"
  exit 0
fi

FOLDER=$(echo "$APP_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['folder'])")
NAME=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['name'])")
INDEX=$(echo "$APP_JSON"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['index'])")
TIER=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['tier'])")
DAYS=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['days'])")
DESC=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['description'])")
START=$(echo "$APP_JSON"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['start_date'])")
END=$(echo "$APP_JSON"    | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['end_date'])")
COMMITS=$(echo "$APP_JSON"| python3 -c "import sys,json; d=json.load(sys.stdin); print(d['commits'])")

TODAY=$(date +%Y-%m-%d)
APP_DIR="$PROJECT_DIR/apps/$FOLDER"

# ── figure out which build day we're on ───────────────────────────────────────
BUILD_DAY=$(python3 -c "
import datetime
start = datetime.date.fromisoformat('$START')
today = datetime.date.today()
print((today - start).days + 1)
")

IS_LAST_DAY=false
if [[ "$BUILD_DAY" -ge "$DAYS" ]]; then
  IS_LAST_DAY=true
fi

info "Building: [$INDEX] $NAME (Tier $TIER, day $BUILD_DAY/$DAYS)"

# ── compose the prompt for Claude ────────────────────────────────────────────
PROMPT="You are working on a project at $PROJECT_DIR.

You are building app $INDEX/82: **$NAME**
- Description: $DESC
- Tier: $TIER
- Folder: $APP_DIR
- Build day: $BUILD_DAY of $DAYS
- Commits made so far today: $COMMITS
- Last day of this app: $IS_LAST_DAY

The app uses React + TypeScript + Tailwind CSS + Vite. The scaffold already exists in $APP_DIR.

Your job today:
$(if [[ "$BUILD_DAY" -eq 1 ]]; then
  echo "- Day 1: Implement the core logic and basic UI. Get the app functional."
elif [[ "$IS_LAST_DAY" == "true" ]]; then
  echo "- Final day: Polish the UI, fix any bugs, make it look good with Tailwind. Add a proper app description to the README in $APP_DIR/README.md."
else
  echo "- Day $BUILD_DAY: Continue building. Add more features, improve the UI, handle edge cases."
fi)

Rules:
- Write real, working code. No placeholders.
- Make 2-3 meaningful commits using: cd $PROJECT_DIR && git add apps/$FOLDER && git commit -m '...' && git push origin main
- Commit messages should be short and natural (e.g. 'add conversion logic', 'style the input panel')
- Do NOT use ./scripts/commit.sh — use git directly so you control the message exactly
- After all commits, update the commit count in app-tracker.json: set apps[$((INDEX-1))].commits to $((COMMITS + 3)) (approximate)
$(if [[ "$IS_LAST_DAY" == "true" ]]; then
  echo "- This is the last day: after finishing, run: bash $SCRIPT_DIR/finish-app.sh"
fi)

Start by reading the existing scaffold in $APP_DIR, then build the app."

# ── run claude ────────────────────────────────────────────────────────────────
LOG_FILE="$PROJECT_DIR/logs/build-$(date +%Y%m%d-%H%M%S)-$FOLDER.log"
info "Starting Claude agent... (log: $LOG_FILE)"

claude --dangerously-skip-permissions -p "$PROMPT" 2>&1 | tee "$LOG_FILE"

success "Build session complete for $NAME (day $BUILD_DAY/$DAYS)"
