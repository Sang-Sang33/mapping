import type { ReactNode } from 'react'
import type { TLayoutPermission, TLayoutRoutes } from '@packages/types'
import type { TLayoutAction } from './store'

export interface IHeaderNavProps {
  systemName?: string
  ssoUrl?: string
  headerToolBarRender?: (defaultDoms: {
    locale: ReactNode
    setting: ReactNode
    user: ReactNode
    appList: ReactNode
  }) => ReactNode[]
  appList?: { label: string; link: string }[]
}

export interface ILayoutProps {
  routes: TLayoutRoutes
  permission?: TLayoutPermission
  headerToolBarRender?: IHeaderNavProps['headerToolBarRender']
  systemName?: IHeaderNavProps['systemName']
  ssoUrl?: IHeaderNavProps['ssoUrl']
  appList?: IHeaderNavProps['appList']
  customLogoUrl?: string
  customMiniLogoUrl?: string
}
export interface ILayoutRef {
  updateLayoutContentKey: TLayoutAction['updateLayoutContentKey']
}
