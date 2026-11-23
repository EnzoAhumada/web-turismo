import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/supabase-local': {
        target: 'http://127.0.0.1:54331',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-local/, ''),
      },
    },
  },
  preview: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/supabase-local': {
        target: 'http://127.0.0.1:54331',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-local/, ''),
      },
    },
  },
})
