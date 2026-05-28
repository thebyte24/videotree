import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Raise the chunk warning threshold slightly — framer-motion is large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor libs into separate chunks for better caching
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react-router-dom') || id.includes('react-router')) return 'router'
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'vendor'
        },
      },
    },
  },

  // Ensure SPA routing works in preview mode
  preview: {
    port: 4173,
    strictPort: true,
  },

  server: {
    port: 5173,
    strictPort: false,
  },
})
