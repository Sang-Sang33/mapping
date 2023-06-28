import type { ReactNode } from 'react'
import type { TLayoutPermission, TLayoutRoutes } from '@packages/types'
import type { TLayoutAction } from './store'

export interface IHeaderNavProps {
  headerToolBarRender?: (defaultDoms: { locale: ReactNode; setting: ReactNode; user: ReactNode }) => ReactNode[]
}

export interface ILayoutProps {
  routes: TLayoutRoutes
  permission?: TLayoutPermission
  headerToolBarRender?: IHeaderNavProps['headerToolBarRender']
}
export interface ILayoutRef {
  updateLayoutContentKey: TLayoutAction['updateLayoutContentKey']
}
