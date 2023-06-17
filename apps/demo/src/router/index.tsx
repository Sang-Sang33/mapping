import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Home = lazy(() => import('../pages/home'))
const NotFound = lazy(() => import('@packages/ui/components/404'))
const Wcs = lazy(() => import('../pages/wcs'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={'/home'} />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/wcs',
    element: <Wcs />
  },
  {
    path: '/404',
    element: <NotFound />
  }
]

export default routes
