import { get } from "@/http/request";

export const fetchDictApi = (params: string) => get<ResultMessageOfString>("/StaticParams", { params });
