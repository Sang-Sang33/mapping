import { useMemo } from 'react'
import { useLocation, type RouteObject } from 'react-router-dom'
import type { TLayoutRoutes, TLayoutRouteObject } from '@packages/types'

const useRoute = (routes: TLayoutRoutes) => {
  const location = useLocation()

  const findRoute = (routes: TLayoutRoutes, pathname: Required<RouteObject>['path']): TLayoutRouteObject | null => {
    for (const route of routes) {
      const pathnameKeys = pathname.split('/').filter(Boolean)
      const currentRoutePathnameKeys = route.path!.split('/').filter(Boolean)
      if (route.path === pathname && pathnameKeys.length === currentRoutePathnameKeys.length) {
        return route
      } else if (route.children) {
        const childRoute = findRoute(route.children, pathname)
        if (childRoute) {
          return childRoute
        }
      }
    }
    return null
  }

  const currentRoute = useMemo(() => findRoute(routes, location.pathname), [location])

  return currentRoute
}

export default useRoute
