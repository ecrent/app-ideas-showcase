# IOT Mailbox Simulator

> Tier 1 app from [florinpop17/app-ideas](https://github.com/florinpop17/app-ideas)

## Description

A smart mailbox notification simulator that mimics an IoT-connected mailbox. Receive random mail notifications from various senders, organize them by category (work, personal, promotional, other), and manage your inbox with filtering and deletion. All mail items are persisted to browser storage.

**Features:**
- 📬 Simulate incoming mail with random senders and subjects
- 🔔 Toast notifications when new mail arrives
- 📋 Filter mail by read status (all, unread, read)
- 🏷️ Auto-categorize mail by sender
- 💾 Persistent storage using browser localStorage
- 🎨 Modern dark UI with glassmorphism effects

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Vite

## Getting Started

```bash
cd apps/15-iot-mailbox-simulator
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## How to Use

1. Click **"Receive Mail"** to add a new mail item to your inbox
2. Click on any mail item to mark it as read/unread
3. Use the filter tabs to view all, unread, or read messages
4. Click the **"×"** button to delete individual mail items
5. Click **"Clear All"** to empty your inbox

Mail is automatically categorized by sender:
- **Work**: GitHub, LinkedIn, Stripe
- **Personal**: Netflix, Apple
- **Promotional**: Amazon, Google
- **Other**: Microsoft

## Live Demo

[GitHub Pages](https://ecrent.github.io/app-ideas-showcase/apps/15-iot-mailbox-simulator/)

## Status

- [x] Scaffolded
- [x] Core logic
- [x] Styling
- [x] Tests / polish
- [ ] Deployed
