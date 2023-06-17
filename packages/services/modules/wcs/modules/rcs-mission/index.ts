import type MWRequest from '../../../../request'
import type { IListResult, IListParams } from '../../typings'
import type { IRcsItem, IRcsSubItem } from './typings'

const useWcsRcsMissionRequest = (mwRequest: MWRequest) => {
  const { get } = mwRequest

  const getRcsMissionList = async (params: IListParams, showProgress = false) => {
    const Sorting: string =
      params.Sorting?.map(
        ({ key, order }) => key.charAt(0).toUpperCase() + key.slice(1) + (order ? ' ' + order.slice(0, -3) : '')
      ).join(',') || ''

    return get<IListResult<IRcsItem>>(
      `/api/wcs/rcs-mission?Sorting=${Sorting}`,
      { PageNumber: params.PageNumber, PageSize: params.PageSize },
      {
        showProgress
      }
    )
  }

  const getRcsSubMissionList = (missionId: string, showProgress = false) =>
    get<IRcsSubItem[]>(
      '/api/wcs/rcs-sub-mission/of-mission/' + missionId,
      {},
      {
        showProgress
      }
    )

  const getRcsMissionPage = (params: IListParams & { Id: string }, showProgress = false) =>
    get<any>(
      '/api/wcs/rcs-mission/page-of',
      {
        ...params
      },
      { showProgress }
    )

  return {
    getRcsMissionList,
    getRcsSubMissionList,
    getRcsMissionPage
  }
}

export default useWcsRcsMissionRequest
