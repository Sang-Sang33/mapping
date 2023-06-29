import MWRequest from '../../../../request'
import type { ITenantItem } from '../tenant'
import type { ICreateFcuWarehouseData, IDeleteFcuWarehouseParams, IWarehouseItem } from './typings'

const useFcuWarehouseRequest = (mwRequest: MWRequest) => {
  const { get, post, del } = mwRequest

  const getFcuWarehouseIdList = async (tenantId: ITenantItem['id']) =>
    get<IWarehouseItem['id'][]>('/warehouse', { tenantId })

  const createFcuWarehouse = async (data: ICreateFcuWarehouseData) => post<IWarehouseItem[]>('/warehouse', data)

  const deleteFcuWarehouse = async ({ tenantId, warehouseIds }: IDeleteFcuWarehouseParams) => {
    const queryString = warehouseIds.map((id) => `warehouseIds=${id}`).join('&') + `&tenantId=${tenantId}`
    return del('/warehouse' + `?${queryString}`)
  }

  return {
    getFcuWarehouseIdList,
    createFcuWarehouse,
    deleteFcuWarehouse
  }
}

export * from './typings'
export default useFcuWarehouseRequest
