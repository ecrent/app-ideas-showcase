#!/usr/bin/env bash
# Shared library — source this in every script

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TRACKER="$PROJECT_DIR/app-tracker.json"
ENV_FILE="$PROJECT_DIR/.env"

# Load .env
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# ── tracker helpers ───────────────────────────────────────────────────────────

tracker_get() {
  # tracker_get <jq_expression>
  python3 -c "
import json, sys
with open('$TRACKER') as f:
    d = json.load(f)
expr = sys.argv[1]
# simple dotted path: .meta.current_app_index  or  .apps[0].name
parts = expr.lstrip('.').split('.')
val = d
for p in parts:
    if '[' in p:
        key, idx = p.rstrip(']').split('[')
        val = val[key][int(idx)]
    else:
        val = val[p]
print(val)
" "$1"
}

tracker_set_meta() {
  # tracker_set_meta <key> <value>
  python3 - "$1" "$2" <<'EOF'
import json, sys
key, value = sys.argv[1], sys.argv[2]
with open('/home/projects/app-ideas-showcase/app-tracker.json') as f:
    d = json.load(f)
# try numeric conversion
try:
    value = int(value)
except ValueError:
    pass
d['meta'][key] = value
with open('/home/projects/app-ideas-showcase/app-tracker.json', 'w') as f:
    json.dump(d, f, indent=2)
EOF
}

tracker_update_app() {
  # tracker_update_app <index_1based> <key> <value>
  python3 - "$1" "$2" "$3" <<'EOF'
import json, sys
idx, key, value = int(sys.argv[1])-1, sys.argv[2], sys.argv[3]
with open('/home/projects/app-ideas-showcase/app-tracker.json') as f:
    d = json.load(f)
try:
    value = int(value)
except ValueError:
    pass
d['apps'][idx][key] = value
with open('/home/projects/app-ideas-showcase/app-tracker.json', 'w') as f:
    json.dump(d, f, indent=2)
EOF
}

current_app() {
  python3 - <<'EOF'
import json
with open('/home/projects/app-ideas-showcase/app-tracker.json') as f:
    d = json.load(f)
idx = d['meta']['current_app_index']
if idx < len(d['apps']):
    app = d['apps'][idx]
    print(json.dumps(app))
else:
    print('null')
EOF
}

next_upcoming_app() {
  python3 - <<'EOF'
import json
with open('/home/projects/app-ideas-showcase/app-tracker.json') as f:
    d = json.load(f)
for app in d['apps']:
    if app['status'] == 'upcoming':
        print(json.dumps(app))
        break
else:
    print('null')
EOF
}

# ── git helpers ───────────────────────────────────────────────────────────────

git_push() {
  cd "$PROJECT_DIR"
  git push origin main 2>&1
}

# ── color output ──────────────────────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET} $*"; }
success() { echo -e "${GREEN}[OK]${RESET}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET} $*"; }
error()   { echo -e "${RED}[ERR]${RESET}  $*" >&2; }
