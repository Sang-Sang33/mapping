import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { type TLayoutRoutes } from '@packages/types'
import { Layout } from '@packages/ui'

const Home = lazy(() => import('../pages/home'))
const NotFound = lazy(() => import('@packages/ui/components/404/NotFound'))
const Wcs = lazy(() => import('../pages/wcs'))

const permission = ['home', 'sys', 'wcs', 'device', 'status', 'feature']
const defineRoutes: TLayoutRoutes = [
  {
    path: 'home',
    element: <Home />,
    name: '首页',
    id: 'home'
  },
  {
    path: 'sys',
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
  },
  {
    path: 'device',
    name: '设备',
    id: 'device',
    children: [
      {
        path: 'status',
        name: '状态',
        id: 'status',
        element: <Wcs />
      },
      {
        path: 'feature',
        name: '功能',
        id: 'feature',
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
