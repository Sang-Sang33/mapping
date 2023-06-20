import type { IMenu, IRect, IRectMenu, ISelectedRect, menuType, shapeItem } from '@/types'
import { computed, makeAutoObservable } from 'mobx'

export const editColor = {
  area: 'red',
  tunnel: 'yellow',
  location: 'blue',
  tier: 'orange',
  stagingPoints: 'pink',
  transferZones: 'blue',
  transferLocation: 'purple'
}

export const headerHeight = 64
// 库位编辑
// 接驳编辑
export const menuConfig: IMenu[] = [
  {
    key: 'all',
    label: '总览',
    meta: {
      legend: false
    }
  },
  {
    key: 'editWarehouse',
    label: '库位编辑',
    meta: {
      legend: false
    },
    children: [
      // {
      //   key: 'area',
      //   label: '区域'
      // },
      // {
      //   key: 'tunnel',
      //   label: '巷道'
      // },
      {
        key: 'location',
        label: '排列深',
        meta: {
          pointsInsideRect: true
        }
      },
      {
        key: 'tier',
        label: '层',
        meta: {
          pointsInsideRect: true
        }
      },
      {
        key: 'stagingPoints',
        label: '待命点',
        meta: {
          pointsInsideRect: true
        }
      }
    ]
  },
  {
    key: 'editTransfer',
    label: '接驳编辑',
    meta: {
      legend: false
    },
    children: [
      {
        key: 'transferZones',
        label: '接驳区',
        meta: {
          pointsInsideRect: true
        }
      },
      {
        key: 'transferLocation',
        label: '接驳位',
        meta: {
          pointsInsideRect: true
        }
      }
    ]
  },

  {
    key: 'area',
    label: '区域',
    meta: {
      pointsInsideRect: true
    }
  },
  {
    key: 'tunnel',
    label: '巷道',
    meta: {
      legend: false,
      pointsInsideRect: false
    }
  }
]

class EditorStore {
  constructor() {
    makeAutoObservable(this, {
      rectListInRcs: computed,
      shapesList: computed,
      currentMenu: computed
    })
  }
  drawerOpen = false
  checkedMenu: menuType = 'area'
  menuConfig = menuConfig
  get currentMenu() {
    return this.menuConfig
      .flatMap((menu: IMenu) => menu.children || [])
      .concat(menuConfig)
      .find((item) => item.key === this.checkedMenu)
  }
  editColor = editColor
  selectRect: IRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
  // shapesList: shapeItem[] = []
  get shapesList() {
    if (!Object.keys(this.rcsData).length) return []
    const {
      Border: { DownLeft, UpRight },
      Points
    } = this.rcsData
    const CADWidth = Math.abs(UpRight.X - DownLeft.X)
    const CADHeight = Math.abs(DownLeft.Y - UpRight.Y)
    const resPoints: shapeItem[] = Points.map((item: any) => ({
      id: item.Id || item.ID,
      CADPosition: {
        x: Math.abs(item.Position.X - DownLeft.X),
        y: Math.abs(item.Position.Y - UpRight.Y)
      },
      canvasPosition: {
        x: Math.abs(item.Position.X - Math.min(DownLeft.X, UpRight.X)) * (this.stageWidth / CADWidth),
        y: Math.abs(item.Position.Y - Math.min(UpRight.Y, DownLeft.X)) * (this.stageHeight / CADHeight)
      }
    }))

    return resPoints
  }
  rcsData: Record<string, any> = {}
  selectedRectList: ISelectedRect[] = []
  get rectListInRcs() {
    const { selectedRectList, rcsData, stageWidth, stageHeight } = this

    if (!Object.keys(rcsData).length) return []
    const {
      Border: { DownLeft, UpRight }
    } = rcsData
    return selectedRectList.map((rect) => {
      const CADWidth = Math.abs(UpRight.X - DownLeft.X)
      const CADHeight = Math.abs(DownLeft.Y - UpRight.Y)
      return {
        ...rect,
        x: (rect.x * CADWidth) / stageWidth + Math.min(DownLeft.X, UpRight.X),
        y: (rect.y * CADHeight) / stageHeight + Math.min(UpRight.Y, DownLeft.Y),
        width: (rect.width * CADWidth) / stageWidth,
        height: (rect.height * CADHeight) / stageHeight
      }
    })
  }
  rectMenuParams: IRectMenu = {
    x: 0,
    y: 0,
    show: false,
    rectName: ''
  }
  headerHeight = headerHeight
  stageWidth = window.innerWidth
  stageHeight = window.innerHeight - headerHeight
  // stageWidth = 1920 // 暂时写死, 防止在不同尺寸时计算位置有差导致显示比例不正确
  // stageHeight = 880
  isHost: boolean = localStorage.getItem('isHost') === 'true'
  tenantId: string | undefined = undefined
  warehouseId: string | undefined = undefined
  editWarehouseShow: boolean = false
  editingRectName: string | undefined = undefined
  setStageSize(width: number, height: number) {
    // debugger
    this.stageWidth = width
    this.stageHeight = height
  }
  changeMenu(val: menuType) {
    this.checkedMenu = val
  }
  setDrawerOpen(val: boolean) {
    this.drawerOpen = val
  }
  changeSelectRect(val: IRect) {
    this.selectRect = val
  }
  pushSelectedRect(val: ISelectedRect) {
    this.selectedRectList = [...this.selectedRectList, val]
  }
  removeSelectedRect(name: string) {
    this.selectedRectList = this.selectedRectList.filter((item) => item.name !== name)
  }
  clearSelectRect() {
    this.selectedRectList = []
  }
  replaceSelectRect(val: ISelectedRect[]) {
    this.selectedRectList = [...val]
  }
  // setShapesList(list: shapeItem[]) {
  //   this.shapesList = list
  // }
  setRcsData(data: Record<string, any>) {
    this.rcsData = data
  }
  initRectMenuParams() {
    this.rectMenuParams = {
      x: 0,
      y: 0,
      show: false,
      rectName: ''
    }
  }
  setRectMenuParams(val: IRectMenu) {
    this.rectMenuParams = val
  }
  setIsHost(val: boolean) {
    this.isHost = val
    localStorage.setItem('isHost', String(val))
  }
  setTenantId(val: string) {
    this.tenantId = val
    localStorage.setItem('tenantId', val)
  }
  setWarehouseId(val: string | undefined) {
    this.warehouseId = val || undefined
    localStorage.setItem('warehouseId', val || '')
  }
  clearUserInfo() {
    this.isHost = false
    this.tenantId = undefined
    this.warehouseId = undefined
    localStorage.removeItem('isHost')
    localStorage.removeItem('tenantId')
    localStorage.removeItem('warehouseId')
  }
  setEditWarehouseShow(val: boolean) {
    this.editWarehouseShow = val
  }
  setEditingRectName(val: string | undefined) {
    this.editingRectName = val
  }
}

export default new EditorStore()
