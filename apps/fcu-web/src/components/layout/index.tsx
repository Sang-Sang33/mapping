import { memo, useEffect, useRef } from 'react'
import type { ElementRef, FC } from 'react'
import { type ILayoutProps, Layout as UILayout } from '@packages/ui'
import { getTokenIC, redirectToSSO } from '@packages/utils'

const Layout: FC<Pick<ILayoutProps, 'routes' | 'permission'>> = (props) => {
  const { routes, permission } = props
  const uiLayoutRef = useRef<ElementRef<typeof UILayout>>(null)

  // 没有token,跳转到单点登录
  useEffect(() => {
    if (!getTokenIC()) redirectToSSO()
  }, [])

  return (
    <UILayout
      ref={uiLayoutRef}
      systemName="FCU"
      routes={routes}
      permission={permission}
      headerToolBarRender={({ setting, user }) => [setting, user]}
    />
  )
}

export default memo(Layout)
