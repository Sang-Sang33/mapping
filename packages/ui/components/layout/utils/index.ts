import type { MenuProps } from 'antd'
import type { TLayoutRoutes, TLayoutPermission, TLayoutRouteObject } from '@packages/types'

/**
 * @description: 根据权限点获取路由
 * @param {TLayoutPermission} permission
 * @param {TLayoutRoutes} defineRoutes
 * @return {*}
 */
export const mapPermissionToRoutes = (permission: TLayoutPermission, defineRoutes: TLayoutRoutes) => {
  const permittedRoutes: TLayoutRoutes = []

  const filterRoutes = (permission: TLayoutPermission, routes: TLayoutRoutes, root: TLayoutRoutes) => {
    routes.forEach((route) => {
      if (permission.includes(route.id)) {
        const permittedRoute = { ...route, children: [] } as TLayoutRouteObject
        root.push(permittedRoute)
        if (route.children?.length) filterRoutes(permission, route.children, permittedRoute.children || [])
      }
    })
  }

  filterRoutes(permission, defineRoutes, permittedRoutes)

  return permittedRoutes
}

/**
 * @description: 根据路由获取菜单信息
 * @param {TLayoutRoutes} routes
 * @return {*}
 */
export const mapRoutesToMenu = (routes: TLayoutRoutes) => {
  const getMenus: (routes: TLayoutRoutes) => MenuProps['items'] = (routes) =>
    routes.map((route) => ({
      key: route.id,
      icon: route.icon,
      label: route.name,
      path: route.path,
      children: route.children?.length ? getMenus(route.children) : null
    }))

  return getMenus(routes)
}

/**
 * @description:  根据route的id获取对应route
 * @param {TLayoutRoutes} routes
 * @param {TLayoutRouteObject} id
 * @return {*}
 */
export const getRouteById = (routes: TLayoutRoutes, id: TLayoutRouteObject['id']): TLayoutRouteObject | null => {
  for (const route of routes) {
    if (route.id === id) {
      return route
    }

    if (route.children) {
      const childRoute = getRouteById(route.children, id)
      if (childRoute) return childRoute
    }
  }
  return null
}

export const getRouteByPathname = (
  routes: TLayoutRoutes,
  path: TLayoutRouteObject['path']
): TLayoutRouteObject | null => {
  for (const route of routes) {
    if (path?.includes(route.path!)) {
      return route
    }

    if (route.children) {
      const childRoute = getRouteByPathname(route.children, path)
      if (childRoute) return childRoute
    }
  }
  return null
}

/**
 * @description: 根据id获取对应的路由和所有父级路由的key组成的数组
 * @return {*}
 */
export const getRouteIdPath = (routes: TLayoutRoutes, id: TLayoutRouteObject['id']): TLayoutRouteObject['id'][] => {
  for (const route of routes) {
    if (route.id === id) {
      return [route.id]
    }

    if (route.children) {
      const childIds = getRouteIdPath(route.children, id)
      if (childIds.length > 0) {
        return [route.id, ...childIds]
      }
    }
  }

  return []
}
