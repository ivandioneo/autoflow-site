import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    // No source maps in production — prevents reverse-engineering of business logic
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Isolate Three.js (~600KB) into its own lazy-loaded chunk
          // so it never blocks initial paint
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
