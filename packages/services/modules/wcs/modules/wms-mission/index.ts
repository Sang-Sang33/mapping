import type MWRequest from '../../../../request'
import type { IListResult, IListParams } from '../../typings'
import type {
  IWmsItem,
  IWmsSubItem,
  TCreateWmsItem,
  TCreateWmsSubItem,
  TUpdateWmsItem,
  TUpdateWmsSubItem
} from './typings'

const useWcsWmsMissionRequest = (mwRequest: MWRequest) => {
  const { get, post, put } = mwRequest

  const getWmsMissionList = async (params: IListParams, showProgress = false) => {
    const Sorting: string =
      params.Sorting?.map(
        ({ key, order }) => key.charAt(0).toUpperCase() + key.slice(1) + (order ? ' ' + order.slice(0, -3) : '')
      ).join(',') || ''

    return get<IListResult<IWmsItem>>(
      `/wms-mission?Sorting=${Sorting}`,
      { PageNumber: params.PageNumber, PageSize: params.PageSize },
      {
        showProgress
      }
    )
  }

  const getWmsSubMissionList = (missionId: string, showProgress = false) =>
    get<IWmsSubItem[]>(
      '/wms-sub-mission/of-mission/' + missionId,
      {},
      {
        showProgress
      }
    )

  const getWmsMissionPage = (params: IListParams & { Id: string }, showProgress = false) =>
    get<any>(
      '/wms-mission/page-of',
      {
        ...params
      },
      { showProgress }
    )

  const createWmsMission = (data: TCreateWmsItem) => post('/wms-mission', data)
  const updateWmsMission = (data: TUpdateWmsItem) => put('/wms-mission', data)
  const completeWmsMission = (missionId: IWmsItem['id']) => post('/wms-mission/complete', { missionId })
  const cancelWmsMission = (missionId: IWmsItem['id']) => post('/wms-mission/cancel', { missionId })

  const createWmsSubMission = (data: TCreateWmsSubItem) => post('/wms-sub-mission', data)
  const updateWmsSubMission = (data: TUpdateWmsSubItem) => put('/wms-sub-mission', data)
  const cancelWmsSubMission = (data: { missionId: IWmsItem['id']; subMissionId: IWmsSubItem['id'] }) =>
    post('/wms-sub-mission/cancel', data)

  const fetchWmsMissionAvailablePredecessors = () => get<string[]>('/wms-mission/available-predecessors')
  const fetchSlot = (searchTerm: string) => get<string[]>('/slot', { searchTerm })

  return {
    getWmsMissionList,
    getWmsSubMissionList,
    getWmsMissionPage,

    createWmsMission,
    updateWmsMission,
    completeWmsMission,
    cancelWmsMission,

    createWmsSubMission,
    updateWmsSubMission,
    cancelWmsSubMission,

    fetchWmsMissionAvailablePredecessors,
    fetchSlot
  }
}

export * from './typings'
export default useWcsWmsMissionRequest
