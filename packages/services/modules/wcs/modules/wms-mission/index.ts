import type MWRequest from '../../../../request'
import type { IListResult, IListParams } from '../../typings'
import type { IWmsItem, IWmsSubItem } from './typings'

const useWcsWmsMissionRequest = (mwRequest: MWRequest) => {
  const { get } = mwRequest

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

  return {
    getWmsMissionList,
    getWmsSubMissionList,
    getWmsMissionPage
  }
}

export * from './typings'
export default useWcsWmsMissionRequest