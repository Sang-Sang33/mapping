import { get } from '@/http/request'
import type { IListParams, IListResult } from '@/http/common'
import type { IRcsItem, IRcsSubItem } from './interface.d'

export const getRcsMissionList = async (params: IListParams, showProgress = false) => {
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

export const getRcsSubMissionList = (missionId: string, showProgress = false) =>
  get<IRcsSubItem[]>(
    '/api/wcs/rcs-sub-mission/of-mission/' + missionId,
    {},
    {
      showProgress
    }
  )

export const getRcsMissionPage = (params: IListParams & { Id: string }, showProgress = false) =>
  get<any>(
    '/api/wcs/rcs-mission/page-of',
    {
      ...params
    },
    { showProgress }
  )
