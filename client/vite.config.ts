import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://awa.roniseppala.com/api/',
        changeOrigin: true
      }
    },
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: ["roniseppala.com","awa.roniseppala.com"]
  },
  build: {
    outDir: "./dist/awp-project-frontend"
  },
})
