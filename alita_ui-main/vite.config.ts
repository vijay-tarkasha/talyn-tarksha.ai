import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://alita-core-api.onrender.com",
        secure: false,
        changeOrigin: true,
        ws:true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    },
    open: true,
    port: 3000,
    host: "0.0.0.0"
  }
})
