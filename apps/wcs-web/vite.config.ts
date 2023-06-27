import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { wrapperEnv } from './src/utils/getEnv'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression' // 开启压缩

import { resolve } from 'path'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
  const env = loadEnv(mode.mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  const base = mode.mode === 'production' ? './' : '/'
  return {
    base, // 配置打包静态文件输出路径
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            title: viteEnv.VITE_GLOB_APP_TITLE
          }
        }
      }),
      viteCompression({
        //生成压缩包gz
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      alias: [
        { find: /^~/, replacement: '' },
        { find: '@', replacement: pathResolve('./src') },
        {
          find: '@components',
          replacement: pathResolve('./src/components')
        }
      ],
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
      host: '0.0.0.0',
      open: viteEnv.VITE_OPEN,
      port: viteEnv.VITE_PORT, // 本地端口号
      proxy: {
        '/api/wcs': {
          target: 'http://dev.multiway-cloud.com:25001/',
          changeOrigin: true
          // secure: true, // 如果是https接口，需要配置这个参数
          // rewrite: (path) => path.replace(/^\/sso/, '')
        },
        // // 请求代理地址(仅开发环境有效)
        '/api/mapping': {
          target: 'http://dev.multiway-cloud.com:25008/',
          changeOrigin: true,
          secure: true // 如果是https接口，需要配置这个参数
          // ws: true, //websocket支持
          // rewrite: path => path.replace(/^\/api/, "")
        }
      },
      hmr: {
        overlay: false
      }
    },
    build: {
      // outDir: '../../dist/wcs-web',
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        // delete console/debugger
        compress: {
          drop_console: true || viteEnv.VITE_DROP_CONSOLE,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
})
