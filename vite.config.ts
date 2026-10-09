import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// three.js lives in the lazily loaded hero Scene chunk, so the page paints before it arrives.
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1400 },
})
