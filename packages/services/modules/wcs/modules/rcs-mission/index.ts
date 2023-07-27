import type MWRequest from '../../../../request'
import type { IListResult, IListParams } from '../../typings'
import type {
  IRcsItem,
  IRcsSubItem,
  TCreateRcsItem,
  TCreateRcsSubItem,
  TUpdateRcsItem,
  TUpdateRcsSubItem
} from './typings'

const useWcsRcsMissionRequest = (mwRequest: MWRequest) => {
  const { get, post, put } = mwRequest

  const getRcsMissionList = async (params: IListParams, showProgress = false) => {
    const Sorting: string =
      params.Sorting?.map(
        ({ key, order }) => key.charAt(0).toUpperCase() + key.slice(1) + (order ? ' ' + order.slice(0, -3) : '')
      ).join(',') || ''

    return get<IListResult<IRcsItem>>(
      `/rcs-mission?Sorting=${Sorting}`,
      { PageNumber: params.PageNumber, PageSize: params.PageSize },
      {
        showProgress
      }
    )
  }

  const getRcsSubMissionList = (missionId: string, showProgress = false) =>
    get<IRcsSubItem[]>(
      '/rcs-sub-mission/of-mission/' + missionId,
      {},
      {
        showProgress
      }
    )

  const getRcsMissionPage = (params: IListParams & { Id: string }, showProgress = false) =>
    get<any>(
      '/rcs-mission/page-of',
      {
        ...params
      },
      { showProgress }
    )

  const createRcsMission = (data: TCreateRcsItem) => post('/rcs-mission', data)
  const updateRcsMission = (data: TUpdateRcsItem) => put('/rcs-mission', data)
  const completeRcsMission = (missionId: IRcsItem['id']) => post('/rcs-mission/complete', { missionId })
  const cancelRcsMission = (missionId: IRcsItem['id']) => post('/rcs-mission/cancel', { missionId })

  const createRcsSubMission = (data: TCreateRcsSubItem) => post('/rcs-sub-mission', data)
  const updateRcsSubMission = (data: TUpdateRcsSubItem) => put('/rcs-sub-mission', data)
  const cancelRcsSubMission = (missionId: IRcsItem['id']) => post('/rcs-sub-mission/cancel', { missionId })

  return {
    getRcsMissionList,
    getRcsSubMissionList,
    getRcsMissionPage,

    createRcsMission,
    updateRcsMission,
    completeRcsMission,
    cancelRcsMission,

    createRcsSubMission,
    updateRcsSubMission,
    cancelRcsSubMission
  }
}

export * from './typings'
export default useWcsRcsMissionRequest
