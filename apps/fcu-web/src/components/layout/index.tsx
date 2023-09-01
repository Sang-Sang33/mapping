import { memo, useEffect, useRef } from 'react'
import type { ElementRef, FC } from 'react'
import { type ILayoutProps, Layout as UILayout } from '@packages/ui'
import { getTokenIC, redirectToSSO } from '@packages/utils'

const ssoUrl = import.meta.env.DEV ? 'http://byd.multiway-cloud.com:44307' : '/sso'
const Layout: FC<Pick<ILayoutProps, 'routes' | 'permission'>> = (props) => {
  const { routes, permission } = props
  const uiLayoutRef = useRef<ElementRef<typeof UILayout>>(null)

  // 没有token,跳转到单点登录
  useEffect(() => {
    if (!getTokenIC()) redirectToSSO(ssoUrl)
  }, [])

  return (
    <UILayout
      ref={uiLayoutRef}
      systemName="FCU"
      routes={routes}
      permission={permission}
      headerToolBarRender={({ setting, user, appList }) => [setting, user, appList]}
      ssoUrl={ssoUrl}
      customLogoUrl={import.meta.env.DEV ? '/shared/logo_origin.png' : '/wcs-web/shared/logo_origin.png'}
      customMiniLogoUrl={import.meta.env.DEV ? '/shared/logo_mini.png' : '/wcs-web/shared/logo_mini.png'}
      appList={window.__APP_LIST__}
    />
  )
}

export default memo(Layout)
