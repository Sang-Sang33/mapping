// @ts-ignore
import { get, post, del, put } from "@packages/services";

/** 添加路径信息 POST /Routing/Add */
export async function postApiRoutingAdd(body: Omit<API.RoutingInfoDTO, 'id'>) {
	return post<boolean>("/api/v2/mapping/routing", body);
}

/** 删除路径信息 DELETE /Routing/Delete */
export async function deleteApiRoutingDelete(
	// 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
	params: string
) {
	return del<boolean>(`/api/v2/mapping/routing/${params}`);
}

/** 根据ID获取路径信息 GET /Routing/GetById */
export async function getApiRouting(
	// 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
) {
	return get<API.RoutingInfoDTO[]>("/api/v2/mapping/routing");
}

/** 更新路径信信息 PUT /Routing/Update */
export async function putApiRoutingUpdate(body: API.RoutingInfoDTO) {
	return put<boolean>("/api/v2/mapping/routing", body);
}
