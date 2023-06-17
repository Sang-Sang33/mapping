import { lazy } from 'react'
interface router {
  path?: string
  name: string
  component?: any
  children?: Array<router>
  icon?: string
  label?: string
  key?: string
}
export const preDefinedRoutes: Array<router> = [
  {
    path: '/wmsMission',
    name: 'wmsMission',
    key: 'wmsMission',
    label: 'aside.wmsMission.nav',
    component: lazy(() => import('@/pages/wmsMission/index'))
  },
  {
    path: '/rcsMission',
    name: 'rcsMission',
    key: 'rcsMission',
    label: 'aside.rcsMission.nav',
    component: lazy(() => import('@/pages/rcsMission/index'))
  },
  {
    path: '/logs',
    name: 'logs',
    key: 'logs',
    label: 'aside.logs.nav',
    component: lazy(() => import('@/pages/logs/index'))
  },
  {
    path: '/missionProcess',
    icon: 'wms-shebeijiankong',
    name: 'missionProcess',
    key: 'missionProcess',
    label: 'aside.missionProcess.nav',
    component: lazy(() => import('@/pages/missionProcess'))
  },
  {
    path: '/device',
    icon: 'wms-shebeijiankong',
    name: 'device',
    key: 'device',
    label: 'aside.device.nav',
    component: lazy(() => import('@/pages/device/index')),
    children: [
      {
        path: 'feature',
        icon: 'wms-shebeijiankong',
        name: 'feature',
        key: 'feature',
        label: 'aside.device.feature.nav',
        component: lazy(() => import('@/pages/device/c-pages/feature'))
      },
      {
        path: 'status',
        icon: 'wms-shebeijiankong',
        name: 'status',
        key: 'status',
        label: 'aside.device.status.nav',
        component: lazy(() => import('@/pages/device/c-pages/status'))
      }
    ]
  },
  {
    path: '/event',
    icon: 'wms-shebeijiankong',
    name: 'event',
    key: 'event',
    label: 'aside.event.nav',
    component: lazy(() => import('@/pages/event/index'))
  }
]

const routes: Array<router> = [
  {
    path: '/login',
    name: 'login',
    key: 'login',
    component: lazy(() => import('@/pages/login/index'))
  },
  {
    name: 'layout',
    key: 'layout',
    component: lazy(() => import('@/pages/layout/index')),
    children: [...preDefinedRoutes]
  },
  {
    path: '/loading',
    name: 'loading',
    key: 'loading',
    component: lazy(() => import('@packages/ui/components/loading'))
  },
  {
    path: '/gateway',
    name: 'gateway',
    key: 'gateway',
    component: lazy(() => import('@/pages/gateway/index'))
  },
  {
    path: '/403',
    name: '403',
    key: '403',
    component: lazy(() => import('@/components/ErrorPages/403'))
  },
  {
    path: '*',
    name: '404',
    key: '404',
    component: lazy(() => import('@packages/ui/components/404'))
  },
  {
    path: '/',
    name: 'redirect',
    component: lazy(() => import('@/pages/redirect/index'))
  }
]

export default routes
