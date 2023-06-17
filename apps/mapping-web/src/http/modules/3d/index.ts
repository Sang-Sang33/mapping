import { get } from "@/http/request";

export const fetch3DBaseDataApi = () => get<I3dBase>("/3d-data", {});

export const fetch3DGoodsDataApi = () => get<I3dGoods[]>("/3d-goods", {});