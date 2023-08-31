import { FC } from 'react'
import RouterConfig from '@/router/index'
// import { useStore } from '@/store/index'
import { observer } from 'mobx-react-lite'

// 国际化配置
import { ConfigProvider } from 'antd'
import { getLanguage, lanDict } from '@/utils'
import { HashRouter } from 'react-router-dom'

const App: FC = () => {
 

  // moment.locale("zh-cn");
  const nowLan = getLanguage()

  return (
    <ConfigProvider locale={lanDict.antd[nowLan]}>
      <RouterConfig />
    </ConfigProvider>
  )
}

export default observer(App)
