# First DB App

> Tier 1 app from [florinpop17/app-ideas](https://github.com/florinpop17/app-ideas)

## Description

A lightweight, browser-based database management tool that lets you create tables, manage data, and perform full CRUD operations entirely in your browser. All data persists locally using browser storage, so you can close and reopen the app without losing your work. Perfect for learning database concepts or quick data organization tasks.

### Features

- ✅ Create custom tables with any columns
- ✅ Add, edit, and delete rows
- ✅ Manage multiple tables
- ✅ LocalStorage persistence — data saved automatically
- ✅ Responsive design for mobile and desktop
- ✅ No server required — 100% client-side

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Vite
- Browser LocalStorage API

## Getting Started

```bash
cd apps/11-first-db-app
npm install
npm run dev
```

Then open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## How to Use

1. **Create a Table**: Start by entering a table name and adding columns (e.g., "Users" with columns "id", "name", "email")
2. **Add Rows**: Click "Add Row" and fill in the data for each column
3. **Edit Rows**: Click "Edit" on any row to modify its values
4. **Delete**: Remove individual rows or entire tables with the delete buttons
5. **Multiple Tables**: Create as many tables as you need and switch between them with the sidebar

## Live Demo

Coming soon — [GitHub Pages](https://ecrent.github.io/app-ideas-showcase/apps/11-first-db-app/)

## Status

- [x] Scaffolded
- [x] Core logic (CRUD operations)
- [x] Styling (Tailwind CSS)
- [x] Polish and UI refinement
- [ ] Deployed
