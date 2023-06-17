import { get, del, post, put } from '@/http/request'
import type { ICreateMissionData, IMissionItem } from './interface.d'
export const fetchMissionProcess = () => get<IMissionItem[]>('/api/wcs/mission-process/names')
export const fetchMissionProcessAvailableNames = () => get<string[]>('/api/wcs/mission-process/available-names')
export const fetchMissionProcessWorkflowDefinition = (ids: string[]) => {
  const queryString = ids.map((id) => `ids=${id}`).join('&')
  return get<any[]>(`/api/wcs/event?${queryString}`)
}
export const deleteMissionProcess = (id: string) => del(`/api/wcs/mission-process/${id}`)
export const createMissionProcess = (data: ICreateMissionData[]) => post('/api/wcs/mission-process', data)
export const updateMissionProcess = (data: any) => put('/api/wcs/mission-process', data)
