export interface IMenu {
  key: menuType
  label: string
  children?: IMenu[]
  meta?: {
    legend?: boolean // 是否显示在画布上显示legend
    pointsInsideRect?: boolean // 是否需要在画框时需要包含点在里面
  }
}

interface IRect {
  x: number
  y: number
  width: number
  height: number
}

interface ISelectedRect extends IRect {
  name: string
  type: menuType
  [prop: string]: any
}

type menuType =
  | 'all'
  | 'area'
  | 'tunnel'
  | 'location'
  | 'tier'
  | 'transferZones'
  | 'stagingPoints'
  | 'vehicleTypes'
  | 'transferLocation'
  | 'editWarehouse'
  | 'editTransfer'

interface IPoints {
  x: number
  y: number
}

interface shapeItem {
  id: string
  CADPosition: IPoints
  canvasPosition: IPoints
}

interface IEditedShapeItem extends shapeItem {
  [prop: string]: any
}

interface IExportItem {
  x: number
  y: number
  area: string
  tunnel: string
  row: string
  col: string
  deep: string
  layer: string
}

interface IRectMenu {
  x: number
  y: number
  show: boolean
  rectName: string
}
