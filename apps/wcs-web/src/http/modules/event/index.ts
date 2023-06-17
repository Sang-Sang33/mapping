import { get, del, post, put } from '@/http/request'
import type { ICreateEventData, IEventItem } from './interface.d'
export const fetchEvent = () => get<IEventItem[]>('/api/wcs/event/names')
export const fetchEventWorkflowDefinition = (ids: string[]) => {
  const queryString = ids.map((id) => `ids=${id}`).join('&')
  return get<any[]>(`/api/wcs/event?${queryString}`)
}
export const deleteEvent = (id: string) => del(`/api/wcs/event/${id}`)
export const createEvent = (data: ICreateEventData[]) => post('/api/wcs/event', data)
export const updateEvent = (data: any) => put('/api/wcs/event', data)
