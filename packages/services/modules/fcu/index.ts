import MWRequest from '../../request'
import useFcuTenantRequest from './modules/tenant'
import useFcuWarehouseRequest from './modules/warehouse'

export * from './modules/tenant'
export * from './modules/warehouse'

export const useFcuRequest = (baseURL = '/api/fcu') => {
  const mwRequest = new MWRequest({
    baseURL
  })

  return {
    ...mwRequest,
    ...useFcuTenantRequest(mwRequest),
    ...useFcuWarehouseRequest(mwRequest)
  }
}
