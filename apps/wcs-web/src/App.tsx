import { FC } from 'react'
import RouterConfig from '@/router/index'
import { useStore } from '@/store/index'
import { observer } from 'mobx-react-lite'

// 国际化配置
import { ConfigProvider } from 'antd'
import { getLanguage, lanDict } from './utils/token'
import { HashRouter } from 'react-router-dom'

const App: FC = () => {
  const { configStore } = useStore()
  ConfigProvider.config({
    // ui主题配置
    theme: configStore.theme
  })

  // moment.locale("zh-cn");
  const nowLan = getLanguage()

  return (
    <ConfigProvider locale={lanDict.antd[nowLan]}>
      <HashRouter>
        <RouterConfig />
      </HashRouter>
    </ConfigProvider>
  )
}

export default observer(App)
