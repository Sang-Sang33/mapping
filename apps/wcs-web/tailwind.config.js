/** @type {import('tailwindcss').Config} */
import { uiTailwindConfig } from '@packages/tailwind-config'
module.exports = {
  presets: [uiTailwindConfig],
  content: [
    ...uiTailwindConfig.content, // content 配置会替换 https://www.tailwindcss.cn/docs/presets#merging-logic-in-depth
    './index.html',
    './src/**/*.{ts,tsx}' // 用到tailwind的地方
  ],
  theme: {
    height: {
      '10px': '10px',
      '95px': '95px',
      '400px': '400px',
      20: '20rem',
      5: '5rem',
      full: '100%'
    },
    extend: {},
    boxShadow: {
      box: '0 1px 4px rgb(0 21 41 / 8%)'
    }
  },
  plugins: [],
  corePlugins: { preflight: false }
}
