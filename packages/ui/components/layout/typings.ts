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
}

export interface ILayoutProps {
  routes: TLayoutRoutes
  permission?: TLayoutPermission
  headerToolBarRender?: IHeaderNavProps['headerToolBarRender']
  systemName?: IHeaderNavProps['systemName']
  ssoUrl?: IHeaderNavProps['ssoUrl']
}
export interface ILayoutRef {
  updateLayoutContentKey: TLayoutAction['updateLayoutContentKey']
}
