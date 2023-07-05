import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { wrapperEnv } from './src/utils/getEnv'
import { createHtmlPlugin } from 'vite-plugin-html'
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
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#13c2c2',
            '@layout-header-background': '#1A1C25',
            '@layout-body-background': '#12151A'
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': pathResolve('./src')
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
      host: '0.0.0.0',
      open: viteEnv.VITE_OPEN,
      port: 4200, // 本地端口号
      proxy: {
        // 请求代理地址(仅开发环境有效)
        '/api': {
          // target: 'http://192.168.2.111:44306/',
          target: 'http://www.dev.multiway-cloud.com:25008/api',
          changeOrigin: true,
          secure: true, // 如果是https接口，需要配置这个参数
          // ws: true, //websocket支持
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/user': {
          target: 'http://www.dev.multiway-cloud.com:25007/',
          changeOrigin: true,
          secure: true, // 如果是https接口，需要配置这个参数
          // ws: true, //websocket支持
          rewrite: (path) => path.replace(/^\/user/, '')
        }
      }
    },
    build: {
      outDir: '../../dist/mapping-web',
      minify: 'terser',
      terserOptions: {
        // delete console/debugger
        compress: {
          drop_console: viteEnv.VITE_DROP_CONSOLE,
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
