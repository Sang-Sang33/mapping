export interface IFcuTenantItem {
  id: string
  name: string
  displayName: string
}

export interface ICreateFcuTenantData {
  tenantId: IFcuTenantItem['id']
}

export type TDeleteFcuTenantIds = IFcuTenantItem['id'][]
