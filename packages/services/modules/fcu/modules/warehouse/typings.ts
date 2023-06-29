import { IFcuTenantItem } from '../tenant'

export interface IFcuWarehouseItem {
  id: string
  name: string
}

export interface ICreateFcuWarehouseData {
  tenantId: IFcuTenantItem['id']
  warehouseId: IFcuWarehouseItem['id']
}

export interface IDeleteFcuWarehouseParams {
  tenantId: IFcuTenantItem['id']
  warehouseIds: IFcuWarehouseItem['id'][]
}
