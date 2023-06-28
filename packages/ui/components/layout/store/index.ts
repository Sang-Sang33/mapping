import { create } from 'zustand'
import { useStorage } from '@packages/hooks'
import { generateUUID } from '@packages/utils'
import { TLayoutRoutes } from '@packages/types'

export type TTheme = 'dark' | 'light'

export type TLayoutState = {
  collapsed: boolean
  theme: TTheme
  primaryColor: string
  layoutContentKey: string | number
  permissionRoutes: TLayoutRoutes
  routeIdPath: string[]
}

export type TLayoutAction = {
  updateCollapsed: (collapsed: TLayoutState['collapsed']) => void
  updateTheme: (theme: TLayoutState['theme']) => void
  updatePrimaryColor: (primaryColor: TLayoutState['primaryColor']) => void
  updateLayoutContentKey: () => void
  updatePermissionRoutes: (permissionRoutes: TLayoutState['permissionRoutes']) => void
  updateRouteIdPath: (routeIdPath: TLayoutState['routeIdPath']) => void
}

const useLayoutStore = create<TLayoutState & TLayoutAction>((set) => {
  const { getItem, setItem } = useStorage()

  return {
    collapsed: getItem('COLLAPSED'),
    theme: getItem('THEME') ?? 'dark',
    primaryColor: getItem('PRIMARY_COLOR') ?? '#13C2C2',
    layoutContentKey: generateUUID(),
    permissionRoutes: [],
    routeIdPath: [],
    updateCollapsed: (collapsed) => {
      set(() => ({ collapsed }))
      setItem('COLLAPSED', collapsed)
    },
    updateTheme: (theme) => {
      set(() => ({ theme }))
      setItem('THEME', theme)
    },
    updatePrimaryColor: (primaryColor) => {
      set(() => ({ primaryColor }))
      setItem('PRIMARY_COLOR', primaryColor)
    },
    updateLayoutContentKey: () => set(() => ({ layoutContentKey: generateUUID() })),
    updatePermissionRoutes: (permissionRoutes) => set({ permissionRoutes }),
    updateRouteIdPath: (routeIdPath) => set({ routeIdPath })
  }
})

export default useLayoutStore
