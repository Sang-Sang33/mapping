import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { type TLayoutRoutes } from '@packages/types'

const Layout = lazy(() => import('../components/layout'))
const NotFound = lazy(() => import('@packages/ui/components/404/NotFound'))
const Configure = lazy(() => import('../pages/configure'))

const defineRoutes: TLayoutRoutes = [
  {
    path: 'configure',
    element: <Configure />,
    name: '配置',
    id: 'configure'
  }
]

const routes: TLayoutRoutes = [
  {
    path: '/',
    element: <Navigate to={'/configure'} />,
    name: '重定向',
    id: 'redirect'
  },
  {
    element: <Layout routes={defineRoutes} />,
    id: 'layout',
    name: '布局',
    children: defineRoutes
  },

  {
    path: '*',
    element: <NotFound />,
    name: '404',
    id: 'notfound'
  }
]

export default routes
