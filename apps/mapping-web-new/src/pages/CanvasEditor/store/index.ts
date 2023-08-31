import Konva from "konva";
import { has, omit, pick, round, uniqBy } from "lodash";
import { makeAutoObservable, toJS } from "mobx";
import { RefObject } from "react";
import {
  AREA_NAME_PREFIX,
  getAreaLabel,
  getLocationGroupLabel,
  getLocationLabel,
  getRouteLabel,
  getShelfLabel,
  getTunnelLabel,
  LOCATION_NAME_PREFIX,
  POINT_NAME_PREFIX,
  RECT_NAME_PREFIX,
  ROUTE_NAME_PREFIX,
  SHELF_NAME_PREFIX,
  Tabs,
  TUNNEL_NAME_PREFIX,
  TUNNELAREA_GROUP_NAME,
  TUNNELAREA_NAME_PREFIX,
} from "@/constants";

import { EOperationMode, ETabKey } from "@/typings";
import { getTenantIdIC, getWarehouseIdIC, getWmsWarehouseIdIC, setTenantIdIC, setWarehouseIdIC, setWmsWarehouseIdIC } from "@packages/utils";
import { getIntersectionByGroups } from "@/utils";
import { generateUUID } from "@packages/utils"
export const TOP_HEIGHT = 56;
export const ASIDE_WIDTH = 72;
export const COLLAPSE_WIDTH = 240;

const WAREHOUSE_KEY = "warehouse";
const RCS_POINTS_KEY = "rcsPoints";

export enum EDrawerType {
  Area = "area",
  Tunnel = "tunnel",
  Shelf = "shelf",
  Common = "common", //	区域、货位、巷道、货架抽屉
  Batch = "batch", //	批量填充、更新货位抽屉
  Routing = "routing", //	路径抽屉
  LocationGroup = "locationGroup", // 货位分组抽屉
  TunnelArea = 'tunnelArea'
}

export const getInitialValuesFromShape = (shape: Konva.Shape) => {
  const initialValues = shape.attrs.initialValues as
    | Editor.IWarehouseDataItem
    | undefined;
  return initialValues;
}

interface IPoint {
  x: number;
  y: number;
  id: string;
  puDoPoint: string;
}

interface IBatchLocationsInfo {
  areaInfo: Editor.Area;
  tunnelInfo: Editor.TunnelArea;
  shelfInfo: Editor.Shelf;
  locationInfo: Editor.Location | undefined;  // locationInfo为undefined时，此时时新增状态
  points: IPoint[];
}

interface IRouteInfo {
  route?: Editor.IRouting;
  area?: Editor.Area;
}

interface ILocationInfo {
  areaId: string;
  shelfId: string;
}

function getStorage(key: string) {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key) as string)
    : undefined;
}

export default class EditorStore {
  canvasLayouts: ILayouts;
  // CADToCanvasRadio: number;
  stageSize: ISize;
  collapse: boolean;
  // offset: IVector;
  activeShape: Konva.Shape | null;
  activePosition: IVectorSize;
  warehouse: API.WarehouseInfoDTO | undefined;
  rcsPoints: RCSPoints | undefined;
  stageLoading: boolean;
  rightMenuStyles: IPosition;
  batchLocationsInfo: IBatchLocationsInfo | undefined;
  currentTab: ETabKey;
  editId: string | undefined;
  trRef: RefObject<Konva.Transformer> | null;
  stageRef: RefObject<Konva.Stage> | null;
  locationInfo: ILocationInfo | null;
  drawerType: EDrawerType | undefined;
  inGroupLocations: Konva.Shape[]; //	正处于分组中的库位
  groupColor: string;
  editGroupInfo: Editor.ILocationGroup | undefined;

  activeMode: EOperationMode;

  editAreaInfo: Editor.Area | undefined;
  isDrawingTunnel: boolean;
  editTunnelInfo: Editor.Tunnel | undefined;
  tunnelAreaOptions: string[];
  editShelfInfo: Editor.Shelf | undefined;
  editTunnelAreaInfo: Editor.TunnelArea | undefined;
  tunnelInfos: API.TunnelInfoDTO[];
  editRouteInfo: IRouteInfo | undefined;

  paintedRects: Konva.RectConfig[];
  tenantId: string;
  warehouseid: string;
  wmswarehouseid: string;

  paintingStatus: Editor.IPaintingStatus;

  constructor() {
    this.collapse = false;
    this.stageSize = {
      width: window.innerWidth - ASIDE_WIDTH - COLLAPSE_WIDTH,
      height: window.innerHeight - TOP_HEIGHT,
    };
    this.canvasLayouts = { offsetX: 0, offsetY: 0, radio: 1 };

    this.rightMenuStyles = { left: -500, top: -500 };
    this.activeShape = null;
    this.activePosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    this.warehouse = getStorage(WAREHOUSE_KEY);
    this.rcsPoints = getStorage(RCS_POINTS_KEY);
    this.stageLoading = false;
    this.batchLocationsInfo = undefined;
    this.editId = undefined;
    this.locationInfo = null;
    this.inGroupLocations = [];
    this.groupColor = "#f97316";
    this.editGroupInfo = undefined;
    this.currentTab = ETabKey.Area;
    this.trRef = null;
    this.stageRef = null;
    this.drawerType = undefined;
    this.activeMode = EOperationMode.Drag;
    this.editAreaInfo = undefined;
    this.editTunnelInfo = undefined;
    this.editShelfInfo = undefined;
    this.isDrawingTunnel = false;
    this.tunnelInfos = []
    this.editTunnelAreaInfo = undefined;
    this.editRouteInfo = undefined;
    this.paintedRects = [];
    this.tenantId = getTenantIdIC() ?? "";
    this.warehouseid = getWarehouseIdIC() ?? "";
    this.wmswarehouseid = getWmsWarehouseIdIC() ?? "";
    this.paintingStatus = {
      tunnelAreas: []
    }
    this.tunnelAreaOptions = []
    makeAutoObservable(this);
  }

  get isDragMode() {
    return this.activeMode === EOperationMode.Drag;
  }

  get currentTabIndex() {
    return Tabs.findIndex((tab) => tab.key === this.currentTab);
  }

  get shouldPainting() {
    return (
      this.activeMode !== undefined &&
      [EOperationMode.Rect, EOperationMode.Selection].includes(this.activeMode)
    );
  }

  get isSelectionMode() {
    return this.activeMode === EOperationMode.Selection;
  }

  get isDrawerOpen() {
    return this.drawerType !== undefined;
  }

  get isAreaDrawerOpen() {
    return this.drawerType === EDrawerType.Area;
  }

  get isTunnelDrawerOpen() {
    return this.drawerType === EDrawerType.Tunnel;
  }

  get isTunnelAreaDrawerOpen() {
    return this.drawerType === EDrawerType.TunnelArea;
  }

  get isShelfDrawerOpen() {
    return this.drawerType === EDrawerType.Shelf;
  }

  get isCommonDrawerOpen() {
    return this.drawerType === EDrawerType.Common;
  }
  get isBatchDrawerOpen() {
    return this.drawerType === EDrawerType.Batch;
  }
  get isRoutingDrawerOpen() {
    return this.drawerType === EDrawerType.Routing;
  }
  get isLocationGroupDrawerOpen() {
    return this.drawerType === EDrawerType.LocationGroup;
  }

  get isLocationGroupTab() {
    return this.currentTab === ETabKey.LocationGroup;
  }

  get isTunnelTab() {
    return this.currentTab === ETabKey.Tunnel;
  }

  get isLocationTab() {
    return this.currentTab === ETabKey.Location;
  }

  get isRoutingTab() {
    return this.currentTab === ETabKey.Route;
  }

  get isShelfTab() {
    return this.currentTab === ETabKey.Shelf;
  }

  get activeShapeName() {
    return this.activeShape?.name?.() ?? "";
  }

  // RCS点位或者绘制的点位
  get isPointTarget() {
    return this.activeShapeName.startsWith(POINT_NAME_PREFIX);
  }

  get isAreaTarget() {
    return this.activeShapeName.startsWith(AREA_NAME_PREFIX);
  }

  get isRectTarget() {
    return this.activeShapeName.startsWith(RECT_NAME_PREFIX);
  }

  get isTunnelTarget() {
    return this.activeShapeName.startsWith(TUNNEL_NAME_PREFIX);
  }

  get isShelfTarget() {
    return this.activeShapeName.startsWith(SHELF_NAME_PREFIX);
  }

  get isRoutingTarget() {
    return this.activeShapeName.startsWith(ROUTE_NAME_PREFIX);
  }

  get isLocationTarget() {
    return this.activeShapeName.startsWith(LOCATION_NAME_PREFIX);
  }

  get isCURDRequired() {
    return (
      this.isAreaTarget ||
      this.isShelfTarget ||
      this.isTunnelTarget ||
      this.isRoutingTarget ||
      this.isLocationTarget
    );
  }

  get isEditing() {
    return Boolean(this.editId);
  }

  // get currentTabContent() {
  //   if (Tab_Map.has(this.currentTab)) {
  //     return Tab_Map.get(this.currentTab);
  //   }
  //   return Tab_Map.get(ETabKey.Area);
  // }

  get shapeAttrs() {
    return pick(this.activeShape?.attrs, ["x", "y", "width", "height"]);
  }

  get collapseWidth() {
    return this.collapse ? 0 : COLLAPSE_WIDTH;
  }

  get warehouseTitle() {
    return this.warehouse?.aliasName ?? "";
  }

  // setRadio(radio: number) {
  // 	this.CADToCanvasRadio = radio;
  // }

  resetStageSize() {
    const width = window.innerWidth - ASIDE_WIDTH - this.collapseWidth;
    const height = window.innerHeight - TOP_HEIGHT;
    this.stageSize = { width, height };
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
    this.resetStageSize();
  }

  // setStageOffset(offset: { x: number; y: number }) {
  // 	this.offset = offset;
  // }
  setCanvasLayouts(layouts: ILayouts) {
    this.canvasLayouts = layouts;
  }

  setActivePosition(attrs: IVectorSize) {
    let pos = this.getCADPosition(attrs);
    if (this.isLocationTab) {
      pos = omit(pos, ["width", "height"]);
    }
    this.activePosition = pos;
    return pos;
  }

  setActiveShape(shape: Konva.Shape) {
    this.activeShape = shape;
    this.setActivePosition(shape.attrs);
  }

  getCADPosition({ x, y, width, height }: IVectorSize) {
    const { radio, offsetX, offsetY } = this.canvasLayouts;
    return {
      x: round(x / radio + offsetX, 4),
      y: round((y / radio + offsetY) * -1, 4),
      width: round(width / radio, 4),
      height: round(height / radio, 4),
    };
  }

  getCanvasPosition({ x, y, width, height }: IVectorSize) {
    const { radio, offsetX, offsetY } = this.canvasLayouts;
    return {
      x: round((x - offsetX) * radio, 4),
      y: round((y * -1 - offsetY) * radio, 4),
      width: round(width * radio, 4),
      height: round(height * radio, 4),
    };
  }

  resetActiveShape() {
    this.activeShape = null;
    this.resetActivePosition();
  }

  resetActivePosition() {
    this.activePosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  isShapeActive(name: string) {
    return (this.activeShape?.name() ?? "") === name;
  }

  setWarehouse(w: API.WarehouseInfoDTO) {
    this.warehouse = w;
    localStorage.setItem(WAREHOUSE_KEY, JSON.stringify(w));
  }

  setRCSPoints(p: RCSPoints) {
    this.rcsPoints = p;
    localStorage.setItem(RCS_POINTS_KEY, JSON.stringify(p));
  }

  setStageLoading(l: boolean) {
    this.stageLoading = l;
  }

  setRightMenuStyles(s: IPosition) {
    this.rightMenuStyles = s;
  }

  hideMenu() {
    this.rightMenuStyles = { left: -500, top: -500 };
  }

  onBatchAddLocations(b: IBatchLocationsInfo) {
    this.setCurrentTab(ETabKey.Location);
    this.setDrawerType(EDrawerType.Batch);
    this.hideMenu();
    this.batchLocationsInfo = {
      ...this.batchLocationsInfo,
      ...b,
    };
  }

  // onBatchUpdateLocations(b: IBatchLocations) {
  //   this.setDrawerType(EDrawerType.Batch);
  //   this.hideMenu();
  //   this.batchLocationsInfo = {
  //     ...this.batchLocationsInfo,
  //     ...b,
  //   };
  // }

  onBatchDrawerClose() {
    this.closeDrawer();
    this.batchLocationsInfo = undefined;
  }

  setCurrentTab(t: ETabKey) {
    this.currentTab = t;
  }

  onAddLocation(point: Konva.Circle, info: ILocationInfo) {
    this.setDrawerType(EDrawerType.Common);
    this.setActiveShape(point);
    this.locationInfo = info;
    this.setActiveMode(EOperationMode.Drag);
  }

  onAddCommon(tab: ETabKey) {
    this.setCurrentTab(tab);
    this.editId = undefined;
    this.hideMenu();
    this.setDrawerType(EDrawerType.Common);
  }

  onCommonDrawerClose() {
    this.closeDrawer();
    if (!this.isEditing) {
      this.activeShape?.destroy();
    }
    this.trRef?.current?.nodes([]);
    this.editId = undefined;
    this.activeShape = null;
    this.locationInfo = null;
    this.activePosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  setTrRef(r: RefObject<Konva.Transformer>) {
    this.trRef = r;
  }

  setStageRef(s: RefObject<Konva.Stage>) {
    this.stageRef = s;
  }

  async onRightMenuDelete(onDeleted: (tab: ETabKey) => void) {
    // this.closeDrawer();
    // const tab = this.getTabByName();
    // this.setCurrentTab(tab);
    // const id = this.activeShape?.id() as unknown as number;
    // const api = Tab_Map.get(tab)?.deleteApi;
    // await api?.({ id });
    // this.activeShape?.destroy();
    // this.hideMenu();
    // onDeleted?.(tab);
  }

  setDrawerType(d: EDrawerType) {
    this.drawerType = d;
  }

  closeDrawer() {
    this.drawerType = undefined;
    this.trRef?.current?.nodes([]);
  }

  onAddRouting() {
    this.setDrawerType(EDrawerType.Routing);
    this.hideMenu();
  }

  appendLocations(l: Konva.Shape[]) {
    this.inGroupLocations = uniqBy([...this.inGroupLocations, ...l], (p) =>
      p.id()
    );
    this.inGroupLocations.forEach((p) => {
      p.fill(this.groupColor);
    });
  }

  onAddLocationGroup() {
    this.hideMenu();
    this.setCurrentTab(ETabKey.LocationGroup);
    this.setDrawerType(EDrawerType.LocationGroup);
  }

  onDeleteLocation(l: Editor.Location) {
    this.inGroupLocations = this.inGroupLocations.filter((inGroupLocation) => {
      const id = inGroupLocation.id();
      if (id === l.id) {
        inGroupLocation.fill("#7e22ce");
        return false;
      }
      return true;
    });
  }

  onGroupColorChange(color: string) {
    this.groupColor = color;
    this.inGroupLocations.forEach((p) => {
      p.fill(this.groupColor);
    });
  }

  onEditLocationGroup(editItem: Editor.ILocationGroup) {
    this.editGroupInfo = editItem;
    this.resetLocationsColor();
    this.inGroupLocations = [];
    this.editId = editItem.id as unknown as string;
    this.groupColor = editItem.groupColor!;
    editItem.locationList?.forEach((l) => {
      const shape = this.stageRef?.current?.findOne("#" + l.id) as Konva.Shape;
      shape.fill(this.groupColor);
      this.inGroupLocations.push(shape);
    });
    this.setDrawerType(EDrawerType.LocationGroup);
  }

  resetLocationsColor() {
    this.inGroupLocations.forEach((p) => {
      p?.fill?.("#7e22ce");
    });
  }

  onLocationGroupClose() {
    this.resetLocationsColor();
    this.inGroupLocations = [];
    this.editGroupInfo = undefined;
    this.groupColor = "#f97316";
    this.closeDrawer();
  }

  setActiveMode(m: EOperationMode) {
    this.activeMode = m;
  }

  onModeChange(o: IOperation) {
    this.setActiveMode(o.key);
    this.closeDrawer();
  }

  getTabByName() {
    let currentTab = ETabKey.Area;
    if (this.isAreaTarget) {
      currentTab = ETabKey.Area;
    } else if (this.isTunnelTarget) {
      currentTab = ETabKey.Tunnel;
    } else if (this.isShelfTarget) {
      currentTab = ETabKey.Shelf;
    } else if (this.isRoutingTarget) {
      currentTab = ETabKey.Route;
    } else {
      currentTab = ETabKey.Location;
    }
    return currentTab;
  }

  appendPaintedRect(rect: Konva.RectConfig) {
    this.paintedRects.push(rect);
  }

  clearPaintedRect(name: string) {
    this.paintedRects = this.paintedRects.filter(
      (paintedRect) => paintedRect.name !== name
    );
  }
  setTenantId(val: string) {
    this.tenantId = val;
    setTenantIdIC(val);
  }
  setWarehouseId(val: API.IWarehouse) {
    this.warehouseid = val.id;
    this.wmswarehouseid = val.wmsWarehouse.id;
    setWarehouseIdIC(val.id);
    setWmsWarehouseIdIC(val.wmsWarehouse.id);
  }
  
  /* ----------------👇----------------画布相关操作----------------👇---------------- */
  onShapeSelected(shape: Konva.Shape) {
    const initialValues = getInitialValuesFromShape(shape);
    if (initialValues) {
      const tab = initialValues.tab;
      switch (tab) {
        case ETabKey.Area:
          this.onEditArea(initialValues, shape);
          break;
        case ETabKey.Tunnel:
          this.onEditTunnel(initialValues, shape);
          break;
        case ETabKey.Shelf:
          this.onEditShelf(initialValues, shape);
          break;
        case ETabKey.Route:
          this.onEditRoute({ route: initialValues }, shape);
          break;
        default:
          break;
      }
    } else {
    }
  }
  onRightMenuEdit() {
    this.hideMenu();
    if (!this.activeShape) return;
    this.onShapeSelected(this.activeShape);
  }
  /* ----------------👆----------------画布相关操作----------------👆---------------- */
  /* ----------------👇----------------区域增删改相关----------------👇---------------- */
  onAddArea(tab: ETabKey) {
    this.setCurrentTab(tab);
    this.editAreaInfo = undefined;
    this.hideMenu();
    this.setDrawerType(EDrawerType.Area);
  }
  onAreaDrawerClose() {
    this.closeDrawer();
    if (this.isRectTarget) {
      this.clearPaintedRect(this.activeShapeName);
    }
    this.trRef?.current?.nodes([]);
    this.editAreaInfo = undefined;
    this.resetActiveShape();
  }
  onEditArea(areaInfo: Editor.Area, editTarget: Konva.Shape) {
    this.editAreaInfo = areaInfo;
    this.setDrawerType(EDrawerType.Area);
    this.setActiveShape(editTarget);
    this.trRef?.current?.nodes([editTarget]);
  }
  /* ----------------👆----------------区域增删改相关----------------👆---------------- */
  /* ----------------👇----------------巷道增删改相关----------------👇---------------- */
  onAddTunnel(tab: ETabKey) {
    const includingTunnelAreas = getIntersectionByGroups(
      this.stageRef?.current!,
      this.activeShape!,
      [TUNNELAREA_GROUP_NAME],
      (shape) => shape.name().startsWith(TUNNELAREA_NAME_PREFIX)
    );
    const options = includingTunnelAreas.reduce<string[]>((acc, cur) => {
      const initialValues = cur.attrs.initialValues as Editor.TunnelArea | undefined;
      if(initialValues) {
        acc.push(initialValues.tunnelAreaCode)
      }
      return acc
    }, []);
    this.tunnelAreaOptions = options;
    this.setCurrentTab(tab);
    this.editTunnelInfo = undefined;
    this.hideMenu();
    this.setDrawerType(EDrawerType.Tunnel);
  }
  onTunnelDrawerClose() {
    this.closeDrawer();
    if (this.isRectTarget) {
      this.clearPaintedRect(this.activeShapeName);
    }
    this.trRef?.current?.nodes([]);
    this.editTunnelInfo = undefined;
    this.resetActiveShape();
  }
  onEditTunnel(tunnelInfo: Editor.Tunnel, editTarget: Konva.Shape) {
    this.editTunnelInfo = tunnelInfo;
    this.setDrawerType(EDrawerType.Tunnel);
    this.setActiveShape(editTarget);
    this.trRef?.current?.nodes([editTarget]);
  }
  /* ----------------👆----------------巷道增删改相关----------------👆---------------- */
  /* ----------------👇----------------货架增删改相关----------------👇---------------- */
  onAddShelf(tab: ETabKey) {
    this.setCurrentTab(tab);
    this.editShelfInfo = undefined;
    this.hideMenu();
    this.setDrawerType(EDrawerType.Shelf);
  }
  onShelfDrawerClose() {
    this.closeDrawer();
    if (this.isRectTarget) {
      this.clearPaintedRect(this.activeShapeName);
    }
    this.trRef?.current?.nodes([]);
    this.editShelfInfo = undefined;
    this.resetActiveShape();
  }
  onEditShelf(shelfInfo: Editor.Shelf, editTarget: Konva.Shape) {
    this.editShelfInfo = shelfInfo;
    this.setDrawerType(EDrawerType.Shelf);
    this.setActiveShape(editTarget);
    this.trRef?.current?.nodes([editTarget]);
  }
  /* ----------------👆----------------货架增删改相关----------------👆---------------- */
  /* ----------------👇----------------货架增删改相关----------------👇---------------- */
  setPaintingStatus(ps: Editor.IPaintingStatus) {
    this.paintingStatus = ps;
  }
  onAddTunnelArea() {
    this.setCurrentTab(ETabKey.Tunnel);
    this.editTunnelAreaInfo = undefined;
    this.isDrawingTunnel = false;
    this.hideMenu();
    this.setDrawerType(EDrawerType.TunnelArea);
  }
  onStartAddTunnel() {
    this.isDrawingTunnel = true;
    this.closeDrawer();
    this.resetActiveShape();
  }
  onAddTunnels() {
    this.tunnelInfos.push({
      id: 'tunnelInfos' + generateUUID(),
      ...this.activePosition,
      tunnelCode: '',
      tunnelDescribe: '',
      tunnelName: '',
      z: 0,
      length: 1000
    })
    this.setCurrentTab(ETabKey.Tunnel);
    this.setDrawerType(EDrawerType.TunnelArea);
  }
  onTunnelAreaDrawerClose() {
    this.closeDrawer();
    if (this.isRectTarget) {
      this.clearPaintedRect(this.activeShapeName);
    }
    this.trRef?.current?.nodes([]);
    this.editTunnelAreaInfo = undefined;
    this.resetActiveShape();
  }
  onEditTunnelArea(tunnelAreaInfo: Editor.TunnelArea, editTarget: Konva.Shape) {
    this.editTunnelAreaInfo = tunnelAreaInfo;
    this.setDrawerType(EDrawerType.TunnelArea);
    this.setActiveShape(editTarget);
    this.trRef?.current?.nodes([editTarget]);
  }
  /* ----------------👆----------------货架增删改相关----------------👆---------------- */
  /* ----------------👇----------------货架增删改相关----------------👇---------------- */
  onAddRoute(routeInfo: IRouteInfo, tab: ETabKey) {
    this.editRouteInfo = routeInfo;
    this.setCurrentTab(tab);
    this.hideMenu();
    this.setDrawerType(EDrawerType.Routing);
  }
  onRouteDrawerClose() {
    this.closeDrawer();
    if (this.isRectTarget) {
      this.clearPaintedRect(this.activeShapeName);
    }
    this.trRef?.current?.nodes([]);
    this.editRouteInfo = undefined;
    this.resetActiveShape();
  }
  onEditRoute(routeInfo: IRouteInfo, editTarget: Konva.Shape) {
    this.editRouteInfo = routeInfo;
    this.setDrawerType(EDrawerType.Routing);
    this.setActiveShape(editTarget);
  }
  /* ----------------👆----------------货架增删改相关----------------👆---------------- */
}
