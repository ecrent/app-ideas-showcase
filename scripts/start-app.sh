#!/usr/bin/env bash
# start-app.sh — scaffold the next app in the list
# Usage: ./scripts/start-app.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

cd "$PROJECT_DIR"

# ── find next app ─────────────────────────────────────────────────────────────
APP_JSON=$(next_upcoming_app)
if [[ "$APP_JSON" == "null" ]]; then
  success "All 82 apps are complete! Incredible work!"
  exit 0
fi

FOLDER=$(echo "$APP_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['folder'])")
NAME=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['name'])")
INDEX=$(echo "$APP_JSON"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['index'])")
TIER=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['tier'])")
DAYS=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['days'])")
DESC=$(echo "$APP_JSON"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['description'])")

APP_DIR="$PROJECT_DIR/apps/$FOLDER"

info "Starting app $INDEX/82: ${BOLD}$NAME${RESET} (Tier $TIER, $DAYS days)"

if [[ -d "$APP_DIR" ]]; then
  warn "Folder $APP_DIR already exists — resuming."
else
  mkdir -p "$APP_DIR"
fi

TODAY=$(date +%Y-%m-%d)
END_DATE=$(date -d "$TODAY + $((DAYS - 1)) days" +%Y-%m-%d 2>/dev/null || date -v "+$((DAYS-1))d" +%Y-%m-%d)

# ── scaffold README ───────────────────────────────────────────────────────────
cat > "$APP_DIR/README.md" <<READMEEOF
# $NAME

> Tier $TIER app from [florinpop17/app-ideas](https://github.com/florinpop17/app-ideas)

## Description

$DESC

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite

## Getting Started

\`\`\`bash
cd apps/$FOLDER
npm install
npm run dev
\`\`\`

## Live Demo

Coming soon — [GitHub Pages](https://ecrent.github.io/app-ideas-showcase/apps/$FOLDER/)

## Screenshots

_Add screenshots here_

## Status

- [x] Scaffolded
- [ ] Core logic
- [ ] Styling
- [ ] Tests / polish
- [ ] Deployed
READMEEOF

# ── scaffold package.json + vite config ───────────────────────────────────────
cat > "$APP_DIR/package.json" <<PKGEOF
{
  "name": "$FOLDER",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.2",
    "vite": "^5.0.8"
  }
}
PKGEOF

# ── vite config ───────────────────────────────────────────────────────────────
cat > "$APP_DIR/vite.config.ts" <<VITEEOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app-ideas-showcase/apps/$FOLDER/',
  build: {
    outDir: 'dist',
  },
})
VITEEOF

# ── tsconfig ──────────────────────────────────────────────────────────────────
cat > "$APP_DIR/tsconfig.json" <<TSEOF
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
TSEOF

# ── tailwind config ───────────────────────────────────────────────────────────
cat > "$APP_DIR/tailwind.config.js" <<TWEOF
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
TWEOF

cat > "$APP_DIR/postcss.config.js" <<PCEOF
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
PCEOF

# ── index.html ────────────────────────────────────────────────────────────────
cat > "$APP_DIR/index.html" <<HTMLEOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$NAME</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTMLEOF

# ── src/ ──────────────────────────────────────────────────────────────────────
mkdir -p "$APP_DIR/src"

cat > "$APP_DIR/src/main.tsx" <<MAINEOF
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
MAINEOF

cat > "$APP_DIR/src/index.css" <<CSSEOF
@tailwind base;
@tailwind components;
@tailwind utilities;
CSSEOF

cat > "$APP_DIR/src/App.tsx" <<APPEOF
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">$NAME</h1>
        <p className="text-gray-600">$DESC</p>
      </div>
    </div>
  )
}
APPEOF

# ── update tracker ────────────────────────────────────────────────────────────
tracker_update_app "$INDEX" "status"     "in-progress"
tracker_update_app "$INDEX" "start_date" "$TODAY"
tracker_update_app "$INDEX" "end_date"   "$END_DATE"
tracker_set_meta   "current_app_index"   "$((INDEX - 1))"

# ── initial commit ────────────────────────────────────────────────────────────
git add "apps/$FOLDER" app-tracker.json
git commit -m "feat(${FOLDER}): scaffold app $INDEX — $NAME

Tier $TIER | $DAYS-day build | Target: $TODAY – $END_DATE
$DESC"

git_push

"$SCRIPT_DIR/update-readme.sh"

success "App $INDEX started: $NAME"
echo -e "  Folder : ${BOLD}apps/$FOLDER${RESET}"
echo -e "  Days   : $TODAY → $END_DATE"
echo -e "  Run    : cd apps/$FOLDER && npm install && npm run dev"
