# Cause Effect App

> Tier 1 app from [florinpop17/app-ideas](https://github.com/florinpop17/app-ideas)

## Description

An interactive tool to explore cause-and-effect relationships. Add causality pairs (a cause and its resulting effect), and the app automatically detects chains where one effect becomes the cause of another. Visualize how actions cascade into outcomes, and persist your relationships in local storage for future reference.

## Features

- **Add Relationships**: Create cause-and-effect pairs with an intuitive input form
- **Chain Detection**: Automatically identifies when effects become causes (e.g., "It rains" → "Ground gets wet" → "Plants grow")
- **Visualization**: View relationships both as individual pairs and as connected chains
- **Local Storage**: All relationships are saved automatically in your browser
- **Full Control**: Delete individual relationships or clear everything at once
- **Keyboard Support**: Press Enter to quickly add new relationships

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite

## Getting Started

```bash
cd apps/05-cause-effect-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Live Demo

[GitHub Pages](https://ecrent.github.io/app-ideas-showcase/apps/05-cause-effect-app/)

## Status

- [x] Scaffolded
- [x] Core logic
- [x] Styling
- [x] Chain visualization
- [x] Local storage persistence
- [x] Polish and refinement
