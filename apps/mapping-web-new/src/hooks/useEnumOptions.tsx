import { get } from "@packages/services"
import useOptions, { IConfig } from "./useOptions"

type TEnumName = "Enum3DLocationStatus" | 
"EnumAutoAllocationStatus" | 
"EnumAllotLocationMode" | 
"EnumAllotLocationProcessType" | 
"EnumAllotLocationSortMode" | 
"EnumAllotLocationType" | 
"EnumAreaState" | 
"EnumAreaType" | 
"EnumAuditStatus" | 
"EnumBusinessType" | 
"EnumCanvasAreaType" | 
"EnumCanvasType" | 
"EnumCombineOperationType" | 
"EnumCombineOption" | 
"EnumContainerCarryStatus" | 
"EnumContainerPosition" | 
"EnumCurrentRCLState" | 
"EnumDisplayType" | 
"EnumEntityState" | 
"EnumInboundType" | 
"EnumInvoiceStatus" | 
"EnumLocationStatus" | 
"EnumMessageReadState" | 
"EnumMessageState" | 
"EnumMessageType" | 
"EnumOutboundRequirementType" | 
"EnumParamType" | 
"EnumPositionType" | 
"EnumPostStatus" | 
"EnumQualityStatus" | 
"EnumQualityTestStatus" | 
"EnumReceiptStatus" | 
"EnumRequirementStatus" | 
"EnumSex" | 
"EnumShelvesType" | 
"EnumSortType" | 
"EnumStatusCode" | 
"EnumStocktakeExceptionType" | 
"EnumStocktakeRecordStatus" | 
"EnumStocktakeStatus" | 
"EnumStocktakeType" | 
"EnumSysReceivingBusinessType" | 
"EnumTaskAlarmType" | 
"EnumTaskExecuteType" | 
"EnumTaskStatus" | 
"EnumTaskType" | 
"EnumWavenumberLineStatus" | 
"EnumWavenumberStatus" | 
"EnumInventoryJournalType" | 
"EnumPropertyInputType" |
"EnumOutboundType"

export default function useEnumOptions(enumTypeName: TEnumName, config: IConfig<API.Int32SelectItem> ) {
    const api = () => get<API.Int32SelectItem[]>(`api/mapping/enum?enumTypeName=${enumTypeName}`)
    const result = useOptions(api, config)
    return result;
}