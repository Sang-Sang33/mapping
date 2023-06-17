import { get, del, post, put } from '@/http/request'
import type { ICreateDeviceFunctionData, IDeviceItem, TDeviceStatus } from './interface.d'
export const fetchDevice = () => get<IDeviceItem[]>('/api/wcs/device')
export const deleteDevice = (name: string) => del('/api/wcs/device', { name })
export const updateDevice = (params: { oldName: string; newName: string }) =>
  put<any>('/api/wcs/device/name', null, {
    params
  })
export const fetchDeviceFunction = (ids: string[]) => {
  const queryString = ids.map((id) => `ids=${id}`).join('&')
  return get<any[]>(`/api/wcs/function?${queryString}`)
}
export const deleteDeviceFunction = (id: string) => del(`/api/wcs/function/${id}`)
export const createDeviceFunction = (data: ICreateDeviceFunctionData[]) => post('/api/wcs/function', data)
export const updateDeviceFunction = (data: any) => put('/api/wcs/function', data)

export const fetchDeviceStatus = () =>
  get<TDeviceStatus>(
    '/api/wcs/device/statuses',
    {},
    {
      showProgress: false
    }
  )
