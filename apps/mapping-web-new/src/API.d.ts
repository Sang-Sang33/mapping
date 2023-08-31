declare namespace API {
  type AddInvoiceDTO = {
    /** Id */
    id?: number;
    /** 发货单头编号 */
    invoiceCode?: string;
    /** 发货类型 */
    invoiceTypeId?: number;
    /** 搬运目标区域id */
    outboundAreaId?: number;
    qualityStatus?: EnumQualityStatus;
    /** 描述信息 */
    invoiceHeaderDescription?: string;
    /** 是否自动分配库存 */
    isAutoAllocation?: boolean;
    /** 发货单明细信息 */
    invoiceLineList?: AddInvoiceLineDTO[];
  };

  type AddInvoiceLineDTO = {
    /** Id */
    id?: number;
    /** 单行号 */
    invoiceLineNumber?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料批次号 */
    batchNumber?: string;
    /** 数量 */
    quantity?: number;
    /** 描述信息 */
    invoiceLineDescription?: string;
  };

  type AddQualityTestInfoDTO = {
    /** 主键Id */
    id?: number;
    /** 质检单号 */
    qualityTestCode?: string;
    /** 是否搬运 */
    isCarry?: boolean;
    /** 搬运目标区域 */
    targetAreaId?: number;
    /** 质检单描述 */
    qualityTestDescription?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 规格 */
    materialSize?: string;
    qualityStatus?: EnumQualityStatus;
    /** 抽检容器数量 */
    containerQuantity?: number;
  };

  type AddReceiptOrderDTO = {
    /** 收货单头Id */
    id?: number;
    /** 收货单头编号 */
    receiptCode?: string;
    /** 收货类型 */
    receiptTypeId?: number;
    /** 供应商 */
    supplierId?: number;
    /** 描述信息 */
    receiptHeaderDescription?: string;
    /** 收货单明细信息 */
    receiptLines?: ReceiptLineInfoDTO[];
  };

  type AddStocktakeByLocationDTO = {
    stocktakeInfo?: StocktakeInfoDTO;
    /** 货位ID集 */
    locationIdList?: number[];
  };

  type AddStocktakeByMaterialDTO = {
    stocktakeInfo?: StocktakeInfoDTO;
    /** 物料ID集 */
    materialIdList?: number[];
  };

  type AddStocktakeBySamplingDTO = {
    /** 盘点单号 */
    stocktakeCode?: string;
    /** 货位ID */
    locationId?: number;
    /** 物料档案ID */
    materialId?: number;
    /** 盘后库存 */
    adjustedQuantity?: number;
  };

  type AddWavenumberDTO = {
    /** 波次id */
    id?: number;
    /** 波次单头编号 */
    wavenumberCode?: string;
    /** 波次单名称 */
    wavenumberName?: string;
    /** 描述信息 */
    waveHeaderDescription?: string;
    /** 搬运目标区域 */
    toAreaId?: number;
    /** 发货单id */
    invoiceID?: number[];
  };

  type AllocateInventoryDTO = {
    /** 库存ID */
    inventoryId?: number;
    /** 分配数量 */
    allotQuantity?: number;
  };

  type AllocateInventoryDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: AllocateInventoryDTO[];
    statusCode?: EnumStatusCode;
  };

  type AllocationItemInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 出库需求ID */
    outboundRequirementId?: number;
    /** 库存ID */
    inventoryId?: number;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 库位ID */
    locationId?: number;
    /** 库位编号 */
    locationCode?: string;
    /** 分配数量 */
    quantity?: number;
  };

  type AllotLocationConditionInfoDTO = {
    warehouseId?: number;
    /** 主键，雪花ID */
    id?: number;
    /** 策略ID */
    allotLocationModeId?: number;
    /** 类名 */
    className?: string;
    /** 类名显示名称 */
    classDisplayName?: string;
    /** 属性名 */
    propertyName?: string;
    /** 属性显示名称 */
    propertyDisplayName?: string;
    /** 参数类型 */
    propertyType?: string;
    /** 参数值 */
    propertyValue?: string;
    /** 参数值显示名称 */
    propertyValueDisplayName?: string;
  };

  type AllotLocationModeInfoDTO = {
    warehouseId?: number;
    /** 主键，雪花ID */
    id?: number;
    /** 策略名称 */
    strategyName?: string;
    allotMode?: EnumAllotLocationMode;
    /** 条件集合 */
    conditionList?: AllotLocationConditionInfoDTO[];
  };

  type AllotLocationModeInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: AllotLocationModeInfoDTO[];
  };

  type AllotLocationModeInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: AllotLocationModeInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type AreaInfoDTO = {
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    height: number;
    /** 区域id */
    id: string;
    /** 区域编号（一位字母一位数字） */
    areaCode: string;
    /** 区域名称 */
    areaName: string;
    areaType: EnumAreaType;
    allotLocationProcessType: EnumAllotLocationProcessType;
    /** 区域描述 */
    areaDescribe: string;
  };

  type AreaInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: AreaInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type AreaLocationDTO = {
    /** 主键 */
    id?: number;
    /** 区域名称 */
    areaCode?: string;
    /** 区域别名 */
    areaName?: string;
    areaType?: EnumAreaType;
    /** 位置选项 */
    locationSelectItemList?: SelectItem[];
  };

  type AreaLocationDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: AreaLocationDTO[];
    statusCode?: EnumStatusCode;
  };

  type AreaLocationSummaryDTO = {
    /** 区域ID */
    areaId?: number;
    /** 区域编号 */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    /** 区域库位总数 */
    locationTotal?: number;
    /** 区域空货位数量 */
    emptyLocationTotal?: number;
    /** 区域空货位数量/库位总数 比例 */
    emptyLocationRatio?: number;
    /** 区域满托货位数量 */
    fullContainerLocationTotal?: number;
    /** 区域满托货位数量/库位总数 比例 */
    fullContainerLocationRatio?: number;
    /** 区域空托货位数量 */
    emptyContainerLocationTotal?: number;
    /** 区域空托货位数量/库位总数 比例 */
    emptyContainerLocationRatio?: number;
  };

  type AreaLocationSummaryDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: AreaLocationSummaryDTO[];
    statusCode?: EnumStatusCode;
  };

  type BatchLocationInfoDTO = {
    positionType: EnumPositionType;
    inboundType: EnumInboundType;
    /** 允许入库：1-允许、0-不允许 */
    allowStockIn: boolean;
    /** 允许出库：1-允许、0-不允许 */
    allowStockOut: boolean;
    /** 出库优先级 */
    outboundPriority: number;
    /** 长 */
    length: number;
    /** 宽 */
    width: number;
    /** 高 */
    height: number;
    /** 所属货架ID */
    shelfId: string;
    // areaId: string;
    // tunnelCode: string
    /** 布局属性 */
    locations: LocationLayoutDTO[];
  };

  type BooleanR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: boolean;
    statusCode?: EnumStatusCode;
  };

  type BooleanWCSResponseResult = {
    /** 接口执行结果是否成功（200代表执行成功） */
    status?: number;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: boolean;
    /** 是否还有后续任务，WCS以此判断是否释放当前小车空闲 */
    isNextTask?: boolean;
  };

  type ByteArrayR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: string;
    statusCode?: EnumStatusCode;
  };

  type CompletedTaskSummaryDTO = {
    /** 当天完成任务数 */
    dailyTotal?: number;
    /** 累计完成任务数 */
    grandTotal?: number;
  };

  type CompletedTaskSummaryDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: CompletedTaskSummaryDTO;
    statusCode?: EnumStatusCode;
  };

  type ContactsInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 客户/供应商编号 */
    contactCode?: string;
    /** 客户/供应商名称 */
    contactName?: string;
    /** 是否供应商:1-是,0-否 */
    isSupplier?: boolean;
    /** 是否客户:1-是,0-否 */
    isCustomer?: boolean;
    /** 机构名称 */
    organizationName?: string;
    /** 电话号码 */
    phoneNumber?: string;
    /** 电子邮件 */
    email?: string;
    /** 通讯地址 */
    address?: string;
    /** 描述信息 */
    contactDescription?: string;
  };

  type ContainerInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 容器类型ID */
    containerTypeId?: number;
    carryStatus?: EnumCarryStatus;
    /** 容器数量,码垛后数量 */
    containerQuantity?: number;
    /** 容器位置ID */
    locationId?: number;
    /** 是否启用 */
    isEnable?: boolean;
  };

  type ContainerInventoryDTO = {
    /** 容器ID */
    id?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 容器类型ID */
    containerTypeId?: number;
    /** 容器类型 */
    containerTypeName?: string;
    carryStatus?: EnumCarryStatus;
    /** 数量 */
    containerQuantity?: number;
    /** 容器位置ID */
    locationId?: number;
    /** 容器位置编号 */
    locationCode?: string;
    /** 容器位置自定义编号 */
    customCode?: string;
    /** 所属区域ID */
    areaId?: number;
    /** 区域编号 */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
  };

  type ContainerInventoryDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: ContainerInventoryDTO[];
  };

  type ContainerInventoryDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: ContainerInventoryDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type ContainerTypeInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 容器类型名称 */
    name?: string;
    /** 是否虚拟容器 */
    isVirtual?: boolean;
    /** 是否有容器条码（标识） */
    isHaveBarcode?: boolean;
    /** 容器条码规则（正则表达式） */
    barcodeRule?: string;
    /** 容器条码规则-最小长度 */
    barcodeMinLength?: number;
    /** 容器条码规则-最大长度 */
    barcodeMaxLength?: number;
    /** 容器尺寸-长度 */
    sizeLength?: number;
    /** 容器尺寸-宽度 */
    sizeWidth?: number;
    /** 容器尺寸-高度 */
    sizeHeight?: number;
    /** 组盘-是否允许物料在容器中混放 */
    allowMixed?: boolean;
    /** 容器分格-总数 */
    cellNumber?: number;
    /** 容器分格-行数 */
    cellRow?: number;
    /** 容器分格-列数 */
    cellColumn?: number;
    /** 组盘-容器分格-单格是否允许物料混放 */
    cellAllowMixed?: boolean;
    /** 图标-空托图标 */
    emptyIco?: string;
    /** 图标-满托图标 */
    fullIco?: string;
    /** 图标-半满图标 */
    halfFullIco?: string;
    /** 图标-空垛图标 */
    emptyStackIco?: string;
    /** 是否启用 */
    isEnable?: boolean;
  };

  type CurrentInventorySummaryDTO = {
    /** 当前任务数量 */
    taskTotal?: number;
    /** 满托盘数量 */
    fullContainerTotal?: number;
    /** 空托盘数量 */
    emptyContainerTotal?: number;
  };

  type CurrentInventorySummaryDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: CurrentInventorySummaryDTO;
    statusCode?: EnumStatusCode;
  };

  type CurrentLocationSummaryDTO = {
    /** 库位总数 */
    locationTotal?: number;
    /** 空货位数量 */
    emptyLocationTotal?: number;
    /** 空货位数量/库位总数 比例 */
    emptyLocationRatio?: number;
    /** 满托货位数量 */
    fullContainerLocationTotal?: number;
    /** 满托货位数量/库位总数 比例 */
    fullContainerLocationRatio?: number;
    /** 空托货位数量 */
    emptyContainerLocationTotal?: number;
    /** 空托货位数量/库位总数 比例 */
    emptyContainerLocationRatio?: number;
  };

  type CurrentLocationSummaryDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: CurrentLocationSummaryDTO;
    statusCode?: EnumStatusCode;
  };

  type CurrentTaskSummaryDTO = {
    /** 当前执行总任务 */
    total?: number;
    /** 当前入库任务数 */
    inTotal?: number;
    /** 当前出库任务数 */
    outTotal?: number;
    /** 当前越库任务数 */
    crossTotal?: number;
    /** 当前移库任务数 */
    moveTotal?: number;
  };

  type CurrentTaskSummaryDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: CurrentTaskSummaryDTO;
    statusCode?: EnumStatusCode;
  };

  type DailyTaskSummaryDTO = {
    /** 入库任务数量 */
    inTotal?: number;
    /** 出库任务数量 */
    outTotal?: number;
    /** 越库任务数量 */
    crossTotal?: number;
    /** 移库任务数量 */
    moveTotal?: number;
    /** 取消任务数量 */
    cancelTotal?: number;
  };

  type DailyTaskSummaryDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: DailyTaskSummaryDTO;
    statusCode?: EnumStatusCode;
  };

  type DailyWorkbenchTaskSummaryDTO = {
    /** 工作站ID */
    id?: string;
    /** 工作站货位号 */
    locationCode?: string;
    /** 工作站名称 */
    workbenchName?: string;
    /** 起点的任务数量 */
    fromTaskTotal?: number;
    /** 终点的任务数量 */
    toTaskTotal?: number;
  };

  type DailyWorkbenchTaskSummaryDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: DailyWorkbenchTaskSummaryDTO[];
    statusCode?: EnumStatusCode;
  };

  type deleteApiAreaDeleteParams = {
    /** 区域ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiContactsDeleteParams = {
    /** 客户/供应商 ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiContainerDeleteParams = {
    /** 容器档案ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiContainerTypeDeleteParams = {
    /** 容器类型ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiDictionaryDeleteDictionaryParams = {
    /** 字典ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiDictionaryDeleteDictionaryValueParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiMaterialDeleteParams = {
    /** 物料信息ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiMaterialItemDeleteParams = {
    /** 物料档案ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiMaterialPackagingDeleteParams = {
    /** 物料包装ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiMenuDeleteFunctionParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiMenuDeleteMenuParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiPermissionDeletePermissionInfoParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiRoleDeleteParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiRoutingDeleteParams = {
    /** 路径ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiShelfDeleteParams = {
    /** 货架ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiTunnelDeleteParams = {
    /** 巷道ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiUserDeleteParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiWarehouseDeleteParams = {
    /** 仓库ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type deleteApiWaveHeaderDeleteParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type DictionaryInfo = {
    warehouseId?: number;
    id?: number;
    parentId?: number;
    dictionaryName?: string;
    businessType?: EnumBusinessType;
    dictionaryValueType?: string;
    dictionaryRemark?: string;
    sortBy?: number;
    isDeleted?: boolean;
  };

  type DictionaryInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 父级ID,为0时是根节点 */
    parentId?: number;
    /** 字典名称 */
    dictionaryName?: string;
    businessType?: EnumBusinessType;
    /** 字典值类型 */
    dictionaryValueType?: string;
    /** 备注 */
    dictionaryRemark?: string;
    /** 排序 */
    sortBy?: number;
    /** 字典值列表 */
    dictionaryValueList?: DictionaryValueInfoDTO[];
  };

  type DictionaryInfoR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: DictionaryInfo;
    statusCode?: EnumStatusCode;
  };

  type DictionaryValueInfo = {
    warehouseId?: number;
    id?: number;
    dictionaryId?: number;
    dictionaryValue?: string;
    valueLabel?: string;
    isDefault?: boolean;
    isSystem?: boolean;
    dictionaryValueRemark?: string;
    sortBy?: number;
    isDeleted?: boolean;
  };

  type DictionaryValueInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 字典Id */
    dictionaryId?: number;
    /** 字典值 */
    dictionaryValue?: string;
    /** 字典值标签 */
    valueLabel?: string;
    /** 是否默认 */
    isDefault?: boolean;
    /** 是否系统保留值 */
    isSystem?: boolean;
    /** 备注 */
    dictionaryValueRemark?: string;
    /** 排序 */
    sortBy?: number;
  };

  type DictionaryValueInfoR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: DictionaryValueInfo;
    statusCode?: EnumStatusCode;
  };

  type Enum3DLocationStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  type EnumAllotLocationMode = 1 | 2;

  type EnumAllotLocationProcessType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

  type EnumAllotLocationSortMode = 1 | 2 | 3 | 4 | 5 | 6;

  type EnumAreaType = 1 | 2;

  type EnumAuditStatus = 0 | 1 | 2 | 3;

  type EnumAutoAllocationStatus = 1 | 2 | 3 | 4 | 5;

  type EnumBusinessType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  type EnumCarryStatus = 0 | 1 | 2 | 3 | 4;

  type EnumCombineOption = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  type EnumInboundType = 1 | 2 | 3;

  type EnumInventoryJournalType = 1 | 2 | 3 | 4;

  type EnumInvoiceStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  type EnumLocationStatus = 1 | 2 | 3 | 4 | 5 | 6;

  type EnumOutboundRequirementType = 1 | 2 | 3;

  type EnumParamType = 1 | 2 | 3 | 4;

  type EnumPositionType = 1 | 2 | 3;

  type EnumPostStatus = 1 | 2 | 3;

  type EnumPropertyInputType = 0 | 1 | 2;

  type EnumQualityStatus = 1 | 2 | 3;

  type EnumQualityTestStatus = 1 | 2 | 3 | 4 | 5;

  type EnumReceiptStatus = 1 | 2 | 3 | 4 | 5 | 6;

  type EnumRequirementStatus = 1 | 2 | 3 | 4 | 5;

  type EnumSex = 1 | 2;

  type EnumShelvesType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

  type EnumSortType = 1 | 2;

  type EnumStatusCode = 0 | 200 | 400 | 401 | 402 | 404 | 408 | 500 | 600 | 610 | 700 | 800;

  type EnumStocktakeRecordStatus = 0 | 1 | 2;

  type EnumStocktakeStatus = 1 | 2 | 3 | 4 | 5;

  type EnumStocktakeType = 1 | 2 | 3 | 4;

  type EnumSysReceivingBusinessType = 1 | 2 | 3 | 4 | 5 | 6;

  type EnumTaskAlarmType = 0 | 1 | 2 | 3;

  type EnumTaskExecuteType = 1 | 2 | 3;

  type EnumTaskStatus = 1 | 2 | 3 | 4 | 5 | 6;

  type EnumTaskType = 1 | 2 | 3 | 4;

  type EnumUnbindingType = 1 | 2;

  type EnumWavenumberStatus = 1 | 2 | 3 | 4 | 5 | 6;

  type FunctionInfoDTO = {
    /** 主键，雪花ID，新增为0，修改为确定的功能ID */
    id?: number;
    /** 所属菜单ID，从菜单数据选好，必选 */
    menuId?: number;
    /** 功能名称 */
    functionName?: string;
    /** 功能标题 */
    functionTitle?: string;
    /** 功能图标 */
    functionIcon?: string;
    /** 功能执行动作 */
    functionAction?: string;
    /** 功能排序 */
    functionSort?: number;
  };

  type getApiAreaGetAreaSelectItemListParams = {
    /** 区域类型：不传值返回所有，1-货位，2-工位 */
    areaType?: EnumAreaType;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiAreaGetByIdParams = {
    /** 区域ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiAuthForceUserLogoffParams = {
    userId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiAuthGetLoginUserListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiAuthGetLoginUserPermissionParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiAuthGetRefreshTokenParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiAuthLogoutParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiAuthRefreshTokenParams = {
    refreshToken?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContactsGetCustomerListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContactsGetImportTemplateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContactsGetSupplierListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContainerGetAllContainerSelectItemParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContainerGetByCodeParams = {
    /** 容器编号 */
    code?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContainerGetByIdParams = {
    /** 容器档案ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContainerGetContainerInventorySelectItemParams = {
    /** 指定位置，如果没有，返回所有入库的容器数据 */
    locationId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContainerGetContainerSelectItemParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiContainerTypeGetByIdParams = {
    /** 容器类型ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDailyCreateReportInventoryDailyParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDailyCreateReportLocationDailyParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDailyCreateReportTaskDailyParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDailyGetCompletedTaskSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDailyGetDailyJournalSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDailyGetReportInventoryDailyListParams = {
    /** 报表日期 */
    reportDate?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDailyGetReportLocationDailyListParams = {
    /** 报表日期 */
    reportDate?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDailyGetReportTaskDailyListParams = {
    /** 报表日期 */
    reportDate?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDictionaryGetDictionaryByIdParams = {
    /** 字典id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDictionaryGetDictionaryValueByIdParams = {
    /** 字典值ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDictionaryGetDictionaryValueListByBzTypeParams = {
    /** 字典业务类型 */
    bzType?: EnumBusinessType;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDictionaryGetDictionaryValueListByIdParams = {
    /** 字典Id */
    dictionaryId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiDictionaryGetDictionaryValueListByNameParams = {
    /** 字典名称 */
    dictionaryName?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiEnumGetAllEnumNameListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiEnumGetSelectItemListParams = {
    /** 枚举名称 */
    enumName?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiHomeGetLayerNavigationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiHomeGetLocationDetailByIdParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiHomeGetSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiHomeInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInboundStrategyDeleteModeParams = {
    /** 入库策略id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInboundStrategyDeleteRelationParams = {
    /** 关系id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInboundStrategyGetStrategyItemsParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderActiveParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderAutoAllocateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderCancelParams = {
    /** 发货单ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderCreateCarryTaskParams = {
    /** 分配明细Id */
    allocationId?: number;
    /** 目标库位 */
    targetLocation?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderGetAllocatedListParams = {
    /** 发货单明细ID */
    lineId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderGetContainerInventoryParams = {
    /** 拣选出库位置 */
    locationCode?: string;
    /** 发货单号 */
    invoiceCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderGetInventoryListParams = {
    /** 发货单明细ID */
    lineId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderGetInvoiceTypeListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderManualFinishParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiInvoiceHeaderSuggestInventoryListParams = {
    /** 发货单明细ID */
    lineId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiLocationDeleteParams = {
    /** 货位id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiLocationGetAreaLocationListParams = {
    /** 区域类型1:货位，2:工位 */
    areaType?: EnumAreaType;
    /** 区域ID */
    areaId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiLocationGetByIdParams = {
    /** 货位ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiLocationGetLocationByAreaIdParams = {
    /** 区域ID */
    areaId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiLocationGetLocationDetailByIdParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiLocationGetWorkbenchListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiLocationGroupDeleteParams = {
    /** 货位分组ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiLocationGroupGetByIdParams = {
    /** 货位分组ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiMaterialGetByCodeParams = {
    /** 物料编号 */
    code?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiMaterialGetImportTemplateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiMaterialGetMaterialModelListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiMaterialGetMaterialTypeListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiMenuGetMenusParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiNoticeGetAllNoticParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiOutboundRequirementAutomaticAllocationInQueneParams = {
    /** 出库需求ID */
    requirementId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiOutboundRequirementGetAllocationItemListParams = {
    /** 出库需求ID */
    requirementId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiOutboundRequirementGetWaitAllocationItemListParams = {
    /** 出库需求ID */
    requirementId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiOutboundRequirementOutboundCancelParams = {
    /** 出库需求ID */
    requirementId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiOutboundRequirementOutboundConfirmParams = {
    /** 出库需求ID */
    requirementId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiOutboundRequirementOutboundExecuteParams = {
    /** 出库需求ID */
    requirementId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiOutboundStrategyGetOutboundStrategyParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiPermissionGetPermissionByIdParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiPrintLabelPrintLocationLabelParams = {
    /** 库位ID */
    id?: number;
    /** 打印的标签数量 */
    count?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiPrintLabelPrintMaterialLabelParams = {
    /** 物料档案 */
    id?: number;
    /** 打印的标签数量 */
    count?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiPrintLabelPrintReceiptLineLabelParams = {
    /** 收货单行ID */
    id?: number;
    /** 打印的标签数量 */
    count?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiPrintLabelSendPrintMessageParams = {
    message?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestAllotQualityTestParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestCancelQualityTestParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestChangeQualityStatusParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 质检结果 */
    qualityStatus?: EnumQualityStatus;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestCompleteQualityTestParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 完成备注 */
    qualityTestRemark?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestExecuteQualityTestParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestGetMaterialInventorySummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestGetQualityTestInfoParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestGetQualityTestRecordListParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestGettSamplingContainerDetailParams = {
    /** 质检单 */
    qualityTestCode?: string;
    /** 工作台位置编号 */
    locationCode?: string;
    /** 容器编号 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestOutboundQualityTestParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 质检工位位置编号 */
    locationCode?: string;
    /** 容器编号（没有传空字符串） */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiQualityTestOutboundQualityTestWithQuantityParams = {
    /** 质检单号 */
    qualityTestCode?: string;
    /** 质检工位位置编号 */
    locationCode?: string;
    /** 容器编号（没有传空字符串） */
    containerCode?: string;
    /** 抽检出库数量 */
    quantity?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiReceiptHeaderActiveParams = {
    /** 收货单Id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiReceiptHeaderCancelParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiReceiptHeaderGetRecciptTypeListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiReceiptHeaderManualFinishParams = {
    /** 收货单Id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiRoutingGetByIdParams = {
    /** 路径ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiShelfGetByIdParams = {
    /** 货架id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeActivateStocktakeParams = {
    /** 盘点计划ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeAdjustedStocktakeParams = {
    /** 盘点计划ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeCancelStocktakeParams = {
    /** 盘点计划ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeCompleteStocktakeParams = {
    /** 盘点计划ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeCreateCarryTaskParams = {
    /** 盘点库位ID */
    id?: number;
    /** 目标位置 */
    targetLocation?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeGetAdjustedStocktakeParams = {
    /** 盘点计划ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeGetStocktakeCodeParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeGetStocktakeDetailParams = {
    /** 盘点计划ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStocktakeSetStocktakeExceptionParams = {
    /** 盘点计划号 */
    stocktakeCode?: string;
    /** 盘点位置号 */
    locationCode?: string;
    /** 容器编号,如果容器类型没有容器编号，传空字符串 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStorageInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStorageMoveParams = {
    /** 起始位置编号 */
    fromLocation?: string;
    /** 目标位置编号 */
    toLocation?: string;
    /** 容器编号 */
    containerCode?: string;
    /** 是否自动搬运 */
    isAutoCarry?: boolean;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiStorageOutStockConfirmParams = {
    /** 出库位置 */
    locationCode?: string;
    /** 容器编号，可空 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSummaryCurrentTaskSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSummaryGetAreaLocationSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSummaryGetCurrentInventoryQualitySummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSummaryGetCurrentInventorySummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSummaryGetCurrentLocationSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSummaryGetDailyTaskSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSummaryGetDailyWorkbenchTaskSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSummaryGetMaterialInventoryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSysConfigGetBarcodeParams = {
    /** 编号字符串 */
    codeStr?: string;
    /** 宽 */
    width?: number;
    /** 高 */
    height?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSysConfigGetQrCodeParams = {
    /** 编号字符串 */
    codeStr?: string;
    /** 宽 */
    width?: number;
    /** 高 */
    height?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSysConfigGetSysReceivingTypeSettingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSysConfigGetTvAccessTokenParams = {
    initKey?: string;
    userName?: string;
    pwd?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSysConfigWmsClearDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSysConfigWmsDbAppendTableParams = {
    /** 授权密钥 */
    initKey?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSysConfigWmsDbInitParams = {
    /** 授权密钥 */
    initKey?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiSysParamGetParamInfoParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiTaskCancelParams = {
    /** 任务ID */
    taskId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiTaskExportTaskParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiTaskInfoGetIncompleteInStockTaskInfoParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiTaskInfoGetIncompleteOutStockTaskInfoParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiTaskUpdatePostStatusParams = {
    /** 任务id */
    taskId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiTunnelGetByIdParams = {
    /** 巷道id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiUserGetUserInfoByIdParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiUserResetDefaultPwdParams = {
    /** 选中的用户ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiWarehouseGet3DLayoutDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiWarehouseGetByIdParams = {
    /** 仓库ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiWarehouseGetImportTemplateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiWarehouseGetLayerNavigationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiWaveHeaderGetWavenumberDetailParams = {
    /** 波次单Id */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getApiWaveLineGetReceiptLineByOrderNoParams = {
    waveCdoe?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getOpenapiLayoutGetAreaListParams = {
    maxId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getOpenapiLayoutGetLocationListParams = {
    maxId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getOpenapiLayoutGetTunnelListParams = {
    maxId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getOpenapiLayoutGetWarehouseListParams = {
    maxId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getOpenapiTaskGetTaskListParams = {
    /** 最大Id,小于等于0时获取全部 */
    maxId?: number;
    /** 返回任务数量，小于等于0时返回全部 */
    takeCount?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadCarryTaskCancelParams = {
    /** 任务ID */
    taskId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadCarryTaskMoveParams = {
    /** 起始位置编号 */
    fromLocation?: string;
    /** 目标位置编号 */
    toLocation?: string;
    /** 是否自动搬运 */
    isAutoCarry?: boolean;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadContainerInventoryEmptyTrayInApplyParams = {
    /** 申请入库位置编号 */
    locationCode?: string;
    /** 载具编号 */
    trayCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadContainerInventoryEmptyTrayOutApplyParams = {
    /** 呼叫位置编号 */
    locationCode?: string;
    /** 托盘类型ID */
    trayTypeId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadContainerInventoryGetAllContainerSelectItemParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadContainerInventoryGetContainerTypeListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadInboundInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadIndexGetLayerNavigationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadIndexGetLocationDetailByIdParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadIndexGetSummaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadIndexInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadOutboundCreateCarryTaskParams = {
    /** 分配明细Id */
    allocationId?: number;
    /** 目标库位 */
    targetLocation?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadOutboundGetAllocatedListParams = {
    /** 发货单明细ID */
    lineId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadOutboundGetContainerInventoryParams = {
    /** 拣选出库位置 */
    locationCode?: string;
    /** 发货单号 */
    invoiceCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadOutboundGetInventoryListParams = {
    /** 发货单明细ID */
    lineId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadOutboundInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadOutboundRequirementGetOutboundDetailsParams = {
    /** 出库需求号 */
    requirementCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadOutboundRequirementGetOutboundRequirementInfoParams = {
    /** 出库需求号 */
    requirementCode?: string;
    /** 物料号 */
    materialCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadOutboundSuggestInventoryListParams = {
    /** 发货单明细ID */
    lineId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadStocktakeAdjustedStocktakeParams = {
    /** 盘点计划ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadStocktakeCreateCarryTaskParams = {
    /** 盘点库位ID */
    id?: number;
    /** 目标位置 */
    targetLocation?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadStocktakeGetAdjustedStocktakeParams = {
    /** 盘点计划ID */
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadStocktakeGetStocktakeCodeParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadStocktakeGetStocktakeRecordByLocationParams = {
    /** 盘点库位ID */
    stocktakeLocationId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadStocktakeGetStocktakingListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadStocktakeInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadWaveHeaderGetOutboundDetailsParams = {
    /** 波次单号 */
    wavenumberCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPadWaveHeaderGetWavenumberLineInfoParams = {
    /** 波次单号 */
    wavenumberCode?: string;
    /** 物料号 */
    materialCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaEmptyTrayOutApplyParams = {
    /** 呼叫位置编号 */
    locationCode?: string;
    /** 托盘类型ID */
    trayTypeId?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaGetContainerTypeListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaGetInventoryQuantityParams = {
    /** 盘点位置 */
    locationCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 容器编号 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaGetLocationDetailByCodeParams = {
    locationCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaGetLocationDetailByIdParams = {
    id?: number;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaGetStocktakeCodeParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaGetUnfinishInboundByMaterialCodeParams = {
    /** 物料编号 */
    materialCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaGetUnfinishOutboundByMaterialCodeParams = {
    /** 拣选位置 */
    locationCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 容器编号 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaGetUnfinishStocktakeByMaterialCodeParams = {
    /** 盘点位置 */
    locationCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 容器编号 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaInStockApplyParams = {
    /** 申请入库起始位置 */
    fromLocationCode?: string;
    /** 托盘条码,可空,如果不传值则不校验起始位置上的托盘条码 */
    containerCode?: string;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type getPdaMoveParams = {
    /** 起始位置编号 */
    fromLocation?: string;
    /** 目标位置编号 */
    toLocation?: string;
    /** 是否自动搬运 */
    isAutoCarry?: boolean;
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type GetWeatherForecastParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type GraphicCodeDTO = {
    /** 图形码（条码、图形码） */
    graphicCode?: string;
    /** 条码图片Base64编号字符串 */
    base64String?: string;
  };

  type GraphicCodeDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: GraphicCodeDTO[];
    statusCode?: EnumStatusCode;
  };

  type GraphicCodeOptDTO = {
    /** 编号集合 */
    codeList?: string[];
    /** 宽 */
    width?: number;
    /** 高 */
    height?: number;
  };

  type GroupLocationDTO = {
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    height: number;
    /** 货位ID */
    id: number;
    /** 货位编号 */
    locationCode: string;
    /** 货位编号（自定义） */
    customCode: string;
  };

  type Int32SelectItem = {
    /** 选项ID */
    itemId?: number;
    /** 选项值 */
    itemValue?: string;
    /** 选项名称 */
    itemName?: string;
  };

  type Int32SelectItemListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: Int32SelectItem[];
    statusCode?: EnumStatusCode;
  };

  type InventoryDailyInOutDTO = {
    /** 库存日结报表数据ID */
    id?: string;
    /** 报表日期 */
    reportDate?: string;
    /** 入库物料总数 */
    inTotal?: number;
    /** 出库物料总数 */
    outTotal?: number;
  };

  type InventoryDailyInOutDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: InventoryDailyInOutDTO[];
    statusCode?: EnumStatusCode;
  };

  type InventoryJournalDTO = {
    /** 库存id */
    inventoryId?: number;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 容器类型ID */
    containerTypeId?: number;
    /** 容器类型 */
    containerTypeName?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料档案ID */
    materialItemId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 单位 */
    packagingName?: string;
    qualityStatus?: EnumQualityStatus;
    /** 批次 */
    batchNumber?: string;
    /** 有效期天数 */
    expiresDays?: number;
    journalType?: EnumInventoryJournalType;
    /** 流水ID */
    journalId?: number;
    /** 流水数量，正数入库、盘盈、负数出库、盘亏 */
    changeQuantity?: number;
    /** 创建时间 */
    createTime?: string;
    /** 操作位置编号 */
    locationCode?: string;
    /** 位置编号(自定义) */
    customCode?: string;
  };

  type InventoryJournalDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: InventoryJournalDTO[];
  };

  type InventoryJournalDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: InventoryJournalDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type InventoryQualityStatusDTO = {
    /** 库存ID */
    inventoryId?: number[];
    /** 质量状态 */
    qualityStatus?: number;
  };

  type InventoryQualitySummaryDTO = {
    /** 当前库存总数 */
    inventoryTotal?: number;
    /** 待检库存总数 */
    unCheckedTotal?: number;
    /** 待检百分比 */
    unCheckedRatio?: number;
    /** 良品总数 */
    qualifiedTotal?: number;
    /** 良品百分比 */
    qualifiedRatio?: number;
    /** 不良品总数 */
    unqualifiedTotal?: number;
    /** 不良品百分比 */
    unqualifiedRatio?: number;
  };

  type InventoryQualitySummaryDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: InventoryQualitySummaryDTO;
    statusCode?: EnumStatusCode;
  };

  type InvoiceAllocatedDTO = {
    /** 发货单明细ID */
    invoiceLineId?: number;
    /** 库存ID */
    inventoryId?: number;
    /** 容器ID */
    containerId?: number;
    /** 分配数量 */
    quantity?: number;
  };

  type JournalSummaryDTO = {
    /** 报告起始日期 */
    reportDateFrom?: string;
    /** 报告截止日期 */
    reportDateTo?: string;
    /** 入库数量 */
    inboundQuantity?: number;
    /** 出库数量 */
    outboundQuantity?: number;
    /** 盘盈数量 */
    profitQuantity?: number;
    /** 盘亏数量 */
    lossQuantity?: number;
  };

  type JournalSummaryDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: JournalSummaryDTO;
    statusCode?: EnumStatusCode;
  };

  type LayerNavigationDTO = {
    /** id，等于0表示总览 */
    id?: string;
    /** 层 */
    layer?: number;
    /** 区 */
    areaId?: number;
    /** 显示名称 */
    displayName?: string;
    /** 导航子级 */
    subItemList?: LayerNavigationDTO[];
  };

  type LayerNavigationDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: LayerNavigationDTO[];
    statusCode?: EnumStatusCode;
  };

  type PostLocationGroupInfoDTO = {
    /** 主键，雪花ID */
    id: string;
    /** 货位分组编号 */
    groupCode: string;
    /** 描述 */
    description: string;
    /** 货位分组颜色 */
    groupColor: string;
    /** 启用状态 */
    isEnable: boolean;
    /** 分组货位总数 */
    /** 货位分组矩形范围内货位 */
    locationIds: string[];
  }

  type LocationGroupInfoDTO = {
    /** 主键，雪花ID */
    id: string;
    /** 货位分组编号 */
    groupCode: string;
    /** 描述 */
    description: string;
    /** 货位分组颜色 */
    groupColor: string;
    /** 启用状态 */
    isEnable: boolean;
    /** 分组货位总数 */
    locationCount?: number;
    /** 货位分组矩形范围内货位 */
    locations: GroupLocationDTO[];
  };

  type LocationGroupInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: LocationGroupInfoDTO[];
  };

  type LocationGroupInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: LocationGroupInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type LocationGroupInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: LocationGroupInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type LocationInfoDTO = {
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    height: number;
    warehouseId: number;
    /** 主键 */
    id: string;
    /** 货位编号 */
    locationCode: string;
    /** 货位编号（自定义） */
    customCode: string;
    /** 所属区域ID */
    areaId: string;
    /** 所属巷道ID */
    tunnelCode: string;
    /** 所属货架ID */
    shelfId: string;
    positionType: EnumPositionType;
    inboundType: EnumInboundType;
    /** 允许入库：1-允许、0-不允许 */
    allowStockIn: boolean;
    /** 允许出库：1-允许、0-不允许 */
    allowStockOut: boolean;
    /** 出库优先级 */
    outboundPriority: number;
  };

  type LocationLayoutDTO = {
    /** 货位ID */
    id: string;
    /** 原点坐标x */
    x: number;
    /** 原点坐标y */
    y: number;
    /** 原点坐标z */
    z: number;
    /** 货位编号 */
    locationCode: string;
  };

  type LoginModel = {
    /** 登录账号 */
    userName?: string;
    /** 登录密码 */
    password?: string;
  };

  type LoginUserInfo = {
    /** 用户ID */
    id?: string;
    /** 是否管理员 */
    isAdmin?: boolean;
    /** 用户名 */
    userName?: string;
    /** 真实姓名 */
    realName?: string;
    /** 用户头像 */
    avator?: string;
    /** 登录时间 */
    loginTime?: string;
  };

  type LoginUserInfoListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: LoginUserInfo[];
    statusCode?: EnumStatusCode;
  };

  type ManualFinishTaskDTO = {
    /** 任务ID */
    id?: number;
    /** 放货的目标位置，为空时，取任务的目标位置 */
    targetLocation?: string;
  };

  type MaterialContianerInventoryDTO = {
    /** 物料ID */
    materialId?: number;
    /** 物料档案ID */
    materialItemId?: number;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 容器类型ID */
    containerTypeId?: number;
    /** 容器类型 */
    containerTypeName?: string;
    positionType?: EnumPositionType;
    /** 位置编号 */
    locationCode?: string;
    /** 位置编号（自动定义） */
    customCode?: string;
    /** 排-列-层 */
    positionAlias?: string;
    /** 区域编号 */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    /** 库存数量 */
    quantity?: number;
  };

  type MaterialInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料类型ID */
    materialTypeId?: number;
    /** 物料型号ID */
    materialModelId?: number;
    /** 物料最小包装 ID */
    skuPackagingId?: number;
    defaultQualityStatus?: EnumQualityStatus;
    /** 规格 */
    materialSize?: string;
    /** 有效期(天数) */
    expiresDays?: number;
    /** 有效期(天数)预警，新加字段 */
    expiresDaysNotice?: number;
    /** 最低库存预警，新加字段 */
    stockMinNotice?: number;
    /** 最高库存预警，新加字段 */
    stockMaxNotice?: number;
    /** 是否有物料标识:1-有,0-没有 */
    hasMaterialSign?: boolean;
    /** 物料标识是否唯一:1-是,0-不是 */
    isUniqueSign?: boolean;
    /** 是否允许混盘:1-允许,0-不允许 */
    isMixedPallet?: boolean;
    /** 描述信息 */
    materialDescription?: string;
  };

  type MaterialInventoryDTO = {
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 单位 */
    packagingName?: string;
    /** 库存数量 */
    quantity?: number;
    /** 库存明细 */
    inventoryList?: MaterialContianerInventoryDTO[];
  };

  type MaterialInventoryDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: MaterialInventoryDTO[];
    statusCode?: EnumStatusCode;
  };

  type MaterialInventoryDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: MaterialInventoryDTO[];
  };

  type MaterialInventoryDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: MaterialInventoryDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type MaterialInventorySummaryDTO = {
    /** 唯一标识 */
    uid?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 批次号 */
    batchNumber?: string;
    qualityStatus?: EnumQualityStatus;
    /** 库存数 */
    quantity?: number;
  };

  type MaterialInventorySummaryDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: MaterialInventorySummaryDTO[];
    statusCode?: EnumStatusCode;
  };

  type MaterialItemInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 物料档案收货标识 */
    receivingCode?: string;
    /** 物料标识 */
    materialUID?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料类型ID */
    materialTypeId?: number;
    /** 物料类型名称 */
    materialTypeName?: string;
    /** 物料型号ID */
    materialModelId?: number;
    /** 物料型号名称 */
    materialModelName?: string;
    /** 物料最小包装 ID */
    skuPackagingId?: number;
    /** 规格 */
    materialSize?: string;
    qualityStatus?: EnumQualityStatus;
    /** 有效期(天数) */
    expiresDays?: number;
    /** 收货日期 */
    receivingDate?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 收货区域 */
    areaId?: number;
    /** 收货位置（工作台编号、货位编号） */
    locationCode?: string;
    /** 收货数量 */
    quantity?: number;
    /** 供应商ID,ContactsInfo表主键 */
    supplierId?: number;
    /** 收货单号 */
    receiptCode?: string;
    /** 收货单行号 */
    receiptLineNumber?: string;
    /** 收货单行ID */
    receiptLineId?: number;
    /** 描述信息 */
    materialItemDescription?: string;
  };

  type MaterialPackagingInfo = {
    id?: number;
    packagingCode?: string;
    packagingName?: string;
    isSkuPackaging?: boolean;
    unitQuantity?: number;
    packagingDescription?: string;
    isDeleted?: boolean;
  };

  type MaterialPackagingInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 包装编号 */
    packagingCode?: string;
    /** 包装名称（单位名称） */
    packagingName?: string;
    /** 是否最小包装 */
    isSkuPackaging?: boolean;
    /** 单位数量 */
    unitQuantity?: number;
    /** 描述信息 */
    packagingDescription?: string;
  };

  type MaterialPackagingInfoPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: MaterialPackagingInfo[];
  };

  type MaterialPackagingInfoPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: MaterialPackagingInfoPageResult;
    statusCode?: EnumStatusCode;
  };

  type MenuInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 父级菜单ID,为0时是菜单根节点 */
    parentId?: number;
    /** 所属系统编号 */
    systemCode?: string;
    /** 菜单名称 */
    menuName?: string;
    /** 菜单标题 */
    menuTitle?: string;
    /** vue组件名称 */
    vueComponent?: string;
    /** 菜单（页面）地址 */
    menuUrl?: string;
    /** 菜单图标 */
    menuIcon?: string;
    /** 菜单排序 */
    menuSort?: number;
    /** 多语言标识 */
    menuLanguageSign?: string;
    /** 功能权限 */
    functionList?: FunctionInfoDTO[];
  };

  type ModifyUserPwdDTO = {
    /** 新密码 */
    newPassword?: string;
    /** 原密码 */
    oldPassword?: string;
  };

  type NoticeDTO = {
    /** 消息内容 */
    message?: string;
    /** 通知类型（1、通知  2、警告） */
    type?: number;
  };

  type NoticeDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: NoticeDTO[];
    statusCode?: EnumStatusCode;
  };

  type OperateWaveOrderDTO = {
    /** 单据Id */
    id?: number;
  };

  type OutboundRequirementInfoDTO = {
    /** 物料Id */
    materialId?: number;
    /** 物料型号Id */
    materialModelId?: number;
    /** 规格 */
    materialSize?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 物料数量 */
    quantity?: number;
    /** 出库区域 */
    outboundAreaId?: number;
    qualityStatus?: EnumQualityStatus;
  };

  type OutboundStrategyDTO = {
    /** 是否校验质量状态，默认否 */
    boolQualityStatus?: boolean;
    /** 是否校验批次号，默认否 */
    boolBatchNumber?: boolean;
    /** 库存不足是否自动分配 */
    boolNotInventoryAllot?: boolean;
    sortTypeReceiptDate?: EnumSortType;
  };

  type OutboundStrategyDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutboundStrategyDTO;
    statusCode?: EnumStatusCode;
  };

  type Output3DLayoutDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    /** 仓库id */
    id?: number;
    /** 仓库编号 */
    warehouseCode?: string;
    /** 仓库名称 */
    warehouseName?: string;
    /** 仓库别名 */
    aliasName?: string;
    /** 仓库描述 */
    warehouseDescribe?: string;
    /** 区域 */
    areaList?: OutputAreaInfoDTO[];
    /** 路径 */
    routingList?: OutputRoutingInfoDTO[];
    /** 巷道 */
    tunnelList?: OutputTunnelInfoDTO[];
    /** 货架 */
    shelfList?: OutputShelfInfoDTO[];
    /** 货位 */
    locationList?: OutputLocationTileDTO[];
  };

  type Output3DLayoutDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: Output3DLayoutDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputAllocationItemInfoDTO = {
    /** 主键ID */
    id?: number;
    /** 出库需求ID */
    outboundRequirementId?: number;
    /** 库存ID */
    inventoryId?: number;
    /** 已分配数量 */
    quantity?: number;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 库位ID/工作台ID */
    locationId?: number;
    /** 容器库位编号 */
    locationCode?: string;
    /** 库位编号（自动义） */
    customCode?: string;
    /** 容器所处区域 */
    areaId?: number;
    /** 容器所处区域编号 */
    areaCode?: string;
    /** 容器所处区域 */
    areaName?: string;
    qualityStatus?: EnumQualityStatus;
    /** 物料编号 */
    materialCode?: string;
    /** 收货日期 */
    receivingDate?: string;
    /** 是否拣选完成 */
    isPickingFinish?: boolean;
    /** 拣选数量 */
    pickingQuantity?: number;
    /** 是否取消 */
    isCancel?: boolean;
  };

  type OutputAllocationItemInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputAllocationItemInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputAreaInfoDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    warehouseId?: number;
    /** 区域id */
    id?: string;
    /** 区域编号 */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    areaType?: EnumAreaType;
    allotLocationProcessType?: EnumAllotLocationProcessType;
    /** 区域描述 */
    areaDescribe?: string;
    /** 所属仓库名字 */
    warehouseName?: string;
  };

  type OutputAreaInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputAreaInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputAreaInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputAreaInfoDTO[];
  };

  type OutputAreaInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputAreaInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputContactsInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 客户/供应商编号 */
    contactCode?: string;
    /** 客户/供应商名称 */
    contactName?: string;
    /** 是否供应商:1-是,0-否 */
    isSupplier?: boolean;
    /** 是否客户:1-是,0-否 */
    isCustomer?: boolean;
    /** 机构名称 */
    organizationName?: string;
    /** 电话号码 */
    phoneNumber?: string;
    /** 电子邮件 */
    email?: string;
    /** 通讯地址 */
    address?: string;
    /** 描述信息 */
    contactDescription?: string;
    /** 是否删除:1-已删除、0-未删除 */
    isDeleted?: boolean;
  };

  type OutputContactsInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputContactsInfoDTO[];
  };

  type OutputContactsInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputContactsInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputContainerInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 容器编号 */
    containerCode?: string;
    /** 容器类型ID */
    containerTypeId?: string;
    carryStatus?: EnumCarryStatus;
    /** 容器数量,码垛后数量 */
    containerQuantity?: number;
    /** 容器位置ID */
    locationId?: number;
    /** 容器位置编号 */
    locationCode?: string;
    /** 是否启用 */
    isEnable?: boolean;
    /** 容器类型名称 */
    containerTypeName?: string;
    /** 是否虚拟容器 */
    containerTypeIsVirtual?: boolean;
    /** 是否有容器条码（标识） */
    containerTypeIsHaveBarcode?: boolean;
    /** 容器条码规则（正则表达式） */
    containerTypeBarcodeRule?: string;
    /** 容器条码规则-最小长度 */
    containerTypeBarcodeMinLength?: number;
    /** 容器条码规则-最大长度 */
    containerTypeBarcodeMaxLength?: number;
    /** 容器尺寸-长度 */
    containerTypeSizeLength?: number;
    /** 容器尺寸-宽度 */
    containerTypeSizeWidth?: number;
    /** 容器尺寸-高度 */
    containerTypeSizeHeight?: number;
    /** 组盘-是否允许物料在容器中混放 */
    containerTypeAllowMixed?: boolean;
    /** 容器分格-总数 */
    containerTypeCellNumber?: number;
    /** 容器分格-行数 */
    containerTypeCellRow?: number;
    /** 容器分格-列数 */
    containerTypeCellColumn?: number;
    /** 组盘-容器分格-单格是否允许物料混放 */
    containerTypeCellAllowMixed?: boolean;
    /** 图标-空托图标 */
    containerTypeEmptyIco?: string;
    /** 图标-满托图标 */
    containerTypeFullIco?: string;
    /** 图标-半满图标 */
    containerTypeHalfFullIco?: string;
    /** 图标-空垛图标 */
    containerTypeEmptyStackIco?: string;
  };

  type OutputContainerInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputContainerInfoDTO[];
  };

  type OutputContainerInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputContainerInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputContainerInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputContainerInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputContainerInventoryDTO = {
    /** 库存ID */
    id?: number;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 批次号 */
    batchNumber?: string;
    qualityStatus?: EnumQualityStatus;
    /** 当前数量 */
    currentQuantity?: number;
    /** 有效期（天） */
    expiresDays?: number;
    /** 收货日期 */
    receivingDate?: string;
  };

  type OutputContainerTypeInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 容器类型名称 */
    name?: string;
    /** 是否虚拟容器 */
    isVirtual?: boolean;
    /** 是否有容器条码（标识） */
    isHaveBarcode?: boolean;
    /** 容器条码规则（正则表达式） */
    barcodeRule?: string;
    /** 容器条码规则-最小长度 */
    barcodeMinLength?: number;
    /** 容器条码规则-最大长度 */
    barcodeMaxLength?: number;
    /** 容器尺寸-长度 */
    sizeLength?: number;
    /** 容器尺寸-宽度 */
    sizeWidth?: number;
    /** 容器尺寸-高度 */
    sizeHeight?: number;
    /** 组盘-是否允许物料在容器中混放 */
    allowMixed?: boolean;
    /** 容器分格-总数 */
    cellNumber?: number;
    /** 容器分格-行数 */
    cellRow?: number;
    /** 容器分格-列数 */
    cellColumn?: number;
    /** 组盘-容器分格-单格是否允许物料混放 */
    cellAllowMixed?: boolean;
    /** 图标-空托图标 */
    emptyIco?: string;
    /** 图标-满托图标 */
    fullIco?: string;
    /** 图标-半满图标 */
    halfFullIco?: string;
    /** 图标-空垛图标 */
    emptyStackIco?: string;
    /** 是否启用 */
    isEnable?: boolean;
  };

  type OutputContainerTypeInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputContainerTypeInfoDTO[];
  };

  type OutputContainerTypeInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputContainerTypeInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputContainerTypeInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputContainerTypeInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputDictionaryInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 字典名称 */
    dictionaryName?: string;
    businessType?: EnumBusinessType;
    /** 字典值类型 */
    dictionaryValueType?: string;
    /** 备注 */
    dictionaryRemark?: string;
    /** 排序 */
    sortBy?: number;
    /** 字典值 */
    dictionaryValueList?: OutputDictionaryValueInfoDTO[];
  };

  type OutputDictionaryInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputDictionaryInfoDTO[];
  };

  type OutputDictionaryInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputDictionaryInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputDictionaryValueInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 字典Id */
    dictionaryId?: number;
    /** 字典值 */
    dictionaryValue?: string;
    /** 字典值标签 */
    valueLabel?: string;
    /** 是否默认 */
    isDefault?: boolean;
    /** 是否系统保留值 */
    isSystem?: boolean;
    /** 备注 */
    dictionaryValueRemark?: string;
    /** 排序 */
    sortBy?: number;
  };

  type OutputDictionaryValueInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputDictionaryValueInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputDictionaryValueInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputDictionaryValueInfoDTO[];
  };

  type OutputDictionaryValueInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputDictionaryValueInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputFunctionInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 所属菜单ID */
    menuId?: number;
    /** 功能名称 */
    functionName?: string;
    /** 功能标题 */
    functionTitle?: string;
    /** 功能图标 */
    functionIcon?: string;
    /** 功能执行动作 */
    functionAction?: string;
    /** 功能排序 */
    functionSort?: number;
  };

  type OutputGroupParamInfoDTO = {
    group?: string;
    info?: OutputSysParamInfoDTO[];
  };

  type OutputGroupParamInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputGroupParamInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputInventoryInfoDTO = {
    /** 库存id */
    id?: number;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 容器类型ID */
    containerTypeId?: number;
    /** 容器类型 */
    containerTypeName?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料档案ID */
    materialItemId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 单位 */
    packagingName?: string;
    qualityStatus?: EnumQualityStatus;
    /** 批次 */
    batchNumber?: string;
    /** 有效期天数 */
    expiresDays?: number;
    /** 物料标识 */
    materialUID?: string;
    positionType?: EnumPositionType;
    /** 位置编号 */
    locationCode?: string;
    /** 位置编号（自动定义） */
    customCode?: string;
    /** 排-列-层 */
    positionAlias?: string;
    /** 区域编号 */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    /** 物料入库数量 */
    inQuantity?: number;
    /** 物料出库数量 */
    outQuantity?: number;
    /** 当前物料数量 */
    currentQuantity?: number;
    /** 分配锁定的数量 */
    lockedQuantity?: number;
    /** 可分配数量 */
    availableQuantity?: number;
    /** 分配数量 */
    quantity?: number;
    /** 是否解盘,1-已解盘，0-未解盘 */
    isDismiss?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 收货单行号 */
    receiptLineNumber?: string;
    /** 收货单号 */
    receiptCode?: string;
    /** 收货单详情 */
    receiptDescription?: string;
    /** 收货时间 */
    receivingDate?: string;
    /** 供应商名称 */
    supplierName?: string;
  };

  type OutputInventoryInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputInventoryInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputInventoryInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputInventoryInfoDTO[];
  };

  type OutputInventoryInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputInventoryInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputInvoiceHeaderDTO = {
    /** 发货单Id */
    id?: number;
    /** 发货单头编号 */
    invoiceCode?: string;
    /** 发货类型Id */
    invoiceTypeId?: number;
    /** 发货类型 */
    invoiceTypeName?: string;
    /** 出库区域id */
    outboundAreaId?: number;
    /** 出库区域 */
    outboundAreaName?: string;
    invoiceStatus?: EnumInvoiceStatus;
    qualityStatus?: EnumQualityStatus;
    /** 是否自动分配库存 */
    isAutoAllocation?: boolean;
    /** 是否波次 */
    isWaveTime?: boolean;
    /** 波次单号 */
    wavenumberCode?: string;
    /** 是否需要审核（默认否） */
    isNeedAudit?: boolean;
    /** 审核人 */
    auditUserName?: string;
    auditStatus?: EnumAuditStatus;
    /** 审核时间 */
    auditTime?: string;
    /** 描述信息 */
    invoiceHeaderDescription?: string;
    /** 创建人 */
    createName?: string;
    /** 创建时间 */
    createTime?: string;
    /** 单行列表 */
    invoiceLineList?: OutputInvoiceLineDTO[];
  };

  type OutputInvoiceHeaderDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputInvoiceHeaderDTO[];
  };

  type OutputInvoiceHeaderDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputInvoiceHeaderDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputInvoiceLineDTO = {
    /** 发货单行Id */
    id?: number;
    /** 发货单号 */
    invoiceCode?: string;
    /** 发货单行号 */
    invoiceLineNumber?: string;
    invoiceLineStatus?: EnumInvoiceStatus;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 物料类型 */
    materialTypeName?: string;
    /** 物料型号 */
    materialModelName?: string;
    /** 物料批次号 */
    batchNumber?: string;
    /** 应发数量 */
    quantity?: number;
    /** 已发数量 */
    outboundQuantity?: number;
    /** 描述信息 */
    invoiceLineDescription?: string;
  };

  type OutputLayerTileDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    /** 仓库id */
    id?: number;
    /** 仓库编号 */
    warehouseCode?: string;
    /** 仓库名称 */
    warehouseName?: string;
    /** 仓库别名 */
    aliasName?: string;
    /** 仓库描述 */
    warehouseDescribe?: string;
    /** 层 */
    locationLayer?: number;
    /** 区域 */
    areaList?: OutputAreaInfoDTO[];
    /** 路径 */
    routingList?: OutputRoutingInfoDTO[];
    /** 巷道 */
    tunnelList?: OutputTunnelInfoDTO[];
    /** 货架 */
    shelfList?: OutputShelfInfoDTO[];
    /** 货位 */
    locationList?: OutputLocationTileDTO[];
  };

  type OutputLayerTileDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputLayerTileDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputLocationDetailDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    warehouseId?: number;
    /** 主键，雪花ID */
    id?: number;
    /** 货位编号(区号两位，排、列、层三位数字，深位两位数字，中间用-隔开) */
    locationCode?: string;
    /** 货位编号（自定义） */
    customCode?: string;
    /** 所属区域ID */
    areaId?: number;
    /** 所属巷道ID */
    tunnelId?: number;
    /** 货架Id */
    shelfId?: number;
    positionType?: EnumPositionType;
    inboundType?: EnumInboundType;
    /** 允许入库：1-允许、0-不允许 */
    allowStockIn?: boolean;
    /** 允许出库：1-允许、0-不允许 */
    allowStockOut?: boolean;
    /** 报警状态（是否报警）:1-报警、0-正常 */
    isAlarm?: boolean;
    /** 是否盘点中：1-盘点中、0-未盘点 */
    isStocktaking?: boolean;
    locationStatus?: EnumLocationStatus;
    /** 库位空满状态：1-满、0-空 */
    isFull?: boolean;
    /** 货位排 */
    locationRow?: number;
    /** 货位列 */
    locationColumn?: number;
    /** 货位层 */
    locationLayer?: number;
    /** 货位深 */
    locationDepth?: number;
    /** 出库优先级 */
    outboundPriority?: number;
    /** 所属仓库名称 */
    warehouseName?: string;
    /** 区域编号（一位字母一位数字） */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    /** 巷道编号 */
    tunnelCode?: string;
    /** 巷道名称 */
    tunnelName?: string;
    /** 货架编号（两位字符） */
    shelfCode?: string;
    /** 货架名称 */
    shelfName?: string;
    /** 库存 */
    inventoryList?: OutputContainerInventoryDTO[];
  };

  type OutputLocationDetailDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputLocationDetailDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputLocationInfoDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    warehouseId?: number;
    /** 主键，雪花ID */
    id?: string;
    /** 货位编号(区号两位，排、列、层三位数字，深位两位数字，中间用-隔开) */
    locationCode?: string;
    /** 货位编号（自定义） */
    customCode?: string;
    /** 所属区域ID */
    areaId?: number;
    /** 所属巷道ID */
    tunnelId?: number;
    /** 货架Id */
    shelfId?: number;
    positionType?: EnumPositionType;
    inboundType?: EnumInboundType;
    /** 允许入库：1-允许、0-不允许 */
    allowStockIn?: boolean;
    /** 允许出库：1-允许、0-不允许 */
    allowStockOut?: boolean;
    /** 报警状态（是否报警）:1-报警、0-正常 */
    isAlarm?: boolean;
    /** 是否盘点中：1-盘点中、0-未盘点 */
    isStocktaking?: boolean;
    locationStatus?: EnumLocationStatus;
    /** 库位空满状态：1-满、0-空 */
    isFull?: boolean;
    /** 货位排 */
    locationRow?: number;
    /** 货位列 */
    locationColumn?: number;
    /** 货位层 */
    locationLayer?: number;
    /** 货位深 */
    locationDepth?: number;
    /** 出库优先级 */
    outboundPriority?: number;
    /** 所属仓库名称 */
    warehouseName?: string;
    /** 区域编号（一位字母一位数字） */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    /** 巷道编号 */
    tunnelCode?: string;
    /** 巷道名称 */
    tunnelName?: string;
    /** 货架编号（两位字符） */
    shelfCode?: string;
    /** 货架名称 */
    shelfName?: string;
  };

  type OutputLocationInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputLocationInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputLocationInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputLocationInfoDTO[];
  };

  type OutputLocationInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputLocationInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputLocationInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputLocationInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputLocationTileDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    warehouseId?: number;
    /** 主键，雪花ID */
    id?: number;
    /** 货位编号(区号两位，排、列、层三位数字，深位两位数字，中间用-隔开) */
    locationCode?: string;
    /** 货位编号（自定义） */
    customCode?: string;
    /** 所属区域ID */
    areaId?: number;
    /** 所属巷道ID */
    tunnelId?: number;
    /** 货架Id */
    shelfId?: number;
    positionType?: EnumPositionType;
    inboundType?: EnumInboundType;
    /** 允许入库：1-允许、0-不允许 */
    allowStockIn?: boolean;
    /** 允许出库：1-允许、0-不允许 */
    allowStockOut?: boolean;
    /** 报警状态（是否报警）:1-报警、0-正常 */
    isAlarm?: boolean;
    /** 是否盘点中：1-盘点中、0-未盘点 */
    isStocktaking?: boolean;
    locationStatus?: EnumLocationStatus;
    /** 库位空满状态：1-满、0-空 */
    isFull?: boolean;
    /** 货位排 */
    locationRow?: number;
    /** 货位列 */
    locationColumn?: number;
    /** 货位层 */
    locationLayer?: number;
    /** 货位深 */
    locationDepth?: number;
    /** 出库优先级 */
    outboundPriority?: number;
    /** 所属仓库名称 */
    warehouseName?: string;
    /** 区域编号（一位字母一位数字） */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    /** 巷道编号 */
    tunnelCode?: string;
    /** 巷道名称 */
    tunnelName?: string;
    /** 货架编号（两位字符） */
    shelfCode?: string;
    /** 货架名称 */
    shelfName?: string;
    viewStatus?: Enum3DLocationStatus;
  };

  type OutputMaterialInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料类型Id */
    materialTypeId?: string;
    /** 物料类型 */
    materialTypeName?: string;
    /** 物料型号ID */
    materialModelId?: number;
    /** 物料型号 */
    materialModelName?: string;
    /** 物料最小包装 ID */
    skuPackagingId?: string;
    /** 物料最小包装名称（单位名称） */
    packagingName?: string;
    defaultQualityStatus?: EnumQualityStatus;
    /** 物料规格 */
    materialSize?: string;
    /** 有效期(天数) */
    expiresDays?: number;
    /** 有效期(天数)预警，新加字段 */
    expiresDaysNotice?: number;
    /** 最低库存预警，新加字段 */
    stockMinNotice?: number;
    /** 最高库存预警，新加字段 */
    stockMaxNotice?: number;
    /** 是否有物料标识:1-有,0-没有 */
    hasMaterialSign?: boolean;
    /** 物料标识是否唯一:1-是,0-不是 */
    isUniqueSign?: boolean;
    /** 是否允许混盘:1-允许,0-不允许 */
    isMixedPallet?: boolean;
    /** 描述信息 */
    materialDescription?: string;
  };

  type OutputMaterialInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputMaterialInfoDTO[];
  };

  type OutputMaterialInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputMaterialInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputMaterialInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputMaterialInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputMaterialItemInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 物料档案收货标识 */
    receivingCode?: string;
    /** 物料标识 */
    materialUID?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料类型ID */
    materialTypeId?: number;
    /** 物料类型名称 */
    materialTypeName?: string;
    /** 物料型号ID */
    materialModelId?: number;
    /** 物料型号名称 */
    materialModelName?: string;
    /** 物料最小包装 ID */
    skuPackagingId?: number;
    /** 包装编号 */
    packagingName?: string;
    /** 规格 */
    materialSize?: string;
    qualityStatus?: EnumQualityStatus;
    /** 有效期(天数) */
    expiresDays?: number;
    /** 收货日期 */
    receivingDate?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 收货区域 */
    areaId?: number;
    /** 区域名称（一位字母一位数字） */
    areaName?: string;
    /** 收货位置（工作台编号、货位编号） */
    locationCode?: string;
    /** 收货数量 */
    quantity?: number;
    /** 供应商ID */
    supplierId?: number;
    /** 供应商名称 */
    contactName?: string;
    /** 收货单号 */
    receiptCode?: string;
    /** 收货单行号 */
    receiptLineNumber?: string;
    /** 收货单行ID */
    receiptLineId?: number;
    /** 描述信息 */
    materialItemDescription?: string;
    /** 添加时间 */
    createTime?: string;
  };

  type OutputMaterialItemInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputMaterialItemInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputMaterialItemInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputMaterialItemInfoDTO[];
  };

  type OutputMaterialItemInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputMaterialItemInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputMenuInfoDTO = {
    children?: OutputMenuInfoDTO[];
    /** 主键，雪花ID */
    id?: number;
    /** 父级菜单ID,为0时是菜单根节点 */
    parentId?: number;
    /** 所属系统编号 */
    systemCode?: string;
    /** 菜单名称 */
    menuName?: string;
    /** 菜单标题 */
    menuTitle?: string;
    /** vue组件名称 */
    vueComponent?: string;
    /** 菜单（页面）地址 */
    menuUrl?: string;
    /** 菜单图标 */
    menuIcon?: string;
    /** 菜单排序 */
    menuSort?: number;
    /** 多语言标识 */
    menuLanguageSign?: string;
    /** 功能权限 */
    functionList?: OutputFunctionInfoDTO[];
  };

  type OutputMenuInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputMenuInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputMenuInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputMenuInfoDTO[];
  };

  type OutputMenuInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputMenuInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputOutboundRequirementInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 出库需求编号 */
    requirementCode?: string;
    /** 物料Id */
    materialId?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料型号Id */
    materialModelId?: string;
    /** 物料型号名称 */
    materialModelName?: string;
    /** 规格 */
    materialSize?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 物料数量 */
    quantity?: number;
    outboundRequirementType?: EnumOutboundRequirementType;
    /** 发货单头ID */
    shipmentHeadId?: string;
    /** 发货单行号 */
    shipmentLineNumber?: string;
    /** 发货单行ID */
    shipmentLineId?: string;
    /** 波次单行ID */
    waveLineId?: string;
    requirementStatus?: EnumRequirementStatus;
    /** 出库区域 */
    outboundAreaId?: string;
    /** 区域名称 */
    areaName?: string;
    allocationStatus?: EnumAutoAllocationStatus;
    /** 添加时间 */
    createTime?: string;
  };

  type OutputOutboundRequirementInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputOutboundRequirementInfoDTO[];
  };

  type OutputOutboundRequirementInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputOutboundRequirementInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputPermissionInfoDTO = {
    /** 权限ID */
    id?: string;
    /** 权限名称 */
    permissionName?: string;
    /** 权限明细 */
    permissionItemList?: OutputPermissionItemInfoDTO[];
  };

  type OutputPermissionInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputPermissionInfoDTO[];
  };

  type OutputPermissionInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputPermissionInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputPermissionItemInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 权限ID */
    permissionId?: string;
    /** 权限名称 */
    permissionName?: string;
    /** 菜单ID */
    menuId?: string;
    /** 菜单标题 */
    menuTitle?: string;
    /** 功能ID */
    functionId?: string[];
    /** 功能标题 */
    functionTitle?: string;
    children?: OutputPermissionItemInfoDTO;
  };

  type OutputPermissionItemInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputPermissionItemInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputQualityTestInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 唯一标识 */
    uid?: string;
    /** 质检单号 */
    qualityTestCode?: string;
    qualityTestStatus?: EnumQualityTestStatus;
    /** 是否搬运 */
    isCarry?: boolean;
    /** 搬运目标区域 */
    targetAreaId?: string;
    /** 搬运目标区域 */
    targetAreaName?: string;
    /** 质检单描述 */
    qualityTestDescription?: string;
    /** 物料ID */
    materialId?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 规格 */
    materialSize?: string;
    qualityStatus?: EnumQualityStatus;
    resultQualityStatus?: EnumQualityStatus;
    /** 抽检容器数量 */
    containerQuantity?: number;
    /** 添加时间 */
    createTime?: string;
    /** 添加人 */
    createName?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 更新人 */
    updateName?: string;
  };

  type OutputQualityTestInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputQualityTestInfoDTO[];
  };

  type OutputQualityTestInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputQualityTestInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputQualityTestInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputQualityTestInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputQualityTestRecordInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 质检单ID */
    qualityTestId?: string;
    /** 质检单号 */
    qualityTestCode?: string;
    /** 分配容器ID */
    containerId?: string;
    /** 分配容器编号 */
    containerCode?: string;
    /** 容器类型ID */
    containerTypeId?: string;
    /** 库位Id */
    locationId?: string;
    /** 库位编号 */
    locationCode?: string;
    /** 实际抽检数量 */
    samplingQuantity?: number;
    /** 是否取样出库 */
    isSampled?: boolean;
  };

  type OutputQualityTestRecordInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputQualityTestRecordInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputReceiptHeaderInfoDTO = {
    /** 收货单头Id */
    id?: number;
    /** 收货单头编号 */
    receiptCode?: string;
    /** 收货类型Id */
    receiptTypeId?: number;
    /** 收货类型名称 */
    receiptTypeName?: string;
    receiptStatus?: EnumReceiptStatus;
    /** 供应商Id */
    supplierId?: number;
    /** 供应商名称 */
    supplierName?: string;
    /** 是否需要审核（默认否） */
    isNeedAudit?: boolean;
    /** 审核人 */
    auditUserName?: string;
    auditStatus?: EnumAuditStatus;
    /** 审核时间 */
    auditTime?: string;
    /** 描述信息 */
    receiptHeaderDescription?: string;
    /** 创建人 */
    createName?: string;
    /** 创建时间 */
    createTime?: string;
    /** 收货单行列表 */
    receiptLineList?: OutputReceiptLineInfoDTO[];
  };

  type OutputReceiptHeaderInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputReceiptHeaderInfoDTO[];
  };

  type OutputReceiptHeaderInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputReceiptHeaderInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputReceiptLineInfoDTO = {
    /** 收货单明细id */
    id?: number;
    /** 收货单号 */
    receiptCode?: string;
    /** 收货单行号 */
    receiptLineNumber?: string;
    receiptStatus?: EnumReceiptStatus;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 是否有标识 */
    hasMaterialSign?: boolean;
    /** 物料类型 */
    materialTypeName?: string;
    /** 物料批次号 */
    batchNumber?: string;
    qualityStatus?: EnumQualityStatus;
    /** 单位 */
    packagingName?: string;
    /** 应收数量 */
    receivableQuantity?: number;
    /** 已收数量 */
    receivedQuantity?: number;
  };

  type OutputRelationLocationGroupAllotModeInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 优先级 */
    priority?: number;
    sortMode?: EnumAllotLocationSortMode;
    /** 区域ID */
    areaId?: number;
    /** 区域编号 */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    /** 货位分组ID */
    locationGroupId?: number;
    /** 货位分组编号 */
    groupCode?: string;
    /** 描述 */
    groupDescription?: string;
    /** 分组货位总数 */
    locationCount?: number;
    /** 货位分组矩形范围内货位 */
    locationList?: GroupLocationDTO[];
    /** 入库策略 */
    allotLocationModeId?: number;
    /** 策略名称 */
    strategyName?: string;
    allotMode?: EnumAllotLocationMode;
    /** 条件集合 */
    conditionList?: AllotLocationConditionInfoDTO[];
  };

  type OutputRelationLocationGroupAllotModeInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputRelationLocationGroupAllotModeInfoDTO[];
  };

  type OutputRelationLocationGroupAllotModeInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputRelationLocationGroupAllotModeInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputRoleInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 权限ID */
    permissionId?: string;
    /** 权限名称 */
    permissionName?: string;
    /** 角色名称 */
    roleName?: string;
    /** 描述信息 */
    roleDescription?: string;
  };

  type OutputRoleInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputRoleInfoDTO[];
  };

  type OutputRoleInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputRoleInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputRoutingInfoDTO = {
    warehouseId?: number;
    /** 主键，雪花ID */
    id?: string;
    /** 路径编号，唯一 */
    code?: string;
    /** 路径名称 */
    name?: string;
    /** 起始区域 */
    fromArea?: number;
    /** 起始区域名称 */
    fromAreaName?: string;
    /** 目标区域 */
    toArea?: number;
    /** 目标区域名称 */
    toAreaName?: string;
    taskExecuteType?: EnumTaskExecuteType;
    /** WCS名称 */
    wcsName?: string;
    /** 是否空托解绑 */
    isEmptyDismiss?: boolean;
    /** 是否实托解盘 */
    isFullDismiss?: boolean;
    /** 启用状态 */
    isEnable?: boolean;
    /** 优先级 */
    priority?: number;
  };

  type OutputRoutingInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputRoutingInfoDTO[];
  };

  type OutputRoutingInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputRoutingInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputRoutingInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputRoutingInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputSamplingContainerDetailDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 质检单ID */
    qualityTestId?: string;
    /** 质检单号 */
    qualityTestCode?: string;
    qualityTestStatus?: EnumQualityTestStatus;
    /** 工作台位置编号 */
    locationCode?: string;
    /** 分配容器编号 */
    containerCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 规格 */
    materialSize?: string;
    qualityStatus?: EnumQualityStatus;
    /** 容器库存 */
    inventoryQuantity?: number;
    /** 实际抽检数量 */
    samplingQuantity?: number;
  };

  type OutputSamplingContainerDetailDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputSamplingContainerDetailDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputShelfInfoDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    warehouseId?: number;
    /** 主键，雪花ID */
    id?: string;
    /** 货架编号（两位字符） */
    shelfCode?: string;
    /** 货架名称 */
    shelfName?: string;
    shelvesType?: EnumShelvesType;
    /** 是否纵向排列 */
    isDirection?: boolean;
  };

  type OutputShelfInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputShelfInfoDTO[];
  };

  type OutputShelfInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputShelfInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputStocktakeDetailDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 盘点计划号 */
    stocktakeCode?: string;
    stocktakeType?: EnumStocktakeType;
    stocktakeStatus?: EnumStocktakeStatus;
    /** 搬运目标区域 */
    targetAreaId?: number;
    /** 搬运目标区域编号 */
    targetAreaCode?: string;
    /** 搬运目标区域名称 */
    targetAreaName?: string;
    /** 盘点计划描述 */
    stocktakeDescription?: string;
    /** 添加时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 盘点库位 */
    stocktakeLocationList?: StocktakeLocationInfoDTO[];
    /** 盘点记录 */
    stocktakeRecordList?: OutputStocktakeRecordInfoDTO[];
  };

  type OutputStocktakeDetailDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputStocktakeDetailDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputStocktakeInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 盘点计划号 */
    stocktakeCode?: string;
    stocktakeType?: EnumStocktakeType;
    stocktakeStatus?: EnumStocktakeStatus;
    /** 搬运目标区域 */
    targetAreaId?: number;
    /** 搬运目标区域编号 */
    targetAreaCode?: string;
    /** 搬运目标区域名称 */
    targetAreaName?: string;
    /** 盘点计划描述 */
    stocktakeDescription?: string;
    /** 创建人 */
    createName?: string;
    /** 添加时间 */
    createTime?: string;
    /** 更新人 */
    updateName?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  type OutputStocktakeInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputStocktakeInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputStocktakeInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputStocktakeInfoDTO[];
  };

  type OutputStocktakeInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputStocktakeInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputStocktakeRecordInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 盘点计划Id */
    stocktakeId?: number;
    /** 盘点库位ID */
    stocktakeLocationId?: number;
    /** 盘点计划号 */
    stocktakeCode?: string;
    /** 库存ID */
    inventoryId?: number;
    /** 被盘点库位Id */
    locationId?: number;
    /** 被盘点库位编号 */
    locationCode?: string;
    /** 被盘点库位编号(自定义) */
    customCode?: string;
    /** 当前载具位置 */
    containerPosition?: string;
    /** 当前载具位置编号 */
    containerPositionCode?: string;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料档案ID */
    materialItemId?: number;
    /** 规格 */
    materialSize?: string;
    /** 批次号 */
    batchNumber?: string;
    qualityStatus?: EnumQualityStatus;
    /** 盘前库存数量 */
    stocktakeQuantity?: number;
    /** 盘后数量 */
    adjustedQuantity?: number;
    stocktakeRecordStatus?: EnumStocktakeRecordStatus;
    /** 盈亏备注 */
    stocktakeRecordRemark?: string;
    /** 是否盘点完成 */
    isFinish?: boolean;
    /** 是否允许回库 */
    isAllowReturn?: boolean;
  };

  type OutputStocktakeRecordInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputStocktakeRecordInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputSysAreaReceivingSetting = {
    /** Id */
    id?: string;
    /** 区域ID */
    areaID?: number;
    receivingBusinessType?: EnumSysReceivingBusinessType;
    /** 收货业务类型描述 */
    receivingBusinessTypeDes?: string;
    /** 是否允许 */
    isAllow?: boolean;
    /** 是否在途 */
    isTransit?: boolean;
  };

  type OutputSysAreaReceivingSettingR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputSysAreaReceivingSetting;
    statusCode?: EnumStatusCode;
  };

  type OutputSysParamInfoDTO = {
    id?: number;
    /** 分组 */
    group?: string;
    /** 名称 */
    name?: string;
    /** 键 */
    key?: string;
    type?: EnumParamType;
    /** 值 */
    value?: string;
    /** 是否允许用户配置 */
    isConfigurable?: boolean;
    /** 是否禁用 */
    isDisable?: boolean;
  };

  type OutputTaskInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 任务编号 */
    taskCode?: string;
    /** 依赖任务ID */
    dependentTaskId?: number;
    /** 依赖任务编号 */
    dependentTaskCode?: string;
    /** 任务优先级 */
    taskPriority?: number;
    /** 容器类型 */
    containerTypeId?: number;
    /** 容器档案标识 */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    taskType?: EnumTaskType;
    taskStatus?: EnumTaskStatus;
    /** 是否已下发WCS */
    isToWcs?: boolean;
    /** 货位分组ID */
    locationGroupID?: number;
    allotLocationSortMode?: EnumAllotLocationSortMode;
    /** 是否锁定了真实的库位，即ToPositionCode对应一个真实的库位 */
    isLockRealLocation?: boolean;
    /** 搬运路径id */
    routingId?: number;
    taskExecuteType?: EnumTaskExecuteType;
    /** 起始区域 */
    fromAreaId?: number;
    /** 目标区域 */
    toAreaId?: number;
    /** 起始位置 */
    fromPositionCode?: string;
    /** 起始位置(自定义) */
    fromCustomCode?: string;
    /** 目标位置 */
    toPositionCode?: string;
    /** 目标位置（自定义） */
    toCustomCode?: string;
    postStatus?: EnumPostStatus;
    /** 过账状态描述 */
    postStatusDescription?: string;
    /** 是否预警 */
    isAlarm?: boolean;
    taskAlarmType?: EnumTaskAlarmType;
    /** 预警描述 */
    alarmDescription?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新人 */
    updateUserName?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  type OutputTaskInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputTaskInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputTaskInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputTaskInfoDTO[];
  };

  type OutputTaskInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputTaskInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputTunnelInfoDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    warehouseId?: number;
    /** 主键id */
    id?: number;
    /** 巷道编号 */
    tunnelCode?: string;
    /** 巷道名称 */
    tunnelName?: string;
    /** 巷道描述 */
    tunnelDescribe?: string;
    /** 所属仓库名称 */
    warehouseName?: string;
  };

  type OutputTunnelInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputTunnelInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputTunnelInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputTunnelInfoDTO[];
  };

  type OutputTunnelInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputTunnelInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputUserInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 所属角色 */
    roleId?: number;
    /** 角色名称 */
    roleName?: string;
    /** 权限ID */
    permissionId?: number;
    /** 是否超级管理员 */
    isAdmin?: boolean;
    /** 账号名称 */
    userName?: string;
    /** 用户头像 */
    avator?: string;
    /** 姓名 */
    realName?: string;
    userSex?: EnumSex;
    /** 出生日期 */
    birthday?: string;
    /** 工号 */
    jobNumber?: string;
    /** 电话 */
    phoneNumber?: string;
    /** email */
    userEmail?: string;
    /** 部门名称 */
    departmentName?: string;
    /** 添加者 */
    createName?: string;
    /** 添加时间 */
    createTime?: string;
    /** 用户刷新token */
    refreshToken?: string;
  };

  type OutputUserInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputUserInfoDTO[];
  };

  type OutputUserInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputUserInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputUserInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputUserInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputWavenumberDetailDTO = {
    /** 波次id */
    id?: string;
    /** 波次单头编号 */
    wavenumberCode?: string;
    /** 波次单名称 */
    wavenumberName?: string;
    wavenumberStatus?: EnumWavenumberStatus;
    /** 描述信息 */
    waveHeaderDescription?: string;
    /** 搬运目标区域 */
    toAreaId?: string;
    /** 搬运目标区域 */
    toAreaName?: string;
    /** 创建时间 */
    createTime?: string;
    /** 发货单列表 */
    wavenumberInvoiceList?: OutputWavenumberInvoiceDTO[];
  };

  type OutputWavenumberDetailDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputWavenumberDetailDTO;
    statusCode?: EnumStatusCode;
  };

  type OutputWavenumberHeaderDTO = {
    /** 波次id */
    id?: string;
    /** 波次单头编号 */
    wavenumberCode?: string;
    /** 波次单名称 */
    wavenumberName?: string;
    wavenumberStatus?: EnumWavenumberStatus;
    /** 描述信息 */
    waveHeaderDescription?: string;
    /** 搬运目标区域 */
    toAreaId?: string;
    /** 搬运目标区域 */
    toAreaName?: string;
    /** 创建时间 */
    createTime?: string;
    /** 单行明细 */
    wavenumberLineList?: OutputWavenumberLineDTO[];
  };

  type OutputWavenumberHeaderDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputWavenumberHeaderDTO[];
  };

  type OutputWavenumberHeaderDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputWavenumberHeaderDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputWavenumberInvoiceDTO = {
    /** 发货单Id */
    id?: string;
    /** 发货单头编号 */
    invoiceCode?: string;
    /** 发货单名称 */
    invoiceName?: string;
    /** 发货类型Id */
    invoiceTypeId?: string;
    /** 发货类型 */
    invoiceTypeName?: string;
    /** 搬运目标区域id */
    targetAreaId?: string;
    /** 搬运目标区域 */
    targetAreaName?: string;
    invoiceStatus?: EnumInvoiceStatus;
    /** 发货单有效期(天数) */
    expiresDays?: number;
    /** 是否超期 */
    isExpires?: boolean;
    /** 描述信息 */
    invoiceHeaderDescription?: string;
    /** 创建时间 */
    createTime?: string;
    qualityStatus?: EnumQualityStatus;
  };

  type OutputWavenumberInvoiceDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputWavenumberInvoiceDTO[];
  };

  type OutputWavenumberInvoiceDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputWavenumberInvoiceDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type OutputWavenumberLineDTO = {
    /** 波次行Id */
    id?: string;
    /** 波次单号 */
    wavenumberCode?: string;
    /** 波次单行行号 */
    wavenumberLineNumber?: string;
    /** 物料ID */
    materialId?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料型号ID */
    materialModelId?: string;
    /** 物料型号 */
    materialModelName?: string;
    /** 物料批次号 */
    batchNumber?: string;
    /** 数量 */
    quantity?: number;
    wavenumberLineStatus?: EnumWavenumberStatus;
    /** 是否自动完成 */
    isAutocomplete?: boolean;
    /** 描述信息 */
    wavenumberLineDescription?: string;
    /** 出库需求Id */
    outboundRequirementId?: string;
    requirementStatus?: EnumRequirementStatus;
    autoAllocationStatus?: EnumAutoAllocationStatus;
  };

  type OutputWavenumberLineDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: OutputWavenumberLineDTO[];
    statusCode?: EnumStatusCode;
  };

  type OutputWavenumberLineDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: OutputWavenumberLineDTO[];
  };

  type OutputWavenumberLineDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: OutputWavenumberLineDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type PadCombineInfoDTO = {
    carryStatus?: EnumCarryStatus;
    /** 组盘位置编号 */
    locationCode?: string;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 容器类型ID */
    containerTypeId?: number;
    /** 收货单号（非空托必填项） */
    receiptCode?: string;
    /** 物料编号（非空托必填项） */
    materialCode?: string;
    /** 物料唯一标识 */
    materialUID?: string;
    qualityStatus?: EnumQualityStatus;
    /** 收货数量（非空托必填项） */
    quantity?: number;
    /** 收货日期（非空托必填项） */
    receivingDate?: string;
  };

  type PadInvoiceLineDTO = {
    /** 发货单行Id */
    id?: number;
    /** 发货单号 */
    invoiceCode?: string;
    /** 发货单行号 */
    invoiceLineNumber?: string;
    invoiceLineStatus?: EnumInvoiceStatus;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 物料类型 */
    materialTypeName?: string;
    /** 物料型号 */
    materialModelName?: string;
    /** 物料批次号 */
    batchNumber?: string;
    /** 应发数量 */
    quantity?: number;
    /** 已发数量 */
    outboundQuantity?: number;
    /** 描述信息 */
    invoiceLineDescription?: string;
    /** 出库区域id */
    outboundAreaId?: number;
    /** 出库区域编号 */
    outboundAreaCode?: string;
    /** 出库区域 */
    outboundAreaName?: string;
    qualityStatus?: EnumQualityStatus;
  };

  type PadInvoiceLineDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: PadInvoiceLineDTO[];
  };

  type PadInvoiceLineDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: PadInvoiceLineDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type PadOutboundDetailDTO = {
    /** 对应出库需求Id,发货单行Id,波次单行Id */
    id?: string;
    /** 对应出库需求编号，发货单号 */
    shipmentCode?: string;
    /** 出库需求ID */
    outboundRequirementId?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    qualityStatus?: EnumQualityStatus;
    /** 物料型号 */
    materialModelName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 需求数量 */
    requirementQuantity?: number;
    /** 拣选出库数量 */
    pickQuantity?: number;
  };

  type PadOutboundDetailDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: PadOutboundDetailDTO[];
    statusCode?: EnumStatusCode;
  };

  type PadReceiptLineInfoDTO = {
    /** 收货单明细id */
    id?: number;
    /** 收货单号 */
    receiptCode?: string;
    /** 收货单行号 */
    receiptLineNumber?: string;
    receiptStatus?: EnumReceiptStatus;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料规格 */
    materialSize?: string;
    /** 是否有标识 */
    hasMaterialSign?: boolean;
    /** 物料类型 */
    materialTypeName?: string;
    /** 物料批次号 */
    batchNumber?: string;
    qualityStatus?: EnumQualityStatus;
    /** 单位 */
    packagingName?: string;
    /** 应收数量 */
    receivableQuantity?: number;
    /** 已收数量 */
    receivedQuantity?: number;
    /** 供应商Id */
    supplierId?: number;
    /** 供应商名称 */
    supplierName?: string;
  };

  type PadReceiptLineInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: PadReceiptLineInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type PadReceiptLineInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: PadReceiptLineInfoDTO[];
  };

  type PadReceiptLineInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: PadReceiptLineInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type PadShipmentExecutionDTO = {
    /** ID */
    id?: string;
    /** 单据号 */
    shipmentCode?: string;
    /** 物料号 */
    materialCode?: string;
    /** 型号 */
    materialModelName?: string;
    /** 规格 */
    materialSize?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 数量 */
    quantity?: number;
    qualityStatus?: EnumQualityStatus;
  };

  type PadShipmentExecutionDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: PadShipmentExecutionDTO;
    statusCode?: EnumStatusCode;
  };

  type PadStocktakeLocationDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 盘点计划号 */
    stocktakeCode?: string;
    stocktakeType?: EnumStocktakeType;
    stocktakeStatus?: EnumStocktakeStatus;
    /** 搬运目标区域 */
    targetAreaId?: number;
    /** 搬运目标区域编号 */
    targetAreaCode?: string;
    /** 搬运目标区域名称 */
    targetAreaName?: string;
    /** 添加时间 */
    createTime?: string;
    /** 盘点库位ID */
    stocktakeLocationId?: number;
    /** 被盘库位Id */
    locationId?: number;
    /** 被盘库位编号 */
    locationCode?: string;
    /** 被盘库位编号(自定义)-显示 */
    customCode?: string;
    /** 当前容器位置 */
    containerPosition?: string;
    /** 当前容器位置编号-显示 */
    containerPositionCode?: string;
    containerPositionType?: EnumPositionType;
    /** 容器ID */
    containerId?: number;
    /** 容器编号-显示 */
    containerCode?: string;
    /** 是否允许回库-显示 */
    isAllowReturn?: boolean;
  };

  type PadStocktakeLocationDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: PadStocktakeLocationDTO[];
  };

  type PadStocktakeLocationDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: PadStocktakeLocationDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type PadUnbindingDTO = {
    unbindingType?: EnumUnbindingType;
    /** 位置编号 */
    locationCode?: string;
    /** 容器编号 */
    containerCode?: string;
  };

  type PdaPickingDTO = {
    /** 拣选位置ID */
    locationId?: number;
    /** 拣选位置 */
    locationCode?: string;
    positionType?: EnumPositionType;
    /** 托盘编号 */
    containerCode?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 发货单行Id */
    id?: number;
    /** 发货单号 */
    invoiceCode?: string;
    /** 应发数量 */
    invoiceQuantity?: number;
    /** 已发数量 */
    outboundQuantity?: number;
    /** 可拣选的分配数量 */
    allotQuantity?: number;
    /** 当前拣选数量 */
    pickingQuantity?: number;
  };

  type PdaPickingDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: PdaPickingDTO[];
    statusCode?: EnumStatusCode;
  };

  type PdaStocktakeDetailDTO = {
    /** 盘点单号 */
    stocktakeCode?: string;
    /** 货位ID */
    locationId?: number;
    /** 盘点位置 */
    locationCode?: string;
    positionType?: EnumPositionType;
    /** 托盘Id */
    containerId?: number;
    /** 托盘编号 */
    containerCode?: string;
    /** 物料档案ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 库存数量 */
    inventoryQuantity?: number;
    /** 盘后数量 */
    adjustedQuantity?: number;
  };

  type PdaStocktakeDetailDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: PdaStocktakeDetailDTO[];
    statusCode?: EnumStatusCode;
  };

  type PdaStocktakeDetailDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: PdaStocktakeDetailDTO;
    statusCode?: EnumStatusCode;
  };

  type PermissionInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 权限名称 */
    permissionName?: string;
  };

  type PermissionItemInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 权限ID */
    permissionId?: number;
    /** 权限名称 */
    permissionName?: string;
    /** 菜单ID */
    menuId?: number;
    /** 功能ID */
    functionId?: string[];
  };

  type PickingContanierInventoryDTO = {
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 容器所在库位ID */
    locationId?: number;
    /** 出库需求ID */
    outboundRequirementId?: number;
    /** 出库需求编号 */
    outboundRequirementCode?: string;
    /** 分配明细ID */
    allocationItemId?: number;
    /** 物料档案ID */
    materialItemId?: number;
    /** 物料ID */
    materialId?: number;
    /** 库存ID */
    inventoryId?: number;
    /** 发货单头ID */
    invoiceHeaderId?: number;
    /** 发货单行ID */
    invoiceLineId?: number;
    /** 发货单号 */
    invoiceCode?: string;
    /** 发货单号号 */
    invoiceLineNumber?: string;
    qualityStatus?: EnumQualityStatus;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 规格 */
    materialSize?: string;
    /** 出库需求数量 */
    requirementQuantity?: number;
    /** 分配数量 */
    allotQuantity?: number;
    /** 已出库数量 */
    outboundQuantity?: number;
    /** 拣选数量（默认等于该容器的分配数量-已出库数量） */
    pickingQuantity?: number;
    /** 当前容器库存数量 */
    inventoryQuantity?: number;
    /** 是否已分配 */
    isAllot?: boolean;
  };

  type PickingContanierInventoryDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: PickingContanierInventoryDTO[];
    statusCode?: EnumStatusCode;
  };

  type postApiAreaAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiAreaGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiAuthLoginParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiContactsAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiContactsGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiContactsImportDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiContactsUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiContainerAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiContainerGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiContainerTypeAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiContainerTypeGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDailyGetReportInventoryDailyInOutListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDailyGetReportInventoryDailyListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDailyGetReportInventoryDailyPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDailyGetReportLocationDailyListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDailyGetReportLocationDailyPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDailyGetReportTaskDailyListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDailyGetReportTaskDailyPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDictionaryAddDictionaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDictionaryAddDictionaryValueParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDictionaryGetDictionaryPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDictionaryGetDictionaryValuePageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDictionaryUpdateDictionaryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiDictionaryUpdateDictionaryValueParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiHomeBindingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiHomeGet2DTileDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiHomeUnbindingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInboundStrategyAddModeParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInboundStrategyAddRelationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInboundStrategyGetModePageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInboundStrategyGetRelationPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInboundStrategyUpdateModeParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInboundStrategyUpdateRelationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInvoiceHeaderAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInvoiceHeaderCancelAllocatedParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInvoiceHeaderConfirmAllocatedParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInvoiceHeaderCreateCarryTaskParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInvoiceHeaderGetPageDataForWaveParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInvoiceHeaderGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInvoiceHeaderOutboundPickingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiInvoiceHeaderUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationBatchAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationBatchDeleteParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationBatchUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationGroupAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationGroupGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationGroupUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiLocationUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialExportParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialImportMaterialParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialItemAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialItemExportParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialItemGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialItemImportParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialItemUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialPackagingAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialPackagingGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialPackagingUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMaterialUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMenuAddFunctionParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMenuAddMenuParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMenuGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMenuUpdateFunctionParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiMenuUpdateMenuParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiOutboundRequirementAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiOutboundRequirementGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiOutboundRequirementManualAllocationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiOutboundRequirementUpdateAllocationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiOutboundStrategySetOutboundStrategyParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiPermissionAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiPermissionAddPermissionItemInfoParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiPermissionDeletePermissionItemInfoParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiPermissionGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiPermissionUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiPrintLabelGetBarcodeListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiPrintLabelGetQRCodeListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiPrintLabelPrintLocationLabelByCurrentPageParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiQualityTestAddQualityTestParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiQualityTestGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiQualityTestUpdateQualityTestParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiReceiptHeaderAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiReceiptHeaderGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiReceiptHeaderUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiRoleAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiRoleGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiRoleUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiRoutingAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiRoutingGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiShelfAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiShelfGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeAddStocktakeByAllParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeAddStocktakeByLocationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeAddStocktakeByMaterialParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeAddStocktakeBySamplingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeCreateCarryTaskParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeGetStocktakeLocationListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeUpdateStocktakeByAllParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeUpdateStocktakeByLocationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeUpdateStocktakeByMaterialParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStocktakeUpdateStocktakeRecordParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStorageCombineFullTrayInApplyByReceiptParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStorageCombineOnWorkbenchByReceiptParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStorageCombineParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStorageExportDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStorageGetPageContainerInventoryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStorageGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiStorageGetPageQualityDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiSummaryGetPageInventoryJournalParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiSummaryGetPageMaterialInventoryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiSysConfigAddSysReceivingTypeSettingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiSysConfigWmsClearDataByTbNameListParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiSysParamEditParamInfoParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiTaskGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiTaskManualFinishParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiTunnelAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiTunnelGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiUserAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiUserGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiUserModifyUserPwdParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiUserUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWarehouseAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWarehouseGet2DTileDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWarehouseGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWarehouseImportDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWarehouseImportRcsJsonDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveHeaderActiveOrderParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveHeaderAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveHeaderAllocationOrderParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveHeaderGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveHeaderUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveHeaderWaveOrderExecuteParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveLineAddParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveLineGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postApiWaveLineWaveOrderItemExecuteParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadCarryTaskGetFinishPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadCarryTaskGetUnfinishPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadCarryTaskManualFinishParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadContainerInventoryGetPageContainerInventoryParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadInboundCombineParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadInboundGetFinishPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadInboundGetUnfinishPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadIndexBindingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadIndexGet2DTileDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadIndexUnbindingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadMaterialInventoryGetPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadOutboundCancelAllocatedParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadOutboundConfirmAllocatedParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadOutboundCreateCarryTaskParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadOutboundGetFinishPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadOutboundGetUnfinishPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadOutboundOutboundPickingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadOutboundRequirementOutboundBatchConfirmParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadStocktakeAddStocktakeBySamplingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadStocktakeCreateCarryTaskParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadStocktakeGetFinishPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadStocktakeGetUnfinishPageDataParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPadStocktakeUpdateStocktakeRecordParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPdaAddStocktakeBySamplingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPdaBindingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPdaOutboundPickingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPdaUnbindingParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postPdaUpdateStocktakeRecordParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postWcsapiWMSRequestLocationParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postWcsapiWMSRequestTaskParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postWcsapiWMSUpLoadTaskErrorParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type postWcsapiWMSUpLoadTaskStatusParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type putApiAreaUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type putApiContainerTypeUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type putApiContainerUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type putApiRoutingUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type putApiShelfUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type putApiStorageUpdateQualityStatusParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type putApiTunnelUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type putApiWarehouseUpdateParams = {
    /** 当前仓库ID */
    WarehouseId?: any;
  };

  type Query2DTile = {
    /** 层 */
    layer?: number;
    /** 区 */
    areaId?: number;
  };

  type QueryAreaInfo = {
    /** 区域名称 */
    areaName?: string;
    /** 区域编号 */
    areaCode?: string;
    areaType?: EnumAreaType;
  };

  type QueryAreaInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryAreaInfo;
  };

  type QueryContactsInfo = {
    /** 客户/供应商编号 */
    contactCode?: string;
    /** 客户/供应商名称 */
    contactName?: string;
    /** 机构名称 */
    organizationName?: string;
    /** 是否供应商:1-是,0-否 */
    isSupplier?: boolean;
    /** 是否客户:1-是,0-否 */
    isCustomer?: boolean;
    /** 电话号码 */
    phoneNumber?: string;
  };

  type QueryContactsInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryContactsInfo;
  };

  type QueryContainerInfo = {
    /** 容器档案编号 */
    containerCode?: string;
    /** 容器类型ID集 */
    containerTypeIds?: number[];
    /** 容器载货状态集 */
    carryStatuses?: EnumCarryStatus[];
    /** 是否启用 */
    isEnable?: boolean;
  };

  type QueryContainerInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryContainerInfo;
  };

  type QueryContainerTypeInfo = {
    /** 容器类型名称 */
    name?: string;
    /** 是否启用 */
    isEnable?: boolean;
  };

  type QueryContainerTypeInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryContainerTypeInfo;
  };

  type QueryContianerInventory = {
    /** 容器档案编号 */
    containerCode?: string;
    /** 容器类型ID集 */
    containerTypeIdList?: number[];
    /** 容器载货状态集 */
    carryStatusList?: EnumCarryStatus[];
    /** 容器位置编号（系统编号/自定义编号） */
    locationCode?: string;
  };

  type QueryContianerInventoryPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryContianerInventory;
  };

  type QueryDictionaryInfo = {
    /** 字典名称 */
    dictionaryName?: string;
    businessType?: EnumBusinessType;
  };

  type QueryDictionaryInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryDictionaryInfo;
  };

  type QueryDictionaryValueInfo = {
    /** 字典Id */
    dictionaryId?: number;
    /** 字典值 */
    dictionaryValue?: string;
    /** 字典值标签 */
    valueLabel?: string;
    /** 是否系统保留值 */
    isSystem?: boolean;
  };

  type QueryDictionaryValueInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryDictionaryValueInfo;
  };

  type QueryInventory = {
    /** 区域编号 */
    areaCode?: string;
    /** 排/行最小值 */
    rowMin?: number;
    /** 排/行最大值 */
    rowMax?: number;
    /** 列最小值 */
    columnMin?: number;
    /** 列最大值 */
    columnMax?: number;
    /** 层最小值 */
    layerMin?: number;
    /** 层最大值 */
    layerMax?: number;
    qualityStatus?: EnumQualityStatus;
    /** 物料类型ID */
    materialTypeId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 开始收货时间 */
    beginReceivingTime?: string;
    /** 结束收货时间 */
    endReceivingTime?: string;
    /** 容器编号 */
    containerCode?: string;
    carryStatus?: EnumCarryStatus;
    /** 批次号 */
    batchNumber?: string;
    /** 是否过期 */
    isExpired?: boolean;
    /** 供应商Id */
    supplierId?: number;
  };

  type QueryInventoryJournal = {
    /** 托盘编号 */
    containerCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 容器类型 */
    containerTypeId?: number;
  };

  type QueryInventoryJournalPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryInventoryJournal;
  };

  type QueryInventoryPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryInventory;
  };

  type QueryInvoiceHeader = {
    /** 发货单编号 */
    invoiceCode?: string;
    /** 发货单状态 */
    invoiceStatusList?: EnumInvoiceStatus[];
    /** 波次号 */
    wavenumberCode?: string;
    qualityStatus?: EnumQualityStatus;
    /** 物料编号 */
    materialCode?: string;
    /** 物料批次号 */
    batchNumber?: string;
    /** 发货类型 */
    invoiceTypeId?: number;
    /** 出库区域 */
    outboundAreaId?: number;
  };

  type QueryInvoiceHeaderPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryInvoiceHeader;
  };

  type QueryInvoiceLineInfo = {
    /** 发货单编号 */
    invoiceCode?: string;
    /** 发货单状态 */
    invoiceLineStatusList?: EnumInvoiceStatus[];
    /** 物料编号 */
    materialCode?: string;
    /** 物料批次号 */
    batchNumber?: string;
  };

  type QueryInvoiceLineInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryInvoiceLineInfo;
  };

  type QueryLocationGroupInfo = {
    /** 货位分组编号 */
    groupCode?: string;
    /** 描述 */
    description?: string;
    /** 启用状态 */
    isEnable?: boolean;
  };

  type QueryLocationGroupInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryLocationGroupInfo;
  };

  type QueryLocationInfo = {
    /** 区域 */
    areaId?: number;
    /** 巷道 */
    tunnelId?: number;
    /** 货架 */
    shelfId?: number;
    positionType?: EnumPositionType;
    inboundType?: EnumInboundType;
    /** 报警状态 */
    isAlarm?: boolean;
    /** 允许入库 */
    allowStockIn?: boolean;
    /** 允许出库 */
    allowStockOut?: boolean;
    /** 排-起始 */
    locationRowFrom?: number;
    /** 排-结束 */
    locationRowTo?: number;
    /** 列-起始 */
    locationColumnFrom?: number;
    /** 列-结束 */
    locationColumnTo?: number;
    /** 层-起始 */
    locationLayerFrom?: number;
    /** 层-结束 */
    locationLayerTo?: number;
    /** 库位编号 */
    locationCode?: string;
    /** 货位编号（自定义） */
    customCode?: string;
    locationStatus?: EnumLocationStatus;
    /** 库位空满 */
    isFull?: boolean;
    /** 是否盘点中 */
    isStocktaking?: boolean;
  };

  type QueryLocationInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryLocationInfo;
  };

  type QueryMaterialInfo = {
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料类型ID(允许多选) */
    materialTypeIdList?: number[];
    /** 物料类型ID（允许多选） */
    materialModelIdList?: number[];
  };

  type QueryMaterialInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryMaterialInfo;
  };

  type QueryMaterialInventory = {
    /** 物料类型ID */
    materialTypeId?: number;
    /** 物料编号 */
    materialCode?: string;
  };

  type QueryMaterialInventoryPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryMaterialInventory;
  };

  type QueryMaterialItemInfo = {
    /** 物料名称 */
    materialName?: string;
    /** 物料类型 */
    materialTypeId?: number;
    /** 物料标识 */
    materialUID?: string;
    /** 收货位置 */
    locationCode?: string;
  };

  type QueryMaterialItemInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryMaterialItemInfo;
  };

  type QueryMaterialPackagingInfo = {
    /** 包装编号 */
    packagingCode?: string;
    /** 物料包装名称 */
    packagingName?: string;
    /** 是否最小包装 */
    isSkuPackaging?: boolean;
  };

  type QueryMaterialPackagingInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryMaterialPackagingInfo;
  };

  type QueryMenuInfo = {
    /** 菜单名称 */
    menuName?: string;
  };

  type QueryMenuInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryMenuInfo;
  };

  type QueryModeInfo = {
    /** 策略名称 */
    strategyName?: string;
    allotMode?: EnumAllotLocationMode;
    /** 启用状态 */
    isEnable?: boolean;
  };

  type QueryModeInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryModeInfo;
  };

  type QueryOutboundRequirementInfo = {
    /** 出库需求编号 */
    requirementCode?: string;
    /** 物料编号 */
    materialCode?: string;
    requirementStatus?: EnumRequirementStatus;
    requirementType?: EnumOutboundRequirementType;
    /** 添加时间-起始 */
    createTimeFrom?: string;
    /** 添加时间-结束 */
    createTimeTo?: string;
  };

  type QueryOutboundRequirementInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryOutboundRequirementInfo;
  };

  type QueryPadStocktakeLocation = {
    /** 货位编号，非必填 */
    locationCode?: string;
    /** 盘点计划号 */
    stocktakeCode?: string;
    /** 盘点计划状态 */
    stocktakeStatusList?: EnumStocktakeStatus[];
  };

  type QueryPadStocktakeLocationPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryPadStocktakeLocation;
  };

  type QueryPermissionInfo = {
    /** 授权名称 */
    permissionName?: string;
  };

  type QueryPermissionInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryPermissionInfo;
  };

  type QueryQualityInspection = {
    /** 质量状态 */
    qualityStatus?: number[];
    /** 批次号 */
    batchNumber?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 收货单号 */
    receivingCode?: string;
    /** 开始收货时间 */
    beginReceivingTime?: string;
    /** 结束收货时间 */
    endReceivingTime?: string;
    /** 供应商id */
    supplierId?: number;
  };

  type QueryQualityInspectionPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryQualityInspection;
  };

  type QueryQualityTestInfo = {
    /** 质检单号 */
    qualityTestCode?: string;
    qualityTestStatus?: EnumQualityTestStatus;
    /** 是否搬运 */
    isCarry?: boolean;
    /** 物料编号 */
    materialCode?: string;
    /** 批次号 */
    batchNumber?: string;
  };

  type QueryQualityTestInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryQualityTestInfo;
  };

  type QueryReceiptHearderInfo = {
    /** 收货单号 */
    receiptCode?: string;
    /** 收货单状态 */
    receiptStatusList?: EnumReceiptStatus[];
    /** 是否需要审核 */
    isNeedAudit?: boolean;
    auditStatus?: EnumAuditStatus;
    /** 物料编号 */
    materialCode?: string;
    /** 物料批次号 */
    batchNumber?: string;
  };

  type QueryReceiptHearderInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryReceiptHearderInfo;
  };

  type QueryReceiptLineInfo = {
    /** 收货单号 */
    receiptCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料批次号 */
    batchNumber?: string;
    /** 收货单行状态 */
    receiptLineStatusList?: EnumReceiptStatus[];
  };

  type QueryReceiptLineInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryReceiptLineInfo;
  };

  type QueryRelationInfo = {
    /** 区域编号 */
    areaCode?: string;
    /** 区域名称 */
    areaName?: string;
    /** 货位分组编号 */
    groupCode?: string;
    /** 货位分组描述 */
    groupDescription?: string;
    /** 策略名称 */
    strategyName?: string;
  };

  type QueryRelationInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryRelationInfo;
  };

  type QueryReportInventoryDailyInfo = {
    /** 报表起始日期 */
    reportDateFrom?: string;
    /** 报表截止日期 */
    reportDateTo?: string;
  };

  type QueryReportInventoryDailyInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryReportInventoryDailyInfo;
  };

  type QueryReportLocationDailyInfo = {
    /** 报表起始日期 */
    reportDateFrom?: string;
    /** 报表截止日期 */
    reportDateTo?: string;
  };

  type QueryReportLocationDailyInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryReportLocationDailyInfo;
  };

  type QueryReportTaskDailyInfo = {
    /** 报表起始日期 */
    reportDateFrom?: string;
    /** 报表截止日期 */
    reportDateTo?: string;
  };

  type QueryReportTaskDailyInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryReportTaskDailyInfo;
  };

  type QueryRoleInfo = {
    /** 角色名称 */
    roleName?: string;
    /** 权限ID */
    permissionId?: number;
  };

  type QueryRoleInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryRoleInfo;
  };

  type QueryRoutingInfo = {
    /** 路径编号 */
    code?: string;
    /** 路径名称 */
    name?: string;
    /** 起始区域Id */
    fromAreaId?: number;
    /** 目标区域Id */
    toAreaId?: number;
    /** 启用状态 */
    isEnable?: boolean;
  };

  type QueryRoutingInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryRoutingInfo;
  };

  type QueryShelfInfo = {
    /** 货架编号 */
    shelfCode?: string;
    /** 货架名称 */
    shelfName?: string;
    shelvesType?: EnumShelvesType;
  };

  type QueryShelfInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryShelfInfo;
  };

  type QueryStocktakeInfo = {
    /** 盘点计划号 */
    stocktakeCode?: string;
    stocktakeStatus?: EnumStocktakeStatus;
  };

  type QueryStocktakeInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryStocktakeInfo;
  };

  type QueryStocktakeLocation = {
    /** 盘点计划ID，必填 */
    stocktakeId?: number;
    /** 货位编号，非必填 */
    locationCode?: string;
  };

  type QueryStocktakeLocationPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryStocktakeLocation;
  };

  type QueryTaskInfo = {
    /** 任务编号 */
    taskCode?: string;
    /** 容器类型 */
    containerTypeId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 任务类型 */
    taskType?: EnumTaskType[];
    /** 任务状态 */
    taskStatus?: EnumTaskStatus[];
    /** 起始区域 */
    fromAreaId?: number;
    /** 目标区域 */
    toAreaId?: number;
    /** 起始位置 */
    fromPositionCode?: string;
    /** 目标位置 */
    toPositionCode?: string;
  };

  type QueryTaskInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryTaskInfo;
  };

  type QueryTunnelInfo = {
    /** 巷道编号 */
    tunnelCode?: string;
    /** 巷道名称 */
    tunnelName?: string;
  };

  type QueryTunnelInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryTunnelInfo;
  };

  type QueryUserInfo = {
    /** 用户名称 */
    userName?: string;
    /** 实名 */
    realName?: string;
    /** 工号 */
    jobNumber?: string;
    /** 手机号 */
    phoneNumber?: string;
    /** 部门名称 */
    departmentName?: string;
  };

  type QueryUserInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryUserInfo;
  };

  type QueryWarehouseInfo = {
    /** 仓库编号 */
    warehouseCode?: string;
    /** 仓库名称/别名 */
    warehouseName?: string;
  };

  type QueryWarehouseInfoPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryWarehouseInfo;
  };

  type QueryWavenumberHead = {
    /** 波次单号 */
    wavenumberCode?: string;
    /** 波次单名称 */
    wavenumberName?: string;
    /** 波次单状态 */
    wavenumberStatus?: number[];
    /** 发货单号 */
    invoiceCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 目标区域 */
    toAreaId?: number;
    /** 起始创建时间 */
    fromCreateTime?: string;
    /** 结束创建时间 */
    toCreateTime?: string;
  };

  type QueryWavenumberHeadPageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryWavenumberHead;
  };

  type QueryWavenumberLine = {
    /** 波次单号 */
    wavenumberCode?: string;
  };

  type QueryWavenumberLinePageingParameter = {
    /** 页索引 */
    pageIndex?: number;
    /** 页大小 */
    pageSize?: number;
    /** 排序字段 */
    sortFiledList?: SortByModel[];
    query?: QueryWavenumberLine;
  };

  type R = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    statusCode?: EnumStatusCode;
    /** 接口执行结果数据 */
    resultData?: any;
  };

  type RcsBorder = {
    downLeft?: RcsPosition;
    upRight?: RcsPosition;
  };

  type RcsPoint = {
    id?: number;
    position?: RcsPosition;
  };

  type RcsPointData = {
    border?: RcsBorder;
    points?: RcsPoint[];
  };

  type RcsPointDataR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: RcsPointData;
    statusCode?: EnumStatusCode;
  };

  type RcsPosition = {
    x?: number;
    y?: number;
  };

  type ReceiptCombineInfoDTO = {
    combineOption?: EnumCombineOption;
    /** 组盘位置编号 */
    locationCode?: string;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    carryStatus?: EnumCarryStatus;
    /** 容器类型ID */
    containerTypeId?: number;
    combineItemList?: ReceiptCombineItemInfoDTO[];
  };

  type ReceiptCombineItemInfoDTO = {
    /** 物料标识 */
    materialUID?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 包装名称 */
    packagingName?: string;
    /** 规格 */
    materialSize?: string;
    qualityStatus?: EnumQualityStatus;
    /** 有效期(天数) */
    expiresDays?: number;
    /** 收货日期 */
    receivingDate?: string;
    /** 批次号 */
    batchNumber?: string;
    /** 收货数量 */
    quantity?: number;
    /** 供应商ID,ContactsInfo表主键 */
    supplierId?: number;
    /** 收货单号 */
    receiptCode?: string;
    /** 收货单行号 */
    receiptLineNumber?: string;
    /** 收货单行ID */
    receiptLineId?: number;
    /** 描述信息 */
    materialItemDescription?: string;
  };

  type ReceiptLineInfoDTO = {
    /** 收货单明细id */
    id?: number;
    /** 收货单号 */
    receiptCode?: string;
    /** 收货单行号 */
    receiptLineNumber?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料批次号 */
    batchNumber?: string;
    qualityStatus?: EnumQualityStatus;
    /** 数量 */
    receivableQuantity?: number;
  };

  type RelationLocationGroupAllotModeInfoDTO = {
    warehouseId?: number;
    /** 主键，雪花ID */
    id?: number;
    /** 入库策略 */
    allotLocationModeId?: number;
    /** 区域ID */
    areaId?: number;
    /** 货位分组ID */
    locationGroupId?: number;
    /** 优先级 */
    priority?: number;
    sortMode?: EnumAllotLocationSortMode;
  };

  type ReportInventoryDailyInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 报表日期 */
    reportDate?: string;
    /** 库存数量 */
    inventoryTotal?: number;
    /** 收货物料总数 */
    receivingTotal?: number;
    /** 发货物料总数 */
    shipmentTotal?: number;
    /** 待检数量 */
    unCheckedTotal?: number;
    /** 良品数量 */
    qualifiedTotal?: number;
    /** 不良品数量 */
    unqualifiedTotal?: number;
  };

  type ReportInventoryDailyInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: ReportInventoryDailyInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type ReportInventoryDailyInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: ReportInventoryDailyInfoDTO[];
  };

  type ReportInventoryDailyInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: ReportInventoryDailyInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type ReportLocationDailyInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 报表日期 */
    reportDate?: string;
    /** 空库位总数 */
    emptyLocationTotal?: number;
    /** 放物料的库位总数 */
    fullContainerLocationTotal?: number;
    /** 放空容器的库位总数 */
    emptyContainerLocationTotal?: number;
  };

  type ReportLocationDailyInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: ReportLocationDailyInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type ReportLocationDailyInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: ReportLocationDailyInfoDTO[];
  };

  type ReportLocationDailyInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: ReportLocationDailyInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type ReportTaskDailyInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 报表日期 */
    reportDate?: string;
    /** 入库任务数 */
    inTotal?: number;
    /** 出库任务数 */
    outTotal?: number;
    /** 越库任务数 */
    crossTotal?: number;
    /** 移库任务数 */
    moveTotal?: number;
  };

  type ReportTaskDailyInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: ReportTaskDailyInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type ReportTaskDailyInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: ReportTaskDailyInfoDTO[];
  };

  type ReportTaskDailyInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: ReportTaskDailyInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type ReportTaskInfoDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 任务编号 */
    taskCode?: string;
    /** 容器编号 */
    containerCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 物料数量 */
    materialQuantity?: number;
    taskStatus?: EnumTaskStatus;
    taskType?: EnumTaskType;
    taskExecuteType?: EnumTaskExecuteType;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  type ReportTaskInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: ReportTaskInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type RequestLocationDTO = {
    /** 任务编号 */
    taskCode?: string;
    /** 托盘编号 */
    palletCode?: string;
    /** 当前目标位置 */
    toPosition?: string;
    /** 提交申请位置 */
    requestPosition?: string;
  };

  type RoleInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 权限ID */
    permissionId?: number;
    /** 角色名称 */
    roleName?: string;
    /** 描述信息 */
    roleDescription?: string;
  };

  type RoutingInfoDTO = {
    /** 主键，雪花ID */
    id: string;
    /** 路径编号，唯一 */
    code: string;
    /** 路径名称 */
    name: string;
    /** 起始区域 */
    fromArea: number;
    /** 目标区域 */
    toArea: number;
    taskExecuteType: EnumTaskExecuteType;
    /** WCS名称配置，用于任务分发 */
    wcsName: string;
    /** 是否空托解绑：1-是，0-否 */
    isEmptyDismiss: boolean;
    /** 是否实托解盘：1-是，0-否 */
    isFullDismiss: boolean;
    /** 启用状态 */
    isEnable: boolean;
    /** 优先级 */
    priority: number;
  };

  type SelectItem = {
    /** 选项ID */
    itemId?: string;
    /** 选项值 */
    itemValue?: string;
    /** 选项名称 */
    itemName?: string;
    /** 数据项目 */
    dataItem?: any;
  };

  type SelectItemListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: SelectItem[];
    statusCode?: EnumStatusCode;
  };

  type ShelfInfoDTO = {
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    height: number;
    /** 主键，雪花ID */
    id: string;
    /** 货架编号 */
    shelfCode: string;
    /** 货架名称 */
    shelfName: string;
    shelvesType: EnumShelvesType;
    /** 是否纵向排列 */
    isDirection: boolean;
  };

  type ShelfInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: ShelfInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type SortByModel = {
    /** 排序字段 */
    fieldName?: string;
    sortType?: EnumSortType;
  };

  type StocktakeInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 盘点计划号 */
    stocktakeCode?: string;
    /** 搬运目标区域 */
    targetAreaId?: number;
    /** 盘点计划描述 */
    stocktakeDescription?: string;
  };

  type StocktakeLocationInfoDTO = {
    /** 盘点库位ID */
    stocktakeLocationId?: number;
    /** 被盘库位Id */
    locationId?: number;
    /** 被盘库位编号 */
    locationCode?: string;
    /** 被盘库位编号(自定义)-显示 */
    customCode?: string;
    /** 当前容器位置 */
    containerPosition?: string;
    /** 当前容器位置编号-显示 */
    containerPositionCode?: string;
    containerPositionType?: EnumPositionType;
    /** 容器ID */
    containerId?: number;
    /** 容器编号-显示 */
    containerCode?: string;
    /** 是否允许回库-显示 */
    isAllowReturn?: boolean;
  };

  type StocktakeRecordInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 盘点计划号 */
    stocktakeCode?: string;
    stocktakeStatus?: EnumStocktakeStatus;
    /** 被盘点库位编号 */
    locationCode?: string;
    /** 被盘库位编号(自定义)-显示 */
    customCode?: string;
    /** 容器编号 */
    containerCode?: string;
    /** 物料编号 */
    materialCode?: string;
    /** 物料名称 */
    materialName?: string;
    /** 规格 */
    materialSize?: string;
    /** 批次号 */
    batchNumber?: string;
    qualityStatus?: EnumQualityStatus;
    /** 盘前库存数量 */
    stocktakeQuantity?: number;
    /** 盘后数量 */
    adjustedQuantity?: number;
    stocktakeRecordStatus?: EnumStocktakeRecordStatus;
    /** 盈亏备注 */
    stocktakeRecordRemark?: string;
  };

  type StocktakeRecordInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: StocktakeRecordInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type StrategyClass = {
    /** 策略类名 */
    className?: string;
    /** 显示名称 */
    displayName?: string;
    /** 策略属性集 */
    propertyList?: StrategyProperty[];
  };

  type StrategyClassListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: StrategyClass[];
    statusCode?: EnumStatusCode;
  };

  type StrategyProperty = {
    /** 策略类名 */
    className?: string;
    /** 策略属性名 */
    propertyName?: string;
    /** 属性值类型 */
    propertyType?: string;
    /** 显示名称 */
    displayName?: string;
    inputType?: EnumPropertyInputType;
    /** 属性值集合 */
    propertyValueList?: SelectItem[];
  };

  type StringListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: string[];
    statusCode?: EnumStatusCode;
  };

  type StringR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: string;
    statusCode?: EnumStatusCode;
  };

  type SysAreaReceivingSettingDTO = {
    id?: number;
    areaID?: number;
    receivingBusinessType?: EnumSysReceivingBusinessType;
    receivingBusinessTypeDes?: string;
    isAllow?: boolean;
    isTransit?: boolean;
  };

  type SysParamInfo = {
    id?: number;
    group?: string;
    name?: string;
    key?: string;
    type?: EnumParamType;
    value?: string;
    isConfigurable?: boolean;
    isDisable?: boolean;
  };

  type TaskApplyDTO = {
    /** 托盘编号 */
    palletCode?: string;
    /** 申请取货位置 */
    requestPosition?: string;
    /** 申请放货位置 */
    requestPutPosition?: string;
    /** 任务类型 （1、入库。2、出库。3、移库） */
    taskType?: number;
    /** 托盘载货状态（0未知、1空、2满） */
    carryState?: number;
    /** 货物类型 */
    cargoType?: number;
    /** 设备触发任务提交的参数Json字符串 */
    cargoParams?: string;
  };

  type TaskInfo = {
    id?: number;
    taskCode?: string;
    dependentTaskId?: number;
    taskPriority?: number;
    containerTypeId?: number;
    containerId?: number;
    taskType?: EnumTaskType;
    taskStatus?: EnumTaskStatus;
    isToWcs?: boolean;
    locationGroupID?: number;
    allotLocationSortMode?: EnumAllotLocationSortMode;
    isLockRealLocation?: boolean;
    routingId?: number;
    taskExecuteType?: EnumTaskExecuteType;
    fromAreaId?: number;
    toAreaId?: number;
    fromPositionCode?: string;
    toPositionCode?: string;
    postStatus?: EnumPostStatus;
    postStatusDescription?: string;
    isAlarm?: boolean;
    taskAlarmType?: EnumTaskAlarmType;
    alarmDescription?: string;
    createTime?: string;
    updateUserName?: string;
    updateTime?: string;
  };

  type TaskInfoR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: TaskInfo;
    statusCode?: EnumStatusCode;
  };

  type ToPositionDTO = {
    /** 分配的目标库位 */
    toPosition?: string;
  };

  type ToPositionDTOWCSResponseResult = {
    /** 接口执行结果是否成功（200代表执行成功） */
    status?: number;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: ToPositionDTO;
    /** 是否还有后续任务，WCS以此判断是否释放当前小车空闲 */
    isNextTask?: boolean;
  };

  type TunnelInfoDTO = {
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    height: number;
    /** 主键id */
    id: string;
    /** 巷道编号 */
    tunnelCode: string;
    /** 巷道名称 */
    tunnelName: string;
    /** 巷道描述 */
    tunnelDescribe: string;
  };

  type TunnelInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: TunnelInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type UpdataPermissionItemInfoDTO = {
    /** 权限ID */
    permissionId?: number;
    /** 权限明细 */
    permissionItemInfosDTO?: PermissionItemInfoDTO[];
  };

  type UpdateAllocationDTO = {
    /** 出库需求ID */
    requirementId?: number;
    /** 取消的分配明细ID集合 */
    allocationItemIdList?: number[];
  };

  type UpLoadTaskErrorDTO = {
    /** 任务编号 */
    taskCode?: string;
    /** 托盘编号 */
    palletCode?: string;
    /** 异常类型（0未知、1占位异常、2取空异常） */
    errorType?: number;
  };

  type UpLoadTaskStatusDTO = {
    /** 任务编号 */
    taskCode?: string;
    /** 托盘编号 */
    palletCode?: string;
    taskStatus?: WcsTaskStatus;
    /** 取货位置 */
    fromPosition?: string;
    /** 放货位置 */
    toPosition?: string;
  };

  type UserInfoDTO = {
    /** 主键，雪花ID */
    id?: number;
    /** 所属角色 */
    roleId?: number;
    /** 账号名称 */
    userName?: string;
    /** 账号密码 */
    userPwd?: string;
    /** 用户头像 */
    avator?: string;
    /** 姓名 */
    realName?: string;
    userSex?: EnumSex;
    /** 出生日期 */
    birthday?: string;
    /** 工号 */
    jobNumber?: string;
    /** 电话 */
    phoneNumber?: string;
    /** email */
    userEmail?: string;
    /** 部门名称 */
    departmentName?: string;
  };

  type UserPermissionDTO = {
    /** 主键，雪花ID */
    id?: string;
    /** 所属角色 */
    roleId?: string;
    /** 角色名称 */
    roleName?: string;
    /** 是否超级管理员 */
    isAdmin?: boolean;
    /** 账号名称 */
    userName?: string;
    /** 用户头像 */
    avator?: string;
    /** 姓名 */
    realName?: string;
    userSex?: EnumSex;
    userSexDisplay?: string;
    /** 出生日期 */
    birthday?: string;
    /** 工号 */
    jobNumber?: string;
    /** 电话 */
    phoneNumber?: string;
    /** email */
    userEmail?: string;
    /** 部门名称 */
    departmentName?: string;
    /** 添加者 */
    createName?: string;
    /** 添加时间 */
    createTime?: string;
    /** 权限 */
    permission?: OutputMenuInfoDTO[];
  };

  type UserPermissionDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: UserPermissionDTO;
    statusCode?: EnumStatusCode;
  };

  type WaitAllocationItemInfoDTO = {
    /** 主键ID */
    id?: number;
    /** 出库需求ID */
    outboundRequirementId?: number;
    /** 库存ID */
    inventoryId?: number;
    /** 已分配数量 */
    quantity?: number;
    /** 容器ID */
    containerId?: number;
    /** 容器编号 */
    containerCode?: string;
    /** 库位ID/工作台ID */
    locationId?: number;
    /** 容器库位编号 */
    locationCode?: string;
    /** 库位编号（自动义） */
    customCode?: string;
    /** 容器所处区域 */
    areaId?: number;
    /** 容器所处区域编号 */
    areaCode?: string;
    /** 容器所处区域 */
    areaName?: string;
    qualityStatus?: EnumQualityStatus;
    /** 物料编号 */
    materialCode?: string;
    /** 收货日期 */
    receivingDate?: string;
    /** 是否拣选完成 */
    isPickingFinish?: boolean;
    /** 拣选数量 */
    pickingQuantity?: number;
    /** 是否取消 */
    isCancel?: boolean;
    /** 已分配锁定库存 */
    lockQuantity?: number;
  };

  type WaitAllocationItemInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: WaitAllocationItemInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type WarehouseInfoDTO = {
    x?: number;
    y?: number;
    z?: number;
    length?: number;
    width?: number;
    height?: number;
    /** 仓库id */
    id: string;
    /** 仓库编号 */
    warehouseCode?: string;
    /** 仓库名称 */
    warehouseName?: string;
    /** 仓库别名 */
    aliasName?: string;
    /** 仓库描述 */
    warehouseDescribe?: string;
  };

  type WarehouseInfoDTOListR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    /** 接口执行结果数据 */
    resultData?: WarehouseInfoDTO[];
    statusCode?: EnumStatusCode;
  };

  type WarehouseInfoDTOPageResult = {
    /** 页大小 */
    pageSize?: number;
    /** 页索引 */
    pageIndex?: number;
    /** 总数量 */
    totalCount?: number;
    /** 分页数据 */
    pageData?: WarehouseInfoDTO[];
  };

  type WarehouseInfoDTOPageResultR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: WarehouseInfoDTOPageResult;
    statusCode?: EnumStatusCode;
  };

  type WarehouseInfoDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: WarehouseInfoDTO;
    statusCode?: EnumStatusCode;
  };

  type WarehouseSummaryDTO = {
    /** 物料总库存 */
    materialInventoryTotal?: number;
    /** 满托盘数 */
    fullContainerTotal?: number;
    /** 空托盘数 */
    emptyContainerTotal?: number;
    /** 库容 */
    locationTotal?: number;
    /** 满库位 */
    fullLocationTotal?: number;
    /** 空库位 */
    emptyLocationTotal?: number;
  };

  type WarehouseSummaryDTOR = {
    /** 接口执行结果是否成功 */
    success?: boolean;
    /** 接口执行结果信息（一般执行异常返回异常消息） */
    message?: string;
    resultData?: WarehouseSummaryDTO;
    statusCode?: EnumStatusCode;
  };

  type WavenumberHeaderInfoDTO = {
    /** 波次id */
    id?: number;
    /** 波次单头编号 */
    wavenumberCode?: string;
    /** 波次单名称 */
    wavenumberName?: string;
    wavenumberStatus?: EnumWavenumberStatus;
    /** 描述信息 */
    waveHeaderDescription?: string;
    /** 搬运目标区域 */
    toAreaId?: number;
    /** 创建时间 */
    createTime?: string;
  };

  type WavenumberLineInfoDTO = {
    /** 波次行Id */
    id?: number;
    /** 波次单号 */
    wavenumberCode?: string;
    /** 波次单行行号 */
    wavenumberLineNumber?: string;
    /** 物料ID */
    materialId?: number;
    /** 物料编号 */
    materialCode?: string;
    /** 物料型号ID */
    materialModelId?: number;
    /** 物料型号 */
    materialModelName?: string;
    /** 物料批次号 */
    batchNumber?: string;
    /** 数量 */
    quantity?: number;
    wavenumberLineStatus?: EnumWavenumberStatus;
    /** 是否自动完成 */
    isAutocomplete?: boolean;
    /** 描述信息 */
    wavenumberLineDescription?: string;
  };

  type WcsTaskStatus = 2 | 5 | 6 | 7 | 8;

  type WeatherForecast = {
    date?: string;
    temperatureC?: number;
    temperatureF?: number;
    summary?: string;
  };

  type ICustomer = {
    displayName: string;
    id: string;
    name: string;
  }

  type IWarehouse = {
    id: string;
    name: string;
    wmsWarehouse: WarehouseInfoDTO
  }
}
