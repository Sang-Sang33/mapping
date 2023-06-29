import { ITenantItem } from '../tenant'

export interface IWarehouseItem {
  id: string
  name: string
}

export interface ICreateFcuWarehouseData {
  tenantId: ITenantItem['id']
  warehouseId: IWarehouseItem['id']
}

export interface IDeleteFcuWarehouseParams {
  tenantId: ITenantItem['id']
  warehouseIds: IWarehouseItem['id'][]
}
