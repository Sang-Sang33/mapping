// @ts-ignore
import { get, post, del, put } from "@packages/services";

/** 批量添加货位信息 POST /Location/BatchAdd */
export async function postApiLocations(body: API.BatchLocationInfoDTO, options?: { [key: string]: any }) {
	return post<boolean>("/api/v2/mapping/location", body);
}

/** 批量删除货位 POST /Location/BatchDelete */
export async function delApiLocations(body: number[]) {
	const res = body.map(item => `ids=${item}`).join('&');
	return del<boolean>(`/api/v2/mapping/location?${res}`);
}

/** 批量更新货位信息 POST /Location/BatchUpdate */
export async function getApiLocations() {
	return get<API.LocationInfoDTO[]>("/api/v2/mapping/location");
}
