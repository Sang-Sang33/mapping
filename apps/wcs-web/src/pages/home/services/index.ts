
// services层  先暂时保留
import NRequest from "@/http/request";
const { get, post } = new NRequest({
	baseURL: import.meta.env.VITE_APP_REPORT
});
export const GetCurrentInventorySummary = () => get("/Summary/GetCurrentInventorySummary");

export const GetDailyTaskSummary = () => get("/Summary/GetDailyTaskSummary");

export const GetCurrentInventoryQualitySummary = () => get("/Summary/GetCurrentInventoryQualitySummary");

export const GetDailyWorkbenchTaskSummary = () => get("/Summary/GetDailyWorkbenchTaskSummary");

interface IgetDailyDataParams {
	reportDateFrom: string;
	reportDateTo: string;
}
export const GetReportInventoryDailyInOutList = (params: IgetDailyDataParams) =>
	post("/Daily/GetReportInventoryDailyInOutList", { ...params });

export const GetReportLocationDailyList = (params: IgetDailyDataParams) =>
	post("/Daily/GetReportLocationDailyList", { ...params });

export const GetCurrentLocationSummary = () => get("/Summary/GetCurrentLocationSummary");

export const GetAreaLocationSummary = () => get("/Summary/GetAreaLocationSummary");
