import MWRequest from '../../request'
import useWcsDeviceRequest from './modules/device'
import useWcsEventRequest from './modules/event'
import useWcsMissionProcessRequest from './modules/mission-process'
import useWcsRcsMissionRequest from './modules/rcs-mission'
import useWcsWmsMissionRequest from './modules/wms-mission'

export * from './modules/device'
export * from './modules/event'
export * from './modules/mission-process'
export * from './modules/rcs-mission'
export * from './modules/wms-mission'
export * from './typings'

export const useWcsRequest = (baseURL = '/api/wcs') => {
  const mwRequest = new MWRequest({
    baseURL
  })

  return {
    ...mwRequest,
    ...useWcsDeviceRequest(mwRequest),
    ...useWcsEventRequest(mwRequest),
    ...useWcsMissionProcessRequest(mwRequest),
    ...useWcsRcsMissionRequest(mwRequest),
    ...useWcsWmsMissionRequest(mwRequest)
  }
}
