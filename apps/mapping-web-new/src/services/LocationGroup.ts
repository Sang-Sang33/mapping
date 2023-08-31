// @ts-ignore
import { get, post, del, put } from "@packages/services";

/** 添加货位分组 POST /LocationGroup/Add */
export async function postApiLocationGroupAdd(
  body: API.LocationGroupInfoDTO,
  options?: { [key: string]: any },
) {
  return post<boolean>('/LocationGroup/Add', body);
}

/** 删除货位分组 GET /LocationGroup/Delete */
export async function getApiLocationGroupDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApiLocationGroupDeleteParams,
  options?: { [key: string]: any },
) {
  return get<boolean>('/LocationGroup/Delete', params);
}

/** 根据ID获取货位分组 GET /LocationGroup/GetById */
export async function getApiLocationGroupGetById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApiLocationGroupGetByIdParams,
) {
  return get<API.LocationGroupInfoDTO>('/LocationGroup/GetById', params);
}

/** 获取货位分组分页数据 POST /LocationGroup/GetPageData */
export async function postApiLocationGroupGetPageData(
  body: API.QueryLocationGroupInfoPageingParameter,
  options?: { [key: string]: any },
) {
  return post<API.LocationGroupInfoDTOPageResult>('/LocationGroup/GetPageData', body);
}

/** 更新货位分组 POST /LocationGroup/Update */
export async function postApiLocationGroupUpdate(
  body: API.LocationGroupInfoDTO,
  options?: { [key: string]: any },
) {
  return post<boolean>('/LocationGroup/Update', body);
}
