import type { ReactNode } from 'react'
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'

export interface ILayoutData {
  name: string
  id: string
  icon?: ReactNode
  order?: number
}

export interface ILayoutIndexRouteObject extends ILayoutData, Omit<IndexRouteObject, 'children' | 'id'> {
  children?: undefined
}
export interface ILayoutNonIndexRouteObject extends ILayoutData, Omit<NonIndexRouteObject, 'children' | 'id'> {
  children?: ILayoutNonIndexRouteObject[]
}

export type TLayoutRouteObject = ILayoutIndexRouteObject | ILayoutNonIndexRouteObject
export type TLayoutRoutes = ILayoutIndexRouteObject[] | ILayoutNonIndexRouteObject[]
export type TLayoutPermission = TLayoutRouteObject['id'][]
