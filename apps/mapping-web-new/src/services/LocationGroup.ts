// @ts-ignore
import { get, post, del, put } from "@packages/services";

/** 添加货位分组 POST /LocationGroup/Add */
export async function postApiLocationGroupAdd(
  body: Omit<API.PostLocationGroupInfoDTO, 'id'>,
) {
  return post<boolean>('/api/v2/mapping/location-group', body);
}

export async function getApiLocationGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
) {
  return get<API.LocationGroupInfoDTO[]>('/api/v2/mapping/location-group');
}

/** 删除货位分组 GET /LocationGroup/Delete */
export async function deleteApiLocationGroupDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApiLocationGroupDeleteParams,
) {
  return del<boolean>('/api/v2/mapping/location-group', params);
}

/** 更新货位分组 POST /LocationGroup/Update */
export async function putApiLocationGroupUpdate(
  body: API.PostLocationGroupInfoDTO,
) {
  return put<boolean>('/api/v2/mapping/location-group', body);
}
