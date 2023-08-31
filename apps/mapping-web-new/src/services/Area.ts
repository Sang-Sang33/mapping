// @ts-ignore
import { get, post, del, put } from "@packages/services";

/** 添加区域信息 POST /Area/Add */
export async function postApiAreaAdd(body: Omit<API.AreaInfoDTO, 'id'>) {
	return post<boolean>("/api/v2/mapping/area", body);
}

/** 删除区域信息 DELETE /Area/Delete */
export async function deleteApiAreaDelete(
	// 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
	params: string
) {
	return del<boolean>(`/api/v2/mapping/area/${params}`);
}

/** 更新区域信息 PUT /Area/Update */
export async function putApiAreaUpdate(body: API.AreaInfoDTO, options?: { [key: string]: any }) {
	return put<boolean>("/api/v2/mapping/area", body);
}

/** 更新区域信息 get /Area/Update */
export async function getApiAreaUpdate() {
	return get<API.AreaInfoDTO[]>("/api/v2/mapping/area");
}
