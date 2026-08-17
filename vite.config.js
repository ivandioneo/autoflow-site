import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Expose VITE_WEBHOOK_URL at build time from .env / Cloudflare Pages env vars
    // Set VITE_WEBHOOK_URL in Cloudflare Pages → Settings → Environment Variables
  },
})
