import { post } from '@/http/request'
import ApifoxModel from './interface.d'
export const fetchUser = (params: any) => post<ApifoxModel>('/Auth/Login', { ...params })
