import AppCookie from '.'
import type { TCulture } from '../locale'
import type { CookieAttributes } from 'js-cookie'

/** token */
export const getTokenIC = () => AppCookie.get('ACCESS_TOKEN')
export const removeTokenIC = () => AppCookie.remove('ACCESS_TOKEN')

/** tenant  */
export const getTenantIdIC = () => AppCookie.get('TENANT_ID')
export const removeTenantIdIC = () => AppCookie.remove('TENANT_ID')

/** warehouse */
export const getWarehouseIdIC = () => AppCookie.get('WAREHOUSE_ID')
export const removeWarehouseIdIC = () => AppCookie.remove('WAREHOUSE_ID')

/** culture */
export const getCultureIC = () => {
  const content = AppCookie.get('CULTURE')
  return content?.split('uic=')?.[1] as TCulture
}
export const setCultureIc = (
  culture: TCulture,
  options: CookieAttributes = {
    expires: 365,
    domain: '.multiway-cloud.com'
  }
) => {
  const content = `c=${culture}|uic=${culture}`
  AppCookie.set('CULTURE', content, options)
}
