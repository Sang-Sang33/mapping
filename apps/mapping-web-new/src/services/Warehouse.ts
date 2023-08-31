// @ts-ignore
import { get, post, del, put } from "@packages/services";

/** 添加仓库信息 POST /Warehouse/Add */
export async function postApiWarehouseAdd(
  body: API.WarehouseInfoDTO,
  options?: { [key: string]: any },
) {
  return post<boolean>('/mapping/warehouse', body);
}

/** 删除仓库信息 DELETE /Warehouse/Delete */
export async function deleteApiWarehouseDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteApiWarehouseDeleteParams,
  options?: { [key: string]: any },
) {
  return del<boolean>('/mapping/warehouse', params);
}


/** 更新仓库信息 PUT /Warehouse/Update */
export async function putApiWarehouseUpdate(
  body: API.WarehouseInfoDTO,
  options?: { [key: string]: any },
) {
  return put<boolean>('/mapping/warehouse', body);
}


/** 更新仓库信息 PUT /Warehouse/Update */
export async function getApiWarehouseUpdate(
) {
  return get<API.IWarehouse[]>('/api/v2/mapping/warehouse');
}


export const getRcspoint = () => get<RCSPoints>('/api/v2/mapping/rcs-point')

export const saveRcspoint = (params: { points: string }) => post('/api/v2/mapping/rcs-point', params)