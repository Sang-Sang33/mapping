import axios from 'axios'
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { message } from 'antd'
import NProgress from '../config/nprogress'
import { checkStatus } from '../helper/checkStatus'
import type { MWAxiosRequestConfig, MwInternalAxiosRequestConfig } from './typings'
import { getTenantIdIC, getTokenIC, getWarehouseIdIC } from '@packages/utils'

class MWRequest {
  protected instance: AxiosInstance | null = null

  constructor(config: MWAxiosRequestConfig, prefix = '') {
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
      (config: MwInternalAxiosRequestConfig) => {
        config.showProgress && NProgress.start()
        // 设置请求头
        if (config.headers) {
          const token = getTokenIC() ?? ''
          const tenantId = getTenantIdIC() ?? ''
          const warehouseId = getWarehouseIdIC() ?? ''
          if (config.withToken !== false) config.headers.Authorization = token
          config.headers.tenantId = tenantId
          config.headers.warehouseId = warehouseId
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
      (response: AxiosResponse) => {
        NProgress.done()
        return new Promise((resolve, reject) => {
          const { status, data } = response
          if (status - 200 > 10) reject(data)
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

  public request<T>(config: MWAxiosRequestConfig<T>): Promise<T> {
    return this.instance!.request(config)
  }

  public get = <T>(url: string, params: any = {}, config: MWAxiosRequestConfig = {}): Promise<T> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'GET',
      params,
      ...config
    }
    return this.request(option)
  }

  public post = <T>(url: string, data: any = {}, config: MWAxiosRequestConfig = {}): Promise<T> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'POST',
      data,
      ...config
    }
    return this.request(option)
  }

  public put = <T>(url: string, data: any = {}, config: MWAxiosRequestConfig = {}): Promise<T> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'put',
      data,
      ...config
    }
    return this.request(option)
  }
  public del = <T>(url: string, params: any = {}, config: MWAxiosRequestConfig = {}): Promise<T> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'delete',
      params,
      ...config
    }
    return this.request(option)
  }

  public upload = <T>(url: string, data: any = {}, config: MWAxiosRequestConfig = {}): Promise<T> => {
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

  public download = <T>(url: string, params: any = {}, config: MWAxiosRequestConfig = {}): Promise<T> => {
    const option: AxiosRequestConfig = {
      url,
      method: 'GET',
      responseType: 'blob',
      params,
      ...config
    }
    return this.request(option)
  }
}

export const { get, post, del, put, upload, download } = new MWRequest({})
export * from './typings'

export default MWRequest
