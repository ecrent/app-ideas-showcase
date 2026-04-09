#!/usr/bin/env bash
# daily-report.sh — generate and email the daily progress report
# Called by cron every evening. Also callable manually.
# Usage: ./scripts/daily-report.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

TODAY=$(date +%Y-%m-%d)
TODAY_DISPLAY=$(date "+%A, %B %-d %Y")

# ── gather data ───────────────────────────────────────────────────────────────
REPORT=$(python3 - "$TODAY" <<'PYEOF'
import json, sys, subprocess, datetime

TRACKER = '/home/projects/app-ideas-showcase/app-tracker.json'
today   = sys.argv[1]

with open(TRACKER) as f:
    d = json.load(f)

apps      = d['apps']
completed = [a for a in apps if a['status'] == 'completed']
in_prog   = [a for a in apps if a['status'] == 'in-progress']
upcoming  = [a for a in apps if a['status'] == 'upcoming']
pct       = round(len(completed) / len(apps) * 100, 1)

# git log for today
try:
    log = subprocess.check_output(
        ['git', '-C', '/home/projects/app-ideas-showcase', 'log',
         '--oneline', '--after', f'{today} 00:00',
         '--before', f'{today} 23:59'],
        stderr=subprocess.DEVNULL
    ).decode().strip()
    commits_today = log if log else "No commits today."
except Exception:
    commits_today = "Could not retrieve git log."

current = in_prog[0] if in_prog else None
nxt     = upcoming[0] if upcoming else None

lines = []
lines.append(f"PROGRESS: {len(completed)}/{len(apps)} apps ({pct}%)")
lines.append("")

if current:
    end   = current.get('end_date','?')
    try:
        days_left = (datetime.date.fromisoformat(end) - datetime.date.today()).days + 1
    except Exception:
        days_left = '?'
    lines.append(f"CURRENT APP: [{current['index']:02d}] {current['name']}")
    lines.append(f"  Tier: {current['tier']} | Days: {current['days']} | Commits so far: {current['commits']}")
    lines.append(f"  Deadline: {end} ({days_left} day(s) remaining)")
    lines.append(f"  Folder: apps/{current['folder']}")
else:
    lines.append("CURRENT APP: None in progress")

lines.append("")
lines.append("TODAY'S COMMITS:")
for line in commits_today.splitlines():
    lines.append(f"  {line}")

lines.append("")
if nxt and not current:
    lines.append(f"NEXT APP: [{nxt['index']:02d}] {nxt['name']} (Tier {nxt['tier']}, {nxt['days']} days)")
    lines.append("  Run: ./scripts/start-app.sh")
elif nxt:
    lines.append(f"AFTER CURRENT: [{nxt['index']:02d}] {nxt['name']} (Tier {nxt['tier']}, {nxt['days']} days)")

lines.append("")
lines.append(f"REPO: https://github.com/ecrent/app-ideas-showcase")

print('\n'.join(lines))
PYEOF
)

# ── compose email ─────────────────────────────────────────────────────────────
SUBJECT="[App Ideas] Daily Report — $TODAY_DISPLAY"

BODY="Daily build report for App Ideas Showcase
$TODAY_DISPLAY
================================================

$REPORT

--
Automated report from app-ideas-showcase
https://github.com/ecrent/app-ideas-showcase
"

# ── send via msmtp ────────────────────────────────────────────────────────────
if command -v msmtp &>/dev/null; then
  printf "To: %s\nFrom: %s\nSubject: %s\n\n%s\n" \
    "$REPORT_EMAIL" \
    "$GMAIL_USER" \
    "$SUBJECT" \
    "$BODY" \
    | msmtp --account=gmail "$REPORT_EMAIL"
  success "Email sent to $REPORT_EMAIL"
else
  warn "msmtp not found — printing report instead:"
  echo "Subject: $SUBJECT"
  echo "---"
  echo "$BODY"
fi

# ── also log locally ──────────────────────────────────────────────────────────
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"
printf "[%s]\n%s\n\n" "$TODAY" "$BODY" >> "$LOG_DIR/daily-reports.log"
