import { ECookie } from '@packages/enum'
import { getCultureIC, removeTenantIdIC, removeTokenIC, removeWarehouseIdIC } from './cookie'

interface IOptions {
  autoClearDefaultCache: boolean
  beforeRedirect?: () => void
}

/**
 * @description:
 * @param {string} ssoUrl 单点跳转地址
 * @param {object} options 跳转选项
 * @property {boolean} options.autoClearDefaultCache 跳转之前,是否清除默认的token\tenantId\warehouseId等数据
 * @property {function} options.beforeRedirect 跳转之前,可以做一些清理性的工作, 默认清除token
 * @return {*}
 */
export const redirectToSSO = (
  ssoUrl = '/sso',
  options: IOptions = {
    autoClearDefaultCache: true,
    beforeRedirect: undefined
  }
) => {
  if (options.autoClearDefaultCache) {
    removeTokenIC()
    removeTenantIdIC()
    removeWarehouseIdIC()
  }

  options.beforeRedirect?.()
  const queryString = `returnUrl=${location.href}&&lang=${getCultureIC()}&&tokenKey=${ECookie.ACCESS_TOKEN}`

  window.location.href = `${ssoUrl}/login?${queryString}`
}
