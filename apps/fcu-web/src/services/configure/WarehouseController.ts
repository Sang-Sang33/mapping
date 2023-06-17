import { request } from '@umijs/max';

const isProd = process.env.NODE_ENV === 'production';
const PROD_APP_API_MAP = { FCU_API: '', MAPPING_API: '' };
const { FCU_API, MAPPING_API } = isProd
  ? PROD_APP_API_MAP
  : window.__APP_API_MAP__ || __APP_API_MAP__;

export const getWarehouseList = async (
  tenantId: ConfigureApi.ITenantItem['id'],
) =>
  request<ConfigureApi.IWarehouseItem[]>(
    MAPPING_API + '/api/mapping/warehouse/warehouses/' + tenantId,
  );

const FCU_WAREHOUSE_CRUD_URL = FCU_API + '/api/fcu/warehouse';
export const getFcuWarehouseIdList = async (
  tenantId: ConfigureApi.ITenantItem['id'],
) =>
  request<ConfigureApi.IWarehouseItem['id'][]>(FCU_WAREHOUSE_CRUD_URL, {
    params: {
      tenantId,
    },
  });

export interface ICreateFcuWarehouseData {
  tenantId: ConfigureApi.ITenantItem['id'];
  warehouseId: ConfigureApi.IWarehouseItem['id'];
}
export const createFcuWarehouse = async (data: ICreateFcuWarehouseData) =>
  request(FCU_WAREHOUSE_CRUD_URL, {
    method: 'POST',
    data,
  });

export interface IDeleteFcuWarehouseParams {
  tenantId: ConfigureApi.ITenantItem['id'];
  warehouseIds: ConfigureApi.IWarehouseItem['id'][];
}
export const deleteFcuWarehouse = async ({
  tenantId,
  warehouseIds,
}: IDeleteFcuWarehouseParams) => {
  const queryString =
    warehouseIds.map((id) => `warehouseIds=${id}`).join('&') +
    `&tenantId=${tenantId}`;
  return request(FCU_WAREHOUSE_CRUD_URL + `?${queryString}`, {
    method: 'DELETE',
  });
};
