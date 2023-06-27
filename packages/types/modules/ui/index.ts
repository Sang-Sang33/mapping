import type { ReactNode } from 'react'
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'

export interface ILayoutData {
  name: string
  id: string
  icon?: ReactNode
  order?: number
}

export interface ILayoutIndexRouteObject extends ILayoutData, Omit<IndexRouteObject, 'children' | 'id' | 'index'> {
  children?: undefined
}
export interface ILayoutNonIndexRouteObject
  extends ILayoutData,
    Omit<NonIndexRouteObject, 'children' | 'id' | 'index'> {
  children?: ILayoutNonIndexRouteObject[]
}

export type TLayoutRouteObject = ILayoutIndexRouteObject | ILayoutNonIndexRouteObject
export type TLayoutRoutes = TLayoutRouteObject[]
export type TLayoutPermission = TLayoutRouteObject['id'][]
