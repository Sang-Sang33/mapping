// @ts-ignore
import { get, post, del, put } from "@packages/services";

export const getCustomerList = () => get<API.ICustomer[]>('/api/v2/mapping/customer/whole-or-self');

export const savePaintingStatus = (params: { items: string }) => post('/api/v2/mapping/painting-status', params)

export const getPaintingStatus = () => get<Editor.IPaintingStatus>('/api/v2/mapping/painting-status');

export const getVehicleTypes = () => get<string[]>('/api/v2/mapping/vehicle-type');

export const saveSlot = (params: {slots: Slot[]}) => post('/api/v2/mapping/slot', params);

export const getSlot = () => get<Slot[]>('/api/v2/mapping/slot');