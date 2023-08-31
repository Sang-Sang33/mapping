import AppCookie from '.'
import type { TCulture } from '../locale'
import type { CookieAttributes } from 'js-cookie'

/** token */
export const getTokenIC = () => AppCookie.get('ACCESS_TOKEN')
export const removeTokenIC = (options?: CookieAttributes) => AppCookie.remove('ACCESS_TOKEN', options)

/** tenant  */
export const getTenantIdIC = () => AppCookie.get('TENANT_ID')
export const setTenantIdIC = (tenantId: string) => AppCookie.set('TENANT_ID', tenantId)
export const removeTenantIdIC = () => AppCookie.remove('TENANT_ID')

/** warehouse */
export const getWarehouseIdIC = () => AppCookie.get('WAREHOUSE_ID')
export const setWarehouseIdIC = (warehouseId: string) => AppCookie.set('WAREHOUSE_ID', warehouseId)
export const removeWarehouseIdIC = () => AppCookie.remove('WAREHOUSE_ID')

/** WmsWarehouseId */
export const getWmsWarehouseIdIC = () => AppCookie.get('WMS_WAREHOUSE_ID')
export const setWmsWarehouseIdIC = (warehouseId: string) => AppCookie.set('WMS_WAREHOUSE_ID', warehouseId)
export const removeWmsWarehouseIdIC = () => AppCookie.remove('WMS_WAREHOUSE_ID')

/** culture */
export const getCultureIC = () => {
  const content = AppCookie.get('CULTURE')
  return content?.split('uic=')?.[1] as TCulture
}
export const setCultureIc = (
  culture: TCulture,
  options: CookieAttributes = {
    expires: 365
  }
) => {
  const content = `c=${culture}|uic=${culture}`
  AppCookie.set('CULTURE', content, options)
}
