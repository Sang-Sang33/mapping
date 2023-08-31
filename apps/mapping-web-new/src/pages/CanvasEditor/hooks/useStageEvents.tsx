import { useStore } from "@/store";
import { generateUUID } from "@packages/utils";
import { useKeyPress } from "ahooks";
import Konva from "konva";
import { first, isEmpty } from "lodash";
import { useRef, useState, useEffect } from "react";
import {
  AREA_GROUP_NAME,
  AREA_NAME_PREFIX,
  BORDER_NAME,
  LOCATION_NAME_PREFIX,
  LOCATION_POINTS_GROUP,
  PAINTED_RECTS_GROUP,
  PAINTING_RECT_GROUP,
  POINT_NAME_PREFIX,
  RECT_NAME_PREFIX,
  SHELF_GROUP_NAME,
  SHELF_NAME_PREFIX,
  STAGE_NAME,
  TUNNEL_GROUP_NAME,
  TUNNEL_NAME_PREFIX,
} from "@/constants";
import {
  getChildrenByGroupName,
  getIntersectionByGroups,
  getShapeName,
  getPosition,
  getShapeTarget,
  overlapShelf,
  getAttrsBetweenPoints,
  overlapRect,
} from "@/utils";
import { EOperationMode, ETabKey } from "@/typings";
import usePointOver from "./usePointOver";

export const POINT_WIDTH = 50;
export const POINT_HEIGHT = 50;

let x1 = 0,
  x2 = 0,
  y1 = 0,
  y2 = 0;

const defaultRectParams = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  visible: false,
};

type FMouseEvent = (e: Konva.KonvaEventObject<MouseEvent>) => void;

interface IStageEvents {
  onMouseDown: FMouseEvent;
  onMouseMove: FMouseEvent;
  onMouseUp: FMouseEvent;
  onClick: FMouseEvent;
}

type IStageEventsMap = Record<EOperationMode, IStageEvents>;

function isInsideRect<T>(
  currentTab: ETabKey,
  e: Konva.KonvaEventObject<T>,
  attrs: { x: number; y: number; width: number; height: number }
) {
  let isTargetInside = false;
  switch (currentTab) {
    case ETabKey.Area:
      isTargetInside = overlapRect(e, attrs, AREA_GROUP_NAME);
      break;
    case ETabKey.Tunnel:
      // isTargetInside = overlapRect(e, attrs, TUNNEL_GROUP_NAME);
      break;
    case ETabKey.Shelf:
      isTargetInside = overlapRect(e, attrs, SHELF_GROUP_NAME);
      break;
    default:
      break;
  }
  return isTargetInside;
}

export default function useStageEvents() {
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const { editorStore } = useStore();
  const { activeMode, currentTab, isDrawingTunnel } = editorStore;

  const [rectParams, setRectParams] = useState(defaultRectParams);
  const [isPainting, setIsPainting] = useState(false);

  const stageEventsMap: IStageEventsMap = {
    [EOperationMode.Drag]: {
      onMouseDown(e) {},
      onMouseMove(e) {},
      onMouseUp(e) {},
      onClick(e) {
        if (e.evt.button === 2) {
          return;
        }
        editorStore.hideMenu();
      },
    },
    [EOperationMode.Selection]: {
      onMouseDown(e) {},
      onMouseMove(e) {},
      onMouseUp(e) {},
      onClick(e) {
        if (e.evt.button === 2) {
          return;
        }
        editorStore.hideMenu();
        const target = getShapeTarget(e);
        editorStore.onShapeSelected(target as Konva.Shape);
        console.log("target: ", target);
      },
    },
    [EOperationMode.Rect]: {
      onMouseDown(e) {
        setRectParams(defaultRectParams);
        const name = getShapeName(e);
        if (name.includes("_anchor")) {
          setIsPainting(false);
          return;
        }
        const { x, y } = getPosition(e.target as Konva.Shape);
        if (isInsideRect(currentTab, e, { x, y, width: 1, height: 1 })) {
          setIsPainting(false);
          return;
        }
        (x1 = x), (y1 = y), (x2 = x), (y2 = y);
        setIsPainting(true);
      },
      onMouseMove(e) {
        if (!isPainting) return;
        const { x, y } = getPosition(e.target as Konva.Shape);
        const attrs = getAttrsBetweenPoints([x, y, x1, y1]);
        if (isInsideRect(currentTab, e, attrs)) return;
        (x2 = x), (y2 = y);
        setRectParams({ ...attrs, visible: true });
      },
      onMouseUp(e) {
        if (!isPainting) return;
        const attrs = getAttrsBetweenPoints([x1, y1, x2, y2]);
        setIsPainting(false);
        setRectParams(defaultRectParams);
        (x1 = 0), (x2 = 0), (y1 = 0), (y2 = 0);
        if (Math.abs(attrs.width) < 30 || Math.abs(attrs.height) < 30) return;
        const stage = e.target.getStage();
        if (!stage) return;
        const name = RECT_NAME_PREFIX + generateUUID();
        editorStore.appendPaintedRect({ ...attrs, name });
        setTimeout(() => {
          const paintedRect = stage.findOne("." + name);
          if (!paintedRect) return;
          trRef.current?.nodes([paintedRect]);
          editorStore.setActiveShape(paintedRect as Konva.Shape);
        }, 0);
        switch (currentTab) {
          case ETabKey.Area:
            editorStore.onAddArea(ETabKey.Area);
            break;
          case ETabKey.Tunnel:
            if (isDrawingTunnel) {
              setTimeout(() => {
                editorStore.onAddTunnels();
              }, 10);
            } else {
              editorStore.onAddTunnelArea();
            }

            break;
          case ETabKey.Shelf:
            editorStore.onAddShelf(ETabKey.Shelf);
            break;
          default:
            break;
        }
      },
      onClick(e) {
        if (e.evt.button === 2) {
          return;
        }
        editorStore.hideMenu();
      },
    },
    [EOperationMode.Point]: {
      onMouseDown(e) {},
      onMouseMove(e) {},
      onMouseUp(e) {},
      onClick(e) {
        if (e.evt.button === 2) {
          return;
        }
        editorStore.hideMenu();
      },
    },
  };

  useEffect(() => {
    editorStore.setTrRef(trRef);
    editorStore.setStageRef(stageRef);
  }, []);

  useKeyPress("Delete", (e) => {
    const nodes = trRef.current?.getNodes();
    nodes?.forEach((node) => {
      node.destroy();
    });
    trRef.current?.nodes([]);
    editorStore.hideMenu();
  });

  return {
    stageRef,
    trRef,
    rectParams,
    isPainting,
    stageEvents: { ...stageEventsMap[activeMode] },
  };
}
