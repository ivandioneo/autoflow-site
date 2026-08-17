import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Expose VITE_WEBHOOK_URL at build time.
    // Set this in Cloudflare Pages → Settings → Environment Variables.
    // Never commit the actual URL.
    'import.meta.env.VITE_WEBHOOK_URL': JSON.stringify(process.env.VITE_WEBHOOK_URL || ''),
  },
})
