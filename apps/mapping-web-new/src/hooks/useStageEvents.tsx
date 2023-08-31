import { useStore } from "@/store";
import { generateUUID } from "@packages/utils";
import { useKeyPress } from "ahooks";
import Konva from "konva";
import { first, isEmpty } from "lodash";
import { useRef, useState } from "react";
import {
	AREA_GROUP_NAME,
	AREA_NAME_PREFIX,
	LOCATION_NAME_PREFIX,
	LOCATION_POINTS_GROUP,
	PAINTED_RECTS_GROUP,
	PAINTING_RECT_GROUP,
	POINT_NAME_PREFIX,
	RECT_NAME_PREFIX,
	SHELF_GROUP_NAME,
	SHELF_NAME_PREFIX,
	STAGE_NAME,
} from "../constants";
import {
	getChildrenByGroupName,
	getIntersectionByGroups,
	getShapeName,
	getShapeTarget,
	overlapShelf,
} from "../utils";
import { EOperationMode } from "./useActiveMode";
import usePaintingRect, { getPosition } from "./usePaintingRect";
import usePointOver from "./usePointOver";

export const POINT_WIDTH = 50;
export const POINT_HEIGHT = 50;

export default function useStageEvents() {
  const { editorStore } = useStore();
  const {
    isShelfTab,
    isLocationTab,
    isLocationGroupTab,
    activeMode,
    shouldPainting,
    isDrawerOpen,
    currentTab,
    isRoutingTab,
  } = editorStore;
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const [hoverRectName, sethoverRectName] = useState("");
  const [paintedAreas, setPaintedAreas] = useState<Konva.RectConfig[]>([]);
  const [paintedPoints, setPaintedPoints] = useState<
    { x: number; y: number; name: string }[]
  >([]);
  const [tooltipProps, setTooltipProps] = useState<{
    x: number;
    y: number;
    text: string;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    text: "",
    visible: false,
  });
  const { isPainting, rectParams, onMouseEvent } = usePaintingRect();
  const { isOvering, pointEvents, pointPosition } = usePointOver((e) => {
    const pos = getPosition(e.target as Konva.Shape);
    const name = POINT_NAME_PREFIX + generateUUID();
    setPaintedPoints([...paintedPoints, { ...pos, name }]);
    setTimeout(() => {
      const stage = stageRef.current;
      const point = stage?.findOne("." + name) as Konva.Circle;
      if (isLocationTab) {
        const box = point?.getClientRect()!;
        if (!box) return;
        const areas = getChildrenByGroupName(
          stageRef?.current!,
          AREA_GROUP_NAME
        );
        const shelves = getChildrenByGroupName(
          stageRef?.current!,
          SHELF_GROUP_NAME
        );
        const includingAreas = areas?.filter(
          (shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect()) &&
            shape.name().startsWith(AREA_NAME_PREFIX)
        ) as Konva.Group[];
        const includingShelves = shelves?.filter(
          (shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect()) &&
            shape.name().startsWith(SHELF_NAME_PREFIX)
        ) as Konva.Group[];
        if (!isEmpty(includingAreas) && !isEmpty(includingShelves)) {
          const area = first(includingAreas);
          const shelf = first(includingShelves);
          const areaId = area?.id?.() ?? "";
          const shelfId = shelf?.id() ?? "";
          editorStore.onAddLocation(point, { areaId, shelfId });
        }
      }
    }, 0);
  });

  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage()!;
    const oldScale = stage.scaleX()!;
    const pointer = stage.getPointerPosition()!;
    const mousePointTo = {
      x: (pointer.x - stage.x()!) / oldScale,
      y: (pointer.y - stage.y()!) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage?.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage?.position(newPos);
    stage?.batchDraw();
  };

  const hideTooltip = () => {
    setTooltipProps({
      x: 0,
      y: 0,
      visible: false,
      text: "",
    });
  };

  const displayTooltip = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const name = getShapeName(e);
    if (name.startsWith(LOCATION_NAME_PREFIX)) {
      const attrs = e.target.attrs;
      const pos = getPosition(e.target as Konva.Shape);
      setTooltipProps({
        x: pos.x,
        y: pos.y - 15,
        visible: true,
        text: attrs.customCode,
      });
    } else {
      hideTooltip();
    }
  };

  const onClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 2) {
      return;
    }
    editorStore.hideMenu();
    if (!isDrawerOpen) {
      editorStore.resetActiveShape();
    }
    displayTooltip(e);
    const node = getShapeTarget(e);
    const name = node?.name?.() ?? "";
    if (name === STAGE_NAME) {
      editorStore.closeDrawer();
    }
    switch (activeMode) {
      case EOperationMode.Selection:
        editorStore.onShapeSelected(node as Konva.Shape);
        console.log("trRef.current: ", trRef.current);
        setTimeout(() => {
          console.log(trRef.current?.nodes());
        }, 0);
        break;
      default:
        break;
    }
  };

  const onMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (shouldPainting) {
      sethoverRectName(e.target.name());
    }
  };

  const overlapFn = isShelfTab ? overlapShelf : () => false;

  const eventsMap = {
    [EOperationMode.Point]: pointEvents,
    [EOperationMode.Selection]: {
      ...onMouseEvent({
        afterMouseUp(e, rectProps) {
          hideTooltip();
          const stage = e.target.getStage();
          const paintedAreasGroup = stage?.findOne(
            "." + PAINTED_RECTS_GROUP
          ) as unknown as Konva.Group;
          const paintingGroup = getChildrenByGroupName(
            stageRef.current!,
            PAINTING_RECT_GROUP
          );
          if (isEmpty(paintingGroup)) return;
          const box = first(paintingGroup)?.getClientRect();
          if (!box) return;
          const nodes = paintedAreasGroup?.children?.filter((shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
          );
          trRef.current?.nodes(nodes!);
        },
      }),
      onMouseOver,
      onClick,
    },
    [EOperationMode.Rect]: {
      ...onMouseEvent({
        afterMouseUp(e, rectProps) {
          hideTooltip();
          const name = RECT_NAME_PREFIX + generateUUID();
          setPaintedAreas([...paintedAreas, { ...rectProps, name }]);
          setTimeout(() => {
            const stage = stageRef.current;
            const rect = stage?.findOne("." + name) as Konva.Rect;
            editorStore.setActiveShape(rect);
            // 货位页签时，框选区域后直接弹出右键菜单 =》 批量删除
            if (isLocationTab) {
              const { clientX, clientY } = e.evt;
              editorStore.setRightMenuStyles({ left: clientX, top: clientY });
            } else if (isLocationGroupTab) {
              const includingPoints = getIntersectionByGroups(
                stage!,
                rect,
                [LOCATION_POINTS_GROUP],
                (shape) => shape.name().startsWith(LOCATION_NAME_PREFIX)
              ) as Konva.Shape[];
              editorStore.appendLocations(includingPoints);
            } else if (isRoutingTab) {
            } else {
              trRef.current?.nodes([rect]);
              editorStore.onAddCommon(currentTab);
            }
          }, 100);
        },
        overlapFn,
      }),
      onMouseOver,
      onClick,
    },
  };

  const defaultEvents = {
    onClick,
    onMouseout: hideTooltip,
  };

  // useEffect(() => {
  // 	editorStore.setTrRef(trRef);
  // 	editorStore.setStageRef(stageRef);
  // }, []);

  useKeyPress("Delete", (e) => {
    const nodes = trRef.current?.getNodes();
    nodes?.forEach((node) => {
      node.destroy();
    });
    trRef.current?.nodes([]);
  });

  return {
    stageRef,
    trRef,
    paintedAreas,
    paintedPoints,
    hoverRectName,
    rectParams,
    isPainting,
    isOvering,
    pointPosition,
    tooltipProps,
    stageEvents: { ...(eventsMap?.[activeMode] ?? defaultEvents), onWheel },
    setPaintedAreas,
    setPaintedPoints,
  };
}
