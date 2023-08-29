import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export type MWAxiosRequestConfig<T = any> = AxiosRequestConfig<T> & { showProgress?: boolean; withToken?: boolean }
export type MwInternalAxiosRequestConfig<T = any> = InternalAxiosRequestConfig<T> & {
  showProgress?: boolean
  withToken?: boolean
}
