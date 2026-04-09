#!/usr/bin/env bash
# status.sh — show current build status
# Usage: ./scripts/status.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

python3 - <<'PYEOF'
import json, datetime

TRACKER = '/home/projects/app-ideas-showcase/app-tracker.json'

with open(TRACKER) as f:
    d = json.load(f)

apps      = d['apps']
completed = [a for a in apps if a['status'] == 'completed']
in_prog   = [a for a in apps if a['status'] == 'in-progress']
upcoming  = [a for a in apps if a['status'] == 'upcoming']

pct = round(len(completed) / len(apps) * 100, 1)
bar = '█' * int(pct / 5) + '░' * (20 - int(pct / 5))

print(f"\n\033[1m── App Ideas Showcase — Status ────────────────────\033[0m")
print(f"  Progress : {bar} {pct}%")
print(f"  Done     : {len(completed)}/{len(apps)} apps")

if in_prog:
    a = in_prog[0]
    today = datetime.date.today().isoformat()
    end   = a.get('end_date') or '?'
    days_left = ''
    try:
        delta = (datetime.date.fromisoformat(end) - datetime.date.today()).days + 1
        days_left = f" ({max(0,delta)} day(s) left)"
    except Exception:
        pass
    print(f"\n\033[33m  Building : [{a['index']:02d}] {a['name']}\033[0m")
    print(f"  Tier     : {a['tier']} | Days: {a['days']} | Commits: {a['commits']}")
    print(f"  Deadline : {end}{days_left}")
    print(f"  Folder   : apps/{a['folder']}")

if upcoming:
    nxt = upcoming[0]
    print(f"\n\033[36m  Next up  : [{nxt['index']:02d}] {nxt['name']} (Tier {nxt['tier']}, {nxt['days']} days)\033[0m")

# Recent completed
if completed:
    recent = completed[-3:][::-1]
    print(f"\n  Recent completions:")
    for a in recent:
        print(f"    ✅ [{a['index']:02d}] {a['name']} ({a.get('end_date','?')})")

print()
PYEOF
