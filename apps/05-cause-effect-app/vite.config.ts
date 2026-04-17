import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app-ideas-showcase/apps/05-cause-effect-app/',
  build: {
    outDir: 'dist',
  },
})
