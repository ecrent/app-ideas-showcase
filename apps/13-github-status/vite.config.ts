import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app-ideas-showcase/apps/13-github-status/',
  build: {
    outDir: 'dist',
  },
})
