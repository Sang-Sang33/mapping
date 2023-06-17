import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export type MWAxiosRequestConfig<T = any> = AxiosRequestConfig<T> & { showProgress?: boolean }
export type MwInternalAxiosRequestConfig<T = any> = InternalAxiosRequestConfig<T> & { showProgress?: boolean }
