import type MWRequest from '../../../../request'
import type { IDebugWorkflow, IListResult, IWorkflowInstanceItem, IWorkflowInstanceListParams } from '../../typings'
import type { ICreateEventData, IEventItem } from './typings'

const useWcsEventRequest = (mwRequest: MWRequest) => {
  const { get, del, post, put } = mwRequest

  const fetchEvent = () => get<IEventItem[]>('/event/names')
  const fetchEventWorkflowDefinition = (ids: string[]) => {
    const queryString = ids.map((id) => `ids=${id}`).join('&')
    return get<any[]>(`/event?${queryString}`)
  }
  const deleteEvent = (id: string) => del(`/event/${id}`)
  const createEvent = (data: ICreateEventData[]) => post('/event', data)
  const updateEvent = (data: any) => put('/event', data)
  const debugEvent = (data: IDebugWorkflow) => post('/event/run', data)

  const fetchEventInstanceList = (params: IWorkflowInstanceListParams) =>
    get<IListResult<IWorkflowInstanceItem>>('/event/instance-list', params)

  return {
    fetchEvent,
    fetchEventWorkflowDefinition,
    deleteEvent,
    createEvent,
    updateEvent,
    debugEvent,
    fetchEventInstanceList
  }
}

export * from './typings'
export default useWcsEventRequest
