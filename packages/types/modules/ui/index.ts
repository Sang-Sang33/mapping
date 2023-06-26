import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

export type TLayoutRouteObject = RouteObject & {
  name: string
  id: string
  icon?: ReactNode
  order?: number
  children?: TLayoutRouteObject[]
}
export type TLayoutRoutes = TLayoutRouteObject[]
export type TLayoutPermission = TLayoutRouteObject['id'][]
