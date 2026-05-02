# CSV2JSON

> Tier 1 app from [florinpop17/app-ideas](https://github.com/florinpop17/app-ideas)

## Description

A simple yet powerful CSV to JSON converter. Upload a CSV file or paste CSV data directly to instantly convert it to JSON format. Download the result or copy it to your clipboard.

## Features

- **File Upload**: Upload CSV files directly from your computer
- **Text Input**: Paste CSV data directly into the text area
- **Instant Conversion**: Convert CSV to JSON with a single click
- **Copy & Download**: Copy the JSON output to clipboard or download as a file
- **Error Handling**: Clear error messages for invalid CSV format
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite

## Getting Started

```bash
cd apps/08-csv2json
npm install
npm run dev
```

Visit `http://localhost:5173` to see the app.

## How to Use

1. **Input CSV Data**
   - Click "Upload CSV File" to select a file from your computer, or
   - Paste CSV data directly into the text area
   - The first row should contain column headers

2. **Convert**
   - Click the "Convert to JSON" button to transform your data

3. **Export**
   - Click "Copy" to copy the JSON output to your clipboard
   - Click "Download" to save the JSON as a file

## CSV Format

The app expects CSV data in standard format:
- First row contains headers (column names)
- Each subsequent row is a data entry
- Values are comma-separated
- Whitespace is automatically trimmed

Example:
```
name,age,city
John,28,New York
Jane,34,Los Angeles
```

Will convert to:
```json
[
  { "name": "John", "age": "28", "city": "New York" },
  { "name": "Jane", "age": "34", "city": "Los Angeles" }
]
```

## Live Demo

Coming soon — [GitHub Pages](https://ecrent.github.io/app-ideas-showcase/apps/08-csv2json/)

## Status

- [x] Scaffolded
- [x] Core logic
- [x] Styling
- [x] Tests / polish
- [ ] Deployed
