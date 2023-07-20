import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@/styles/index.css'
import '@/styles/global.less'
import 'antd/dist/antd.variable.min.css'
// import '@/multiway'
import '@packages/multiway-config'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
