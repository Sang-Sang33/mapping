import axios from "axios";
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from "axios";
import ErrorHandle from "./errorHandler";
import { message } from "antd";
import { ResponseCode, ResponseKey } from "./enum";
import { getToken, clearToken } from '@/utils/token'
import { redirectToSso, getAccessToken } from '@/utils/auth'

class NRequest {
	protected instance: AxiosInstance | null = null;

	constructor(config: AxiosRequestConfig, prefix: string = "") {
		const { baseURL, ...rest } = config;

		// 创建实例
		this.instance = axios.create({
			baseURL: prefix ? baseURL + prefix : baseURL,
			timeout: 1000 * 20,
			withCredentials: true,
			...rest
		});

		this.requestInterceptor();
		this.responseInterceptor();
	}

	private requestInterceptor() {
		this.instance!.interceptors.request.use(
			(config: AxiosRequestConfig = {}) => {
				// 设置请求头
				if (config.headers) {
					const tenantId = localStorage.getItem('tenantId')
					const warehouseId = localStorage.getItem('warehouseId')
					config.headers.Authorization = getAccessToken() || '';
					config.headers.tenantId = tenantId || ''
					config.headers.warehouseId = warehouseId || ''
				}

				return config;
			},
			(error: AxiosError) => {
				message.error(error.message);
				return Promise.reject(error);
			}
		);
	}

	private responseInterceptor() {
		this.instance!.interceptors.response.use(
			(response: AxiosResponse): Promise<Result> => {
				return new Promise((resolve, reject) => {
					const { status, data } = response;

					// 说明axios 都失败了
					// if (status !== 200) reject(data);

					// 不是成功状态码
					// if (data[ResponseKey.CODE] !== ResponseCode.SUCCESS) {
					// 	message.error(data[ResponseKey.MESSAGE]);

					// 	// ErrorHandle[data[ResponseKey.CODE] as keyof typeof ErrorHandle]();
					// 	// reject(data);
					// }

					// 成功返回
					resolve(data);
				});
			},
			error => {
				if (error.response.status === 401) {
					// redirectToSso()
				} else {
					message.error(error.message);
				}
				return Promise.reject(error);
			}
		);
	}

	public request<T>(config: AxiosRequestConfig<T>): Promise<Result<T>> {
		return this.instance!.request(config);
	}

	public get = <T>(url: string, params: any = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> => {
		const option: AxiosRequestConfig = {
			url,
			method: "GET",
			params,
			...config
		};
		return this.request(option);
	};

	public post = <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> => {
		const option: AxiosRequestConfig = {
			url,
			method: "POST",
			data,
			...config
		};
		return this.request(option);
	};

	public put = <T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> => {
		const option: AxiosRequestConfig = {
			url,
			method: "put",
			data,
			...config
		};
		return this.request(option);
	};

	public del = <T>(url: string, params: any = {}, config: AxiosRequestConfig = {}, data: any = {}): Promise<Result<T>> => {
		const option: AxiosRequestConfig = {
			url,
			method: "delete",
			params,
			data,
			...config
		};
		return this.request(option);
	};
}
const API_BASE_URL = window.BASIC_API || '/api'
const USER_BASE_URL = window.AUTH_API || '/user'
const { get, post, del, put } = new NRequest({
	baseURL: API_BASE_URL
});
const authRequest = new NRequest({
	baseURL: USER_BASE_URL
});

export { get, post, del, put, authRequest };

export default NRequest;
