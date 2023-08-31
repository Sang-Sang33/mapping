import Konva from "konva";
import { useState } from "react";
import { BORDER_NAME } from "@/constants";
import { getShapeName } from "@/utils";

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

export function genAttrs(x1: number, x2: number, y1: number, y2: number) {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}

export function getPosition(node: Konva.Shape) {
  const stage = node.getStage();
  if (!stage) return { x: 0, y: 0 };
  const pointer = stage.getPointerPosition();
  const scaleX = stage.scaleX();
  const pos = {
    x: parseFloat(((pointer?.x! - stage.x()) / scaleX).toFixed(2)),
    y: parseFloat(((pointer?.y! - stage.y()) / scaleX).toFixed(2)),
  };
  return pos;
}

interface IConfig {
  afterMouseUp: (
    e: Konva.KonvaEventObject<MouseEvent>,
    rectProps: ReturnType<typeof genAttrs>
  ) => void;
  overlapFn?: (
    e: Konva.KonvaEventObject<MouseEvent>,
    rectProps: ReturnType<typeof genAttrs>
  ) => boolean;
}

// 用于绘制矩形的hook
export default function usePaintingRect() {
  const [rectParams, setRectParams] = useState(defaultRectParams);
  const [isPainting, setIsPainting] = useState(false);
  //	通过闭包保存rectParams、isPainting变量
  function onMouseEvent({ afterMouseUp, overlapFn }: IConfig) {
    return {
      onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => {
        setRectParams(defaultRectParams);
        const name = getShapeName(e);
        if (name.includes("_anchor") || name !== BORDER_NAME) {
          setIsPainting(false);
          return;
        }
        setIsPainting(true);
        const { x, y } = getPosition(e.target as Konva.Shape);
        (x1 = x), (y1 = y), (x2 = x), (y2 = y);
      },
      onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isPainting) return;
        const { x, y } = getPosition(e.target as Konva.Shape);
        const attrs = genAttrs(x1, x, y1, y);
        const isOverlap = overlapFn?.(e, attrs) ?? false;
        if (isOverlap) return;
        (x2 = x), (y2 = y);
        setRectParams({ ...attrs, visible: true });
      },
      onMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isPainting) return;
        const attrs = genAttrs(x1, x2, y1, y2);
        if (Math.abs(attrs.width) > 30 && Math.abs(attrs.height) > 30) {
          afterMouseUp?.(e, attrs);
        }
        setIsPainting(false);
        setRectParams(defaultRectParams);
        (x1 = 0), (x2 = 0), (y1 = 0), (y2 = 0);
      },
    };
  }

  return {
    isPainting,
    rectParams,
    onMouseEvent,
  };
}
