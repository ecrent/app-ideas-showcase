# Bin2Dec

> Tier 1 app from [florinpop17/app-ideas](https://github.com/florinpop17/app-ideas)

## Description

A binary-to-decimal (and decimal-to-binary) number converter. Enter a binary number to instantly see its decimal equivalent, or flip to decimal-to-binary mode and type any integer up to 2³² − 1. Results are displayed with a live bit-breakdown panel showing the positional value of each bit (2⁰, 2¹, 2², …) and the running sum formula. A hex display and a one-click swap button let you bounce the result back as new input in the opposite direction.

**Features:**
- Binary → Decimal and Decimal → Binary modes
- Hexadecimal output alongside the decimal result
- Live bit-breakdown with positional values and sum formula
- ⇄ Swap — carry the current result to the opposite mode
- Click-to-copy on any output value
- Quick-example buttons for common values (42, 255, 1024, …)
- Input validation: only `0`/`1` accepted in binary mode; max 32 bits / 4,294,967,295

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite

## Getting Started

```bash
cd apps/01-bin2dec
npm install
npm run dev
```

## Live Demo

Coming soon — [GitHub Pages](https://ecrent.github.io/app-ideas-showcase/apps/01-bin2dec/)

## Status

- [x] Scaffolded
- [x] Core logic
- [x] Styling
- [x] Polish (hex output, swap, bit breakdown)
- [ ] Deployed
