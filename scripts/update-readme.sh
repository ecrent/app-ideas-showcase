#!/usr/bin/env bash
# update-readme.sh — regenerate root README.md from app-tracker.json
# Called automatically by start-app / finish-app / daily-report

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

python3 - <<'PYEOF'
import json

TRACKER = '/home/projects/app-ideas-showcase/app-tracker.json'
README   = '/home/projects/app-ideas-showcase/README.md'
BASE_URL = 'https://ecrent.github.io/app-ideas-showcase/apps'

with open(TRACKER) as f:
    d = json.load(f)

apps = d['apps']

completed = [a for a in apps if a['status'] == 'completed']
in_prog   = [a for a in apps if a['status'] == 'in-progress']

def app_line(a):
    name = a['name']
    if a['status'] == 'completed':
        return f"- [{name}]({BASE_URL}/{a['folder']}/)"
    elif a['status'] == 'in-progress':
        return f"- {name} *(in progress)*"
    else:
        return f"- {name}"

tier1 = '\n'.join(app_line(a) for a in apps if a['tier'] == 1)
tier2 = '\n'.join(app_line(a) for a in apps if a['tier'] == 2)
tier3 = '\n'.join(app_line(a) for a in apps if a['tier'] == 3)

readme = f"""# app-ideas-showcase

working my way through all the projects from [florinpop17/app-ideas](https://github.com/florinpop17/app-ideas). building each one with React, TypeScript, and Tailwind.

{len(completed)}/82 done so far.

---

### Tier 1

{tier1}

### Tier 2

{tier2}

### Tier 3

{tier3}
"""

with open(README, 'w') as f:
    f.write(readme)

print(f"README updated — {len(completed)} complete, {len(in_prog)} in progress")
PYEOF
