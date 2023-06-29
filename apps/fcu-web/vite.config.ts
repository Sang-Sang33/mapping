import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    proxy: {
      '/api/fcu': {
        target: 'http://dev.multiway-cloud.com:25002',
        changeOrigin: true
      },
      '/api/mapping': {
        target: 'http://dev.multiway-cloud.com:25008',
        changeOrigin: true
      }
    }
  }
})
