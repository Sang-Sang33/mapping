import type MWRequest from '../../../../request'
import type { ICreateMissionData, IMissionItem } from './typings'

const useWcsMissionProcessRequest = (mwRequest: MWRequest) => {
  const { get, del, post, put } = mwRequest

  const fetchMissionProcess = () => get<IMissionItem[]>('/mission-process/names')
  const fetchMissionProcessAvailableNames = () => get<string[]>('/mission-process/available-names')
  const fetchMissionProcessWorkflowDefinition = (ids: string[]) => {
    const queryString = ids.map((id) => `ids=${id}`).join('&')
    return get<any[]>(`/event?${queryString}`)
  }
  const deleteMissionProcess = (id: string) => del(`/mission-process/${id}`)
  const createMissionProcess = (data: ICreateMissionData[]) => post('/mission-process', data)
  const updateMissionProcess = (data: any) => put('/mission-process', data)

  return {
    fetchMissionProcess,
    fetchMissionProcessAvailableNames,
    fetchMissionProcessWorkflowDefinition,
    deleteMissionProcess,
    createMissionProcess,
    updateMissionProcess
  }
}

export * from './typings'
export default useWcsMissionProcessRequest
