import { request } from '@umijs/max';

const isProd = process.env.NODE_ENV === 'production';
const PROD_APP_API_MAP = { FCU_API: '', MAPPING_API: '' };
const { FCU_API, MAPPING_API } = isProd
  ? PROD_APP_API_MAP
  : window.__APP_API_MAP__ || __APP_API_MAP__;

export const getTenantList = async () =>
  request<ConfigureApi.ITenantItem[]>(MAPPING_API + '/api/mapping/customer');

const FCU_TENANT_CRUD_URL = FCU_API + '/api/fcu/tenant';
export const getFcuTenantIdList = async () =>
  request<ConfigureApi.ITenantItem['id'][]>(FCU_TENANT_CRUD_URL);

export interface ICreateFcuTenantData {
  tenantId: ConfigureApi.ITenantItem['id'];
}
export const createFcuTenant = async (data: ICreateFcuTenantData) =>
  request(FCU_TENANT_CRUD_URL, {
    method: 'POST',
    data,
  });

export type TDeleteFcuTenantIds = ConfigureApi.ITenantItem['id'][];

export const deleteFcuTenant = async (tenantIds: TDeleteFcuTenantIds) => {
  const queryString = tenantIds.map((id) => `tenantIds=${id}`).join('&');
  return request(FCU_TENANT_CRUD_URL + `?${queryString}`, {
    method: 'DELETE',
  });
};
