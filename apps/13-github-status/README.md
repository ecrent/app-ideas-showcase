# GitHub Status

> Tier 1 app from [florinpop17/app-ideas](https://github.com/florinpop17/app-ideas)

## Description

A real-time GitHub system status dashboard that displays:
- **Overall System Status** — current operational status with color-coded indicator
- **Component Health** — real-time status of GitHub services (API, git operations, webhooks, etc.)
- **Recent Incidents** — history of recent incidents with impact levels and timestamps
- **Auto-Refresh** — status automatically updates every 60 seconds

The dashboard fetches data from GitHub's official status API (`githubstatus.com`) and presents it in a clean, accessible interface with color-coded status indicators.

## Tech Stack

- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **Vite** for bundling
- **GitHub Status API** v2 for live data

## Features

✅ Real-time status monitoring  
✅ Color-coded status indicators (green/yellow/orange/red/blue)  
✅ Responsive design (mobile-friendly)  
✅ Manual refresh button  
✅ Auto-refresh every 60 seconds  
✅ Error handling with user feedback  
✅ Loading states  
✅ Recent incidents display with impact level  

## Getting Started

```bash
cd apps/13-github-status
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## API Reference

This app uses the GitHub Status API v2:
- **Endpoint**: `https://www.githubstatus.com/api/v2/status.json`
- **Rate Limit**: No authentication required, reasonable rate limits for public access
- **Response**: JSON with overall status, components list, and recent incidents

## Status

- [x] Scaffolded
- [x] Core logic (API integration, data fetching)
- [x] Styling (Tailwind CSS with color-coded status)
- [x] Polish (responsive design, error handling, UX improvements)
- [ ] Deployed
