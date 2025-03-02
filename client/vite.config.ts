import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1234',
        changeOrigin: true
      }
    },
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: ["roniseppala.com"]
  },
  build: {
    outDir: "/var/www/awp-project-frontend"
  },
})
