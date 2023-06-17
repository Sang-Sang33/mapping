import { get, post, del, put, authRequest } from '../http/request'

export const getCustomerList = () => get('/mapping/customer/whole-or-self')

export const getWarehouseList = (params: any) => get('/mapping/warehouse', params)

export const saveSlot = (params: any) => post('/mapping/slot', params)

export const saveTransferPosition = (params: any) => post('/mapping/transfer-position', params)

export const saveTempSlot = (params: any) => post('/mapping/painting-status', params)

export const getTempSlot = () => get('/mapping/painting-status')

export const getRcspoint = () => get('/mapping/rcs-point')

export const saveRcspoint = (params: any) => post('/mapping/rcs-point', params)

export const login = (params: any, config?: any) => authRequest.post('/connect/token', params, config || {})

export const getWarehouse = () => get('/mapping/warehouse')

export const editWarehouse = (params: any) => put('/mapping/warehouse', params)

export const delWarehouse = (params: any) => del('/mapping/warehouse', params)

export const addWarehouse = (params: any) => post('/mapping/warehouse', params)