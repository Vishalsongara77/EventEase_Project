import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/EventEase_Project/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
