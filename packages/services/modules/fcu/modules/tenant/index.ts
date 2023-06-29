import MWRequest from '../../../../request'
import type { ICreateFcuTenantData, IFcuTenantItem, TDeleteFcuTenantIds } from './typings'

const useFcuTenantRequest = (mwRequest: MWRequest) => {
  const { get, post, del } = mwRequest

  const getFcuTenantIdList = async () => get<IFcuTenantItem['id'][]>('/tenant')
  const createFcuTenant = async (data: ICreateFcuTenantData) => post('/tenant', data)
  const deleteFcuTenant = async (tenantIds: TDeleteFcuTenantIds) => {
    const queryString = tenantIds.map((id) => `tenantIds=${id}`).join('&')
    return del('/tenant' + `?${queryString}`)
  }

  return {
    getFcuTenantIdList,
    createFcuTenant,
    deleteFcuTenant
  }
}

export * from './typings'
export default useFcuTenantRequest
