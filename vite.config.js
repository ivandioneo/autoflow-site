import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  // VITE_WEBHOOK_URL is read from .env.local (never committed)
  // import.meta.env.VITE_WEBHOOK_URL is available in client code
})
