import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app-ideas-showcase/apps/08-csv2json/',
  build: {
    outDir: 'dist',
  },
})
