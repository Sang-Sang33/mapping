import { defineConfig } from '@umijs/max';

export default defineConfig({
  publicPath: '/fcu-web/',
  outputPath: '../../dist/fcu-web',
  history: { type: 'hash' },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '',
  },
  routes: [
    {
      path: '/',
      redirect: '/configure',
    },
    {
      name: '配置',
      path: '/configure',
      component: './Configure',
    },
  ],
  npmClient: 'pnpm',
  define: {
    __APP_API_MAP__: {
      MAPPING_API: '',
      FCU_API: '',
    },
  },
  scripts: [
    {
      src: './global.js',
    },
  ],
  proxy: {
    '/api/fcu': {
      target: 'http://dev.multiway-cloud.com:25002',
      changeOrigin: true,
    },
    '/api/mapping': {
      target: 'http://dev.multiway-cloud.com:25008',
      changeOrigin: true,
    },
  },
  plugins: [],
});
