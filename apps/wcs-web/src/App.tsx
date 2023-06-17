import { FC } from 'react'
import RouterConfig from '@/router/index'
import { useStore } from '@/store/index'
import { observer } from 'mobx-react-lite'

// 国际化配置
import { ConfigProvider } from 'antd'
import { getLanguage, lanDict } from './utils/token'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import 'moment/dist/locale/ja'

const App: FC = () => {
  const { configStore } = useStore()
  ConfigProvider.config({
    // ui主题配置
    theme: configStore.theme
  })

  // moment.locale("zh-cn");
  const nowLan = getLanguage()
  moment.locale(lanDict.moment[nowLan])

  return (
    <ConfigProvider locale={lanDict.antd[nowLan]}>
      <RouterConfig />
    </ConfigProvider>
  )
}

export default observer(App)
