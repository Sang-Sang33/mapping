import axios from 'axios'
import NProgress from '@/config/nprogress'
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import ErrorHandle from './errorHandler'
import { message } from 'antd'
import { ResponseCode, ResponseKey } from './enum'
import { getNewToken, getTenant, getToken, getWarehouseInCookie } from '@/utils/token'
import Cookies from 'js-cookie'

import { checkStatus } from '../helper/checkStatus'

type MWAxiosRequestConfig<T = any> = AxiosRequestConfig<T> & { showProgress?: boolean }

class NRequest {
  protected instance: AxiosInstance | null = null

  constructor(config: MWAxiosRequestConfig, prefix: string = '') {
    const { baseURL, ...rest } = config

    // 创建实例
    this.instance = axios.create({
      baseURL: prefix ? baseURL + prefix : baseURL,
      timeout: 1000 * 20,
      withCredentials: false,
      ...rest
    })

    this.requestInterceptor()
    this.responseInterceptor()
  }

  private requestInterceptor() {
    this.instance!.interceptors.request.use(
      (config: MWAxiosRequestConfig = {}) => {
        config.showProgress && NProgress.start()
        // 设置请求头
        if (config.headers) {
          const tenantId = getTenant()
          const warehouseId = getWarehouseInCookie()
          if (!config.url?.includes('/wcs')) config.headers.Authorization = getNewToken() + ''
          config.headers.tenantId = tenantId || ''
          config.headers.warehouseId = warehouseId || ''
        }

        return config
      },
      (error: AxiosError) => {
        message.error(error.message)
        return Promise.reject(error)
      }
    )
  }

  private responseInterceptor() {
    this.instance!.interceptors.response.use(
      (response: AxiosResponse): Promise<Result> => {
        NProgress.done()
        return new Promise((resolve, reject) => {
          const { status, data, headers } = response
          // 说明axios 都失败了
          console.log('dangqian ', status)
          if (status - 200 > 10) reject(data)

          // 不是成功状态码
          // 新增文件类型不判断状态码
          // console.log("ResponseKey.CODE", ResponseKey.CODE);
          // if (data[ResponseKey.CODE] !== ResponseCode.SUCCESS && headers["content-type"] !== "application/octet-stream") {
          // 	message.error(data[ResponseKey.MESSAGE]);

          // 	ErrorHandle[data[ResponseKey.CODE] as keyof typeof ErrorHandle]();
          // 	reject(data);
          // }

          // 成功返回
          console.log('data', data)
          resolve(data)
        })
      },
      (error) => {
        console.log('error', error)
        const { response } = error
        NProgress.done()
        if (response) checkStatus(response)
        return Promise.reject(error)
      }
    )
  }

  public request<T>(config: MWAxiosRequestConfig<T>): Promise<Result<T>> {
    return this.instance!.request(config)
  }

  public get = <T>(url: string, params: any = {}, config: MWAxiosRequestConfig = {}): Promise<Result<T>> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'GET',
      params,
      ...config
    }
    return this.request(option)
  }

  public post = <T>(url: string, data: any = {}, config: MWAxiosRequestConfig = {}): Promise<Result<T>> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'POST',
      data,
      ...config
    }
    return this.request(option)
  }

  public put = <T>(url: string, data: any = {}, config: MWAxiosRequestConfig = {}): Promise<Result<T>> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'put',
      data,
      ...config
    }
    return this.request(option)
  }
  public del = <T>(url: string, params: any = {}, config: MWAxiosRequestConfig = {}): Promise<Result<T>> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'delete',
      params,
      ...config
    }
    return this.request(option)
  }

  public upload = <T>(url: string, data: any = {}, config: MWAxiosRequestConfig = {}): Promise<Result<T>> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'put',
      data,
      withCredentials: false,
      headers: {
        'Content-Type': ''
      },
      ...config
    }
    return this.request(option)
  }

  public download = <T>(url: string, params: any = {}, config: MWAxiosRequestConfig = {}): Promise<Result<T>> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'GET',
      responseType: 'blob',
      params,
      ...config
    }
    return this.request(option)
  }

  // public UPLOAD<P>(URL: string, DATA: P): Promise<unknown> {
  // 	const _DATA = DATA;
  // 	const MD5 = Base64.encode(new SparkMD5.ArrayBuffer().append(_DATA).end(true));
  // 	return axios({
  // 		...this.getAxiosOption({ method: "PUT", url: URL, _params: {} }),
  // 		data: DATA,
  // 		withCredentials: false,
  // 		headers: {
  // 			"Content-Type": "",
  // 			"Content-MD5": MD5
  // 		}
  // 	});
  // }
}

const { get, post, del, put, upload, download } = new NRequest({
  baseURL: window.__WCS_API__ || import.meta.env.VITE_APP_BASIC_API
  // baseURL: "/api"
})

export { get, post, del, put, upload, download }

export default NRequest
