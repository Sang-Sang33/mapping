import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
interface router {
  path?: string
  name: string
  component?: any
  children?: Array<router>
  icon?: string
  label?: string
  key?: string
}
export const preDefinedRoutes: Array<router> = []

const routes: Array<router> = [
  {
    path: '/',
    name: 'redirect',
    component: lazy(() => import('@/pages/redirect/index'))
  },
  {
    path: '/login',
    name: 'login',
    key: 'login',
    component: lazy(() => import('@/pages/login/index'))
  },

  {
    path: '/loading',
    name: 'loading',
    key: 'loading',
    component: lazy(() => import('@/components/loading/index'))
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
    component: lazy(() => import('@/pages/404'))
  }
]

export default routes
