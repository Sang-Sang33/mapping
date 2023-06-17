import { get } from '@/http/request'
import type { IListParams, IListResult } from '@/http/common'
import type { IWmsItem, IWmsSubItem } from './interface.d'

export const getWmsMissionList = async (params: IListParams, showProgress = false) => {
  const Sorting: string =
    params.Sorting?.map(
      ({ key, order }) => key.charAt(0).toUpperCase() + key.slice(1) + (order ? ' ' + order.slice(0, -3) : '')
    ).join(',') || ''

  return get<IListResult<IWmsItem>>(
    `/api/wcs/wms-mission?Sorting=${Sorting}`,
    { PageNumber: params.PageNumber, PageSize: params.PageSize },
    {
      showProgress
    }
  )
}

export const getWmsSubMissionList = (missionId: string, showProgress = false) =>
  get<IWmsSubItem[]>(
    '/api/wcs/wms-sub-mission/of-mission/' + missionId,
    {},
    {
      showProgress
    }
  )

export const getWmsMissionPage = (params: IListParams & { Id: string }, showProgress = false) =>
  get<any>(
    '/api/wcs/wms-mission/page-of',
    {
      ...params
    },
    { showProgress }
  )
