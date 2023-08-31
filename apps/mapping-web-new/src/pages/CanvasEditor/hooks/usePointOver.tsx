

import Konva from "konva";
import { getPosition } from "./usePaintingRect";
import { useThrottleFn } from 'ahooks';
import { useState } from "react";

export default function usePointOver(whenClick: (e: Konva.KonvaEventObject<MouseEvent>) => void) {
    const [isOvering, setIsOvering] = useState(false);
    const [pointPosition, setPointPosition] = useState({x: 0, y: 0});

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const pos = getPosition(e.target as Konva.Shape);
        setPointPosition(pos);
        setIsOvering(true);
    }

    const onClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.evt.button === 2) {
            // 右键单击
            // 在这里处理右键单击事件
            return;
        }
        setIsOvering(false);
        setPointPosition({x: 0, y: 0})
        whenClick?.(e)
    }

    const onMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
        setIsOvering(false);
        setPointPosition({x: 0, y: 0})
    }

    return {
        isOvering,
        pointPosition,
        pointEvents: {
            onMouseMove,
            onMouseLeave,
            onClick
        }
    }
}