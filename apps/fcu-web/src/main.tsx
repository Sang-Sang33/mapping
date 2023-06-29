import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// import '@packages/i18n'
import 'antd/dist/antd.variable.min.css'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <ConfigProvider locale={zhCN}>
    <HashRouter>
      <App />
    </HashRouter>
  </ConfigProvider>

  // </React.StrictMode>
)
