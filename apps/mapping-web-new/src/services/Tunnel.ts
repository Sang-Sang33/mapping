// @ts-ignore
import { get, post, del, put } from "@packages/services";

/** 添加巷道信息 POST /Tunnel/Add */
export async function postApiTunnelAdd(body: Omit<API.TunnelInfoDTO, 'id'>) {
	return post<boolean>("/api/v2/mapping/tunnel", body);
}

/** 删除巷道信息 DELETE /Tunnel/Delete */
export async function deleteApiTunnelDelete(
	// 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
	params: string,
) {
	return del<boolean>(`/api/v2/mapping/tunnel/${params}`);
}

/** 获取巷道分页数据 POST /Tunnel/GetPageData */
export async function getApiTunnelGetPageData() {
	return get<API.TunnelInfoDTO[]>("/api/v2/mapping/tunnel");
}

/** 更新巷道信息 PUT /Tunnel/Update */
export async function putApiTunnelUpdate(body: API.TunnelInfoDTO) {
	return put<boolean>("/api/v2/mapping/tunnel", body);
}

