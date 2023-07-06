import { post } from "@/http/request";
import ApifoxModel from "./interface";
export const fetchUser = (params: any) => post<ApifoxModel>("/Auth/Login", { ...params });
