import type MWRequest from '../../../../request'
import type {
  IDebugWorkflow,
  IListResult,
  IWorkflowDefinition,
  IWorkflowInstanceItem,
  IWorkflowInstanceListParams
} from '../../typings'
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
    return get<IWorkflowDefinition[]>(`/function?${queryString}`)
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

  const debugDeviceFunction = (data: IDebugWorkflow) => post('/function/run', data)

  const fetchDeviceFunctionInstanceList = (params: IWorkflowInstanceListParams) =>
    get<IListResult<IWorkflowInstanceItem>>('/function/instance-list', params)

  return {
    fetchDevice,
    deleteDevice,
    updateDevice,
    fetchDeviceFunction,
    deleteDeviceFunction,
    createDeviceFunction,
    updateDeviceFunction,
    fetchDeviceStatus,
    debugDeviceFunction,
    fetchDeviceFunctionInstanceList
  }
}

export * from './typings'
export default useWcsDeviceRequest
