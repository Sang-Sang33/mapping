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
      '/api/wcs': {
        target: 'http://dev.multiway-cloud.com:25001/',
        changeOrigin: true
      }
    }
  }
})
