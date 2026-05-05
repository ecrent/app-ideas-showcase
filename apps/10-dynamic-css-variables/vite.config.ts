import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app-ideas-showcase/apps/10-dynamic-css-variables/',
  build: {
    outDir: 'dist',
  },
})
