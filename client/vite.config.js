import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Change target backend URL here
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api':'http://localhost:5000', // Backend server
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  }
})
