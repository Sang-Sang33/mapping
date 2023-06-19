import MWRequest from '../../../../request'
import type { ITenantItem } from './typings'

const useMappingTenantRequest = (mwRequest: MWRequest) => {
  const { get } = mwRequest

  const getTenantList = async () => get<ITenantItem[]>('/customer')

  return {
    getTenantList
  }
}

export * from './typings'
export default useMappingTenantRequest
