import type MWRequest from '../../../../request'
import type { ICreateDeviceFunctionData, IDeviceItem, TDeviceStatus } from './typings'

const useWcsDeviceRequest = (mwRequest: MWRequest) => {
  const { get, del, post, put } = mwRequest
  const fetchDevice = () => get<IDeviceItem[]>('/device')
  const deleteDevice = (name: string) => del('/device', { name })
  const updateDevice = (params: { oldName: string; newName: string }) =>
    put<any>('/device/name', null, {
      params
    })
  const fetchDeviceFunction = (ids: string[]) => {
    const queryString = ids.map((id) => `ids=${id}`).join('&')
    return get<any[]>(`/function?${queryString}`)
  }
  const deleteDeviceFunction = (id: string) => del(`/function/${id}`)
  const createDeviceFunction = (data: ICreateDeviceFunctionData[]) => post('/function', data)
  const updateDeviceFunction = (data: any) => put('/function', data)

  const fetchDeviceStatus = () =>
    get<TDeviceStatus>(
      '/device/statuses',
      {},
      {
        showProgress: false
      }
    )

  return {
    fetchDevice,
    deleteDevice,
    updateDevice,
    fetchDeviceFunction,
    deleteDeviceFunction,
    createDeviceFunction,
    updateDeviceFunction,
    fetchDeviceStatus
  }
}

export * from './typings'
export default useWcsDeviceRequest