import MWRequest from '../../request'
import useMappingTenantRequest from './modules/tenant'
import useMappingWarehouseRequest from './modules/warehouse'

export * from './modules/tenant'
export * from './modules/warehouse'

export const useMappingRequest = (baseURL = '/api/mapping') => {
  const mwRequest = new MWRequest({
    baseURL,
    withToken: false
  })

  return {
    ...mwRequest,
    ...useMappingTenantRequest(mwRequest),
    ...useMappingWarehouseRequest(mwRequest)
  }
}
