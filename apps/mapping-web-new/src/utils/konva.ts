import Konva from "konva";
import { first, isEmpty, isNil, round } from "lodash";
import { generateUUID } from "@packages/utils";
import {
  AREA_GROUP_NAME,
  AREA_NAME_PREFIX,
  LOCATION_NAME_PREFIX,
  ROUTE_NAME_PREFIX,
  SHELF_GROUP_NAME,
  SHELF_NAME_PREFIX,
  TUNNEL_GROUP_NAME,
  TUNNEL_NAME_PREFIX,
  getAreaLabel,
  getLocationLabel,
  getRouteLabel,
  getShelfLabel,
  getTunnelLabel,
} from "../constants";
import { ETabKey } from "@/typings";
import { message } from "antd";
import { getInitialValuesFromShape } from "@/pages/CanvasEditor/store";

export function genAttrsWhenTransform(e: Konva.KonvaEventObject<Event>) {
  const node = e.target;
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();
  const x = round(node.x(), 2);
  const y = round(node.y(), 2);
  const width = round(node.width() * scaleX, 2);
  const height = round(node.height() * scaleY, 2);
  return {
    x,
    y,
    width,
    height,
  };
}

export function mapKonvaAttrs(
  data: API.OutputAreaInfoDTO[],
  getLabel: (d: API.OutputAreaInfoDTO) => string,
  offsetX: number,
  offsetY: number,
  radio: number,
  prefix: string
): Editor.Area[];
export function mapKonvaAttrs(
  data: API.OutputTunnelInfoDTO[],
  getLabel: (d: API.OutputTunnelInfoDTO) => string,
  offsetX: number,
  offsetY: number,
  radio: number,
  prefix: string
): Editor.Tunnel[];
export function mapKonvaAttrs(
  data: API.OutputShelfInfoDTO[],
  getLabel: (d: API.OutputShelfInfoDTO) => string,
  offsetX: number,
  offsetY: number,
  radio: number,
  prefix: string
): Editor.Shelf[];
export function mapKonvaAttrs(
  data: API.OutputLocationInfoDTO[],
  getLabel: (d: API.OutputLocationInfoDTO) => string,
  offsetX: number,
  offsetY: number,
  radio: number,
  prefix: string
): Editor.Location[];
export function mapKonvaAttrs(
  data: any[],
  getLabel: (d: any) => string,
  offsetX: number,
  offsetY: number,
  radio: number,
  prefix: string
): any[] {
  return data.map((d) => {
    const label = getLabel(d);
    return {
      ...d,
      label,
      konvaAttrs: {
        id: d.id!,
        name: prefix + generateUUID(),
        x: round((d.x! - offsetX) * radio, 4),
        y: round((d.y! * -1 - offsetY) * radio, 4),
        width: round(d.width! * radio, 4),
        height: round(d.height! * radio, 4),
      },
    };
  });
}

export const isGroupInfo = (e: Konva.KonvaEventObject<Event>) => {
  return (
    e.target.parent instanceof Konva.Group &&
    Boolean(e.target?.parent?.name()) &&
    !Boolean(e.target.name())
  );
};

export const getGroupName = (e: Konva.KonvaEventObject<Event>) => {
  return e?.target?.parent?.name?.() ?? "";
};

export const getShapeName = (e: Konva.KonvaEventObject<Event>) => {
  return isGroupInfo(e) ? getGroupName(e) : e.target?.name?.() ?? "";
};

export const getShapeTarget = (e: Konva.KonvaEventObject<Event>) => {
  return isGroupInfo(e) ? e.target.parent : e.target;
};

export const toShapeCenter = (
  stage: Konva.Stage,
  {
    x,
    y,
    width,
    height,
  }: Required<Pick<Konva.RectConfig, "x" | "y" | "width" | "height">>
) => {
  const { x: scaleX, y: scaleY } = stage.scale?.() ?? { x: 1, y: 1 };
  const x1 = round(x * scaleX + (width * scaleX - stage.width()!) / 2, 4);
  const y1 = round(y * scaleY + (height * scaleY - stage.height()!) / 2, 4);
  stage.to({
    x: -x1,
    y: -y1,
    duration: 0.5,
  });
};



export const getChildrenByGroupName = (
  stage: Konva.Stage,
  groupName: string
) => {
  const group = stage.findOne("." + groupName) as Konva.Group;
  return group?.children ?? [];
};

export const calcShortestCoords = (
  attrs1: Editor.IKonvaAttrs,
  attrs2: Editor.IKonvaAttrs
) => {
  const { x: x1, y: y1, width: width1, height: height1 } = attrs1;
  const { x: x2, y: y2, width: width2, height: height2 } = attrs2;

  const midpointsA = [
    { x: x1 + width1 / 2, y: y1 },
    { x: x1 + width1 / 2, y: y1 + height1 },
    { x: x1, y: y1 + height1 / 2 },
    { x: x1 + width1, y: y1 + height1 / 2 },
  ];

  const midpointsB = [
    { x: x2 + width2 / 2, y: y2 },
    { x: x2 + width2 / 2, y: y2 + height2 },
    { x: x2, y: y2 + height2 / 2 },
    { x: x2 + width2, y: y2 + height2 / 2 },
  ];

  let minDistance = Infinity;
  let startPoint: number[] = [];
  let endPoint: number[] = [];

  for (const pointA of midpointsA) {
    for (const pointB of midpointsB) {
      const distance = Math.sqrt(
        Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        startPoint = [pointA.x, pointA.y];
        endPoint = [pointB.x, pointB.y];
      }
    }
  }
  return offsetLine(startPoint, endPoint);
};

const OFFSET = 60;
export const offsetLine = (point1: number[], point2: number[]) => {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  const lineAngle = Math.atan2(Math.abs(y1 - y2), Math.abs(x1 - x2));
  const offsetX = OFFSET * Math.cos(lineAngle);
  const offsetY = OFFSET * Math.sin(lineAngle);
  let offsetX1 = 0,
    offsetX2 = 0,
    offsetY1 = 0,
    offsetY2 = 0;
  if (x1 < x2) {
    offsetX1 = x1 + offsetX;
    offsetX2 = x2 - offsetX;
  } else {
    offsetX1 = x1 - offsetX;
    offsetX2 = x2 + offsetX;
  }

  if (y1 < y2) {
    offsetY1 = y1 + offsetY;
    offsetY2 = y2 - offsetY;
  } else {
    offsetY1 = y1 - offsetY;
    offsetY2 = y2 + offsetY;
  }

  return [offsetX1, offsetY1, offsetX2, offsetY2];
};

export const getAttrsBetweenPoints = (points: number[]) => {
  const [x1, y1, x2, y2] = points;
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = round(Math.abs(x1 - x2), 4);
  const height = round(Math.abs(y1 - y2), 4);
  return {
    x,
    y,
    width,
    height,
  };
};

// 查找shape所在范围包含的点位
export const getIntersectionByGroups = (
  stage: Konva.Stage,
  shape: Konva.Shape,
  groups: string[],
  extraFn: (s: Konva.Shape) => boolean
) => {
  const box = shape?.getClientRect();
  if (!box) return [];
  const allPoints = [];
  for (const g of groups) {
    const children = getChildrenByGroupName(stage, g);
    allPoints.push(...children);
  }
  const includingPoints = allPoints.filter(
    (shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect()) &&
      extraFn(shape as Konva.Shape)
  );
  return includingPoints;
};

export function calculateBoundingBox(coordinates: Array<[number, number]>) {
  if (coordinates.length === 0) {
    return null; // 没有坐标，返回 null
  }

  let minX = coordinates[0][0];
  let minY = coordinates[0][1];
  let maxX = coordinates[0][0];
  let maxY = coordinates[0][1];

  for (const coord of coordinates) {
    const [x, y] = coord;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const boundingBox = {
    x: minX,
    y: minY,
    width: round(maxX - minX, 4),
    height: round(maxY - minY, 4),
  };

  return boundingBox;
}

export function overlapShelf<T>(
  e: Konva.KonvaEventObject<T>,
  attrs: { x: number; y: number; width: number; height: number }
): boolean {
  const stage = e.target.getStage();
  if (!stage) return false;
  const children = getChildrenByGroupName(stage, SHELF_GROUP_NAME);
  if (children.length === 0) return false;
  return children.some((child) =>
    Konva.Util.haveIntersection(attrs, child.attrs)
  );
}

export function overlapRect<T>(
  e: Konva.KonvaEventObject<T>,
  attrs: { x: number; y: number; width: number; height: number },
  groupName: string
): boolean {
  const stage = e.target.getStage();
  if (!stage) return false;
  const children = getChildrenByGroupName(stage, groupName);
  if (children.length === 0) return false;
  return children.some((child) =>
    Konva.Util.haveIntersection(attrs, child.attrs)
  );
}

export function getPosition(node: Konva.Shape) {
  const stage = node.getStage();
  if (!stage) return { x: 0, y: 0 };
  const pointer = stage.getPointerPosition();
  const scaleX = stage.scaleX();
  const pos = {
    x: round((pointer?.x! - stage.x()) / scaleX, 4),
    y: round((pointer?.y! - stage.y()) / scaleX, 4),
  };
  return pos;
}

export function getCompareRects(stage: Konva.Stage) {
  if (!stage) return [];
  const areasGroup = getChildrenByGroupName(stage, AREA_GROUP_NAME);
  const tunnelsGroup = getChildrenByGroupName(stage, TUNNEL_GROUP_NAME);
  const shelvesGroup = getChildrenByGroupName(stage, SHELF_GROUP_NAME);
  const nodes = [
    ...areasGroup,
    ...tunnelsGroup,
    ...shelvesGroup,
  ] as Konva.Shape[];
  return nodes;
}

export function mapAreas(areas: API.AreaInfoDTO[], layouts: ILayouts) {
  const { radio, offsetX, offsetY } = layouts;
  return areas.map<Editor.Area>((area) => ({
    ...area,
    label: getAreaLabel(area),
    tab: ETabKey.Area,
    konvaAttrs: {
      id: area.id,
      name: AREA_NAME_PREFIX + generateUUID(),
      x: round((area.x! - offsetX) * radio, 4),
      y: round((area.y! * -1 - offsetY) * radio, 4),
      width: round(area.width! * radio, 4),
      height: round(area.height! * radio, 4),
    },
  }));
}

export function mapTunnels(tunnels: API.TunnelInfoDTO[], layouts: ILayouts) {
  const { radio, offsetX, offsetY } = layouts;
  return tunnels.map<Editor.Tunnel>((tunnel) => ({
    ...tunnel,
    label: getTunnelLabel(tunnel),
    tab: ETabKey.Tunnel,
    konvaAttrs: {
      id: tunnel.id,
      name: TUNNEL_NAME_PREFIX + generateUUID(),
      x: round((tunnel.x! - offsetX) * radio, 4),
      y: round((tunnel.y! * -1 - offsetY) * radio, 4),
      width: round(tunnel.width! * radio, 4),
      height: round(tunnel.height! * radio, 4),
    },
  }));
}

export function mapShelfs(shelfs: API.ShelfInfoDTO[], layouts: ILayouts) {
  const { radio, offsetX, offsetY } = layouts;
  return shelfs.map<Editor.Shelf>((shelf) => ({
    ...shelf,
    label: getShelfLabel(shelf),
    tab: ETabKey.Shelf,
    konvaAttrs: {
      id: shelf.id,
      name: SHELF_NAME_PREFIX + generateUUID(),
      x: round((shelf.x! - offsetX) * radio, 4),
      y: round((shelf.y! * -1 - offsetY) * radio, 4),
      width: round(shelf.width! * radio, 4),
      height: round(shelf.height! * radio, 4),
    },
  }));
}

export function mapLocations(locations: API.LocationInfoDTO[], layouts: ILayouts) {
  const { radio, offsetX, offsetY } = layouts;
  return locations.map<Editor.Location>((location) => ({
    ...location,
    label: getLocationLabel(location),
    tab: ETabKey.Location,
    konvaAttrs: {
      id: location.id,
      name: LOCATION_NAME_PREFIX + generateUUID(),
      x: round((location.x! - offsetX) * radio, 4),
      y: round((location.y! * -1 - offsetY) * radio, 4),
      width: round(location.width! * radio, 4),
      height: round(location.height! * radio, 4),
    },
  }));
}

export function mapRoutingList(
  list: API.RoutingInfoDTO[],
  areas: Editor.Area[]
): Editor.IRouting[] {
  const map = areas.reduce<Record<string, Editor.Area>>((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {})
  return list.reduce<Editor.IRouting[]>((acc, cur) => {
    const { fromArea: fromAreaId, toArea: toAreaId } = cur;
    const fromArea = map[fromAreaId];
    const toArea = map[toAreaId];
    if (fromArea && toArea) {
      const points = calcShortestCoords(fromArea.konvaAttrs, toArea.konvaAttrs);
      const item: Editor.IRouting = {
        ...cur,
        tab: ETabKey.Route,
        konvaAttrs: {
          points,
          name: ROUTE_NAME_PREFIX + generateUUID(),
          id: cur.id!,
        },
        label: getRouteLabel(cur),
      };
      acc.push(item);
    }
    return acc;
  }, []);
}