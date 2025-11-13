import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Resume-builder/', // ✅ Must match folder name exactly
  plugins: [react()],
})
