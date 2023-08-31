export const PAGINATION = { pageIndex: 1, pageSize: 100 };

export const getAreaLabel = (p: API.AreaInfoDTO) => `${p.areaCode}(${p.areaName})`;
export const getTunnelLabel = (p: API.TunnelInfoDTO) => `${p.tunnelCode}(${p.tunnelName})`;
export const getShelfLabel = (p: API.ShelfInfoDTO) => `${p.shelfCode}(${p.shelfName})`;
export const getLocationLabel = (p: API.LocationInfoDTO) => `${p.customCode}`;
export const getRouteLabel = (p: API.OutputRoutingInfoDTO) => `${p.code}(${p.name})`;
export const getLocationGroupLabel = (p: API.LocationGroupInfoDTO) => `${p.groupCode}`;

export type IOptionItem<T> = T & {
    value: string | number;
    label: string;
}

export type IAreaOption = IOptionItem<Editor.Area>;
export type IShelfOption = IOptionItem<Editor.Shelf>;
export type ITunnelOption = IOptionItem<Editor.Tunnel>;