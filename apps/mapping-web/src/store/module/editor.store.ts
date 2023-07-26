import type { IMenu, IRect, IRectMenu, ISelectedRect, menuType, shapeItem, IEditedShapeItem } from '@/types'
import { computed, makeAutoObservable } from 'mobx'
import { message } from 'antd'
import { isPointInRect } from '../../utils'

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
      currentMenu: computed,
      genSaveData: computed
    })
  }
  drawerOpen = false
  checkedMenu: menuType = 'all'
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
  get rcsTransformedData() {
    if (!Object.keys(this.rcsData).length) return null
    if ((!this.rcsData.MapOption || !this.rcsData.Vertexs) && (!this.rcsData.Border || !this.rcsData.Points)) return message.error('文件格式不正确！')
    if (this.rcsData.Border) {
      const {
        Border: { DownLeft, UpRight },
        Points
      } = this.rcsData
      const points = Points.map((item) => ({ ...item, ...item.Position }))
      return { minX: DownLeft.X, minY: DownLeft.Y, maxX: UpRight.X, maxY: UpRight.Y, points }
    } else {
      const { MapOption: { DWGMinX, DWGMaxX, DWGMinY, DWGMaxY }, Vertexs } = this.rcsData
      return { minX: DWGMinX, minY: DWGMinY, maxX: DWGMaxX, maxY: DWGMaxY, points: Vertexs }
    }
  }
  get layoutData() {
    if (!this.rcsTransformedData) return null
    const { minX, minY, maxX, maxY } = this.rcsTransformedData
    const { stageWidth, stageHeight } = this
    const CADWidth = maxX - minX
    const CADHeight = maxY - minY
    const CADToCanvasRatio = Math.min(stageWidth / CADWidth, stageHeight / CADHeight)
    return { CADWidth, CADHeight, CADToCanvasRatio }
  }
  get shapesList() {
    if (!this.rcsTransformedData) return []
    const { minX, minY, points } = this.rcsTransformedData
    const { CADToCanvasRatio = 1 } = this.layoutData || {}
    const resPoints: shapeItem[] = points.map((item: any) => ({
      id: item.Id || item.ID,
      CADPosition: {
        x: item.X,
        y: item.Y
      },
      canvasPosition: {
        x: Math.abs(item.X - minX) * CADToCanvasRatio,
        y: Math.abs(item.Y - minY) * CADToCanvasRatio
      }
    }))
    return resPoints
  }
  rcsData: Record<string, any> = {}
  selectedRectList: ISelectedRect[] = []
  get rectListInRcs() {
    const { selectedRectList } = this
    if (!this.rcsTransformedData) return []
    const { CADToCanvasRatio = 1 } = this.layoutData || {}
    return selectedRectList.map((rect) => {
      return {
        ...rect,
        x: rect.x * CADToCanvasRatio,
        y: rect.y * CADToCanvasRatio,
        width: rect.width * CADToCanvasRatio,
        height: rect.height * CADToCanvasRatio
      }
    })
  }
  get genSaveData() {
    const shapesMap: Record<string, IEditedShapeItem> = {}
    const locationRectShapes: Record<string, Record<'rect' | 'shapes', ISelectedRect | shapeItem[]>> = {}
    this.rectListInRcs.forEach((rect) => {
      this.shapesList.forEach((shape) => {
        if (!isPointInRect(rect, shape.canvasPosition)) return
        if (rect.type === 'location') {
          !locationRectShapes[rect.name] &&
            (locationRectShapes[rect.name] = {
              rect,
              shapes: []
            })
          locationRectShapes[rect.name].shapes.push(shape)
        }
        const temp = shapesMap[shape.id] || shape
        if (rect.type === 'area') {
          shapesMap[shape.id] = { ...temp, areaNumber: rect.areaNumber }
        } else if (rect.type === 'tunnel') {
          shapesMap[shape.id] = { ...temp, tunnelNumber: rect.tunnelNumber }
        } else if (rect.type === 'tier') {
          shapesMap[shape.id] = { ...temp, tierNumber: rect.tierNumber, highList: rect.highList, lowList: rect.lowList }
        } else if (rect.type === 'transferZones') {
          if (!temp.transferZones) temp.transferZones = []
          shapesMap[shape.id] = { ...temp, transferZones: [...temp.transferZones, rect.transferZonesNumber] }
        } else if (rect.type === 'stagingPoints') {
          shapesMap[shape.id] = { ...temp, stagingPoints: rect.stagingPointsList }
        } else if (rect.type === 'location') {
          shapesMap[shape.id] = { ...temp, vehicleTypes: rect.vehicleTypes }
        } else if (rect.type === 'transferLocation') {
          shapesMap[shape.id] = { ...temp, vehicleTypePairs: rect.vehicleTypePairs }
        }
      })
    })
    Object.values(locationRectShapes).forEach(({ rect, shapes }) => {
      const { rowNumber, start, direction } = rect as ISelectedRect
      const list: Record<number, shapeItem[]> = {}
      shapes.forEach((shape: shapeItem) => {
        !list[shape.CADPosition.y] && (list[shape.CADPosition.y] = [])
        list[shape.CADPosition.y].push(shape)
      })
      Object.values(list).forEach((arr) => {
        arr.sort((a: shapeItem, b: shapeItem) => {
          if (start === 'rightTop' || start === 'rightBottom') {
            return b.CADPosition.x - a.CADPosition.x
          } else {
            return a.CADPosition.x - b.CADPosition.x
          }
        })
      })
      const arr = Object.entries(list)
      if (start === 'leftBottom' || start === 'rightBottom') arr.sort((a, b) => +b[0] - +a[0])
      // colIndex 列索引，deepIndex 深索引
      let colIndex = 1,
        deepIndex = 1
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i][1].length; j++) {
          shapesMap[arr[i][1][j].id] = {
            ...shapesMap[arr[i][1][j].id],
            colNumber: colIndex,
            deepNumber: deepIndex,
            rowNumber
          }
          direction === 'row' ? deepIndex++ : colIndex++
        }
        if (direction === 'row') {
          colIndex++
          deepIndex = 1
        } else {
          deepIndex++
          colIndex = 1
        }
      }
    })
    const positions: any[] = []
    const slots: any[] = []
    Object.values(shapesMap).forEach((shape) => {
      const {
        id,
        areaNumber,
        tunnelNumber,
        tierNumber = 1,
        colNumber,
        deepNumber,
        rowNumber,
        highList = [],
        lowList = [],
        transferZones,
        stagingPoints,
        vehicleTypes = [],
        vehicleTypePairs
      } = shape
      const vehicleTypesList = [...vehicleTypes].map((item) => item)
      console.log('tierNumber', tierNumber)
      for (let i = 1; i <= tierNumber; i++) {
        const name = `${areaNumber}-${tunnelNumber}-${rowNumber}-${colNumber}-${i}-${deepNumber}`
        const item = {
          name,
          puDoPoint: id + '',
          forkArm: {
            liftHeight: +highList[i - 1] || 0,
            declineHeight: +lowList[i - 1] || 0
          },
          stagingPoints,
          transferZones,
          vehicleTypes: vehicleTypesList
        }
        slots.push(item)
        if (vehicleTypePairs) {
          const pos = {
            point: name,
            transferZones,
            vehicleTypes: vehicleTypePairs.map((item) => item.split(/-/))
          }
          positions.push(pos)
        }
      }
    })
    return { positions, slots }
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
  backgroundImage: string | undefined = undefined
  setBackgroundImage(val: string) {
    this.backgroundImage = val
  }
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
    const { x, y, width, height } = val
    const { CADToCanvasRatio = 1 } = this.layoutData || {}
    this.selectedRectList = [...this.selectedRectList, { ...val, x: x / CADToCanvasRatio, y: y / CADToCanvasRatio, width: width / CADToCanvasRatio, height: height / CADToCanvasRatio }]
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
