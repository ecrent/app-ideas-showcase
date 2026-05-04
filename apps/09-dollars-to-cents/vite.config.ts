import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app-ideas-showcase/apps/09-dollars-to-cents/',
  build: {
    outDir: 'dist',
  },
})
