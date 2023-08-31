import { get, post, del, put } from "@packages/services";
// @ts-ignore

/** 添加货架信息 POST /Shelf/Add */
export async function postApiShelfAdd(body: Omit<API.ShelfInfoDTO, 'id'>) {
  return post<boolean>('/api/v2/mapping/shelf', body);
}

/** 删除货架信息 DELETE /Shelf/Delete */
export async function deleteApiShelfDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: string,
) {
  return del<boolean>(`/api/v2/mapping/shelf/${params}`);
}

/** 获取货架分页数据 POST /Shelf/GetPageData */
export async function getApiShelfGetPageData(
) {
  return get<API.ShelfInfoDTO[]>('/api/v2/mapping/shelf');
}

/** 更新货架信息 PUT /Shelf/Update */
export async function putApiShelfUpdate(body: API.ShelfInfoDTO) {
  return put<boolean>('/api/v2/mapping/shelf', body);
}
