import MWRequest from '../../../../request'
import type { ITenantItem } from '../tenant'
import type { IWarehouseItem } from './typings'

const useMappingWarehouseRequest = (mwRequest: MWRequest) => {
  const { get } = mwRequest

  const getWarehouseList = async () => get<IWarehouseItem[]>('/warehouse') // 根据当前已经登录或者选择的租户获取仓库列表(租户id在cookie里已经设置时用这个接口)
  const getWarehouseListByTenantId = async (tenantId: ITenantItem['id']) =>
    get<IWarehouseItem[]>('/warehouse/warehouses/' + tenantId)

  return {
    getWarehouseList,
    getWarehouseListByTenantId
  }
}

export * from './typings'
export default useMappingWarehouseRequest
