import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { type TLayoutRoutes } from '@packages/types'
import { Layout } from '@packages/ui'

const Home = lazy(() => import('../pages/home'))
const NotFound = lazy(() => import('@packages/ui/components/404/NotFound'))
const Wcs = lazy(() => import('../pages/wcs'))

const permission = ['home', 'sys']
const defineRoutes: TLayoutRoutes = [
  {
    path: '/home',
    element: <Home />,
    name: '首页',
    id: 'home'
  },
  {
    path: '/sys',
    name: '系统',
    id: 'sys',
    children: [
      {
        path: 'wcs',
        name: 'WCS',
        id: 'wcs',
        element: <Wcs />
      }
    ]
  }
]

const routes: TLayoutRoutes = [
  {
    path: '/',
    element: <Navigate to={'/home'} />,
    name: '重定向',
    id: 'redirect'
  },
  {
    element: <Layout permission={permission} routes={defineRoutes} />,
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
