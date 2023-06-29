import MWRequest from '../../../../request'
import type { ITenantItem } from './typings'

const useFcuTenantRequest = (mwRequest: MWRequest) => {
  const { get, post, del } = mwRequest

  const getFcuTenantIdList = async () => get<ITenantItem['id'][]>('/tenant')
  const createFcuTenant = async (data: { tenantId: ITenantItem['id'] }) => post('/tenant', data)
  const deleteFcuTenant = async (tenantIds: ITenantItem['id'][]) => {
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
