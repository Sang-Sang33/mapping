import Konva from "konva";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { round } from "lodash";
import { generateUUID } from "@packages/utils";
import { useUpdateEffect } from "ahooks";
import { POINT_NAME_PREFIX } from "../constants";

export default function useLayouts() {
	const { editorStore } = useStore();
	const { stageSize, rcsPoints, warehouse, offset, CADToCanvasRadio } = editorStore;
	// RCS点位
	const [vertices, setVertices] = useState<Konva.CircleConfig[]>();
	// 边框
	const [border, setBorder] = useState<Konva.LineConfig>();
	const handler = editorStore.resetStageSize.bind(editorStore);

	useEffect(() => {
		handler();
		window.addEventListener("resize", handler);
		return () => {
			window.removeEventListener("resize", handler);
		};
	}, []);

	useUpdateEffect(() => {
		if (!warehouse) return;
		const { x, y: _y, width, height } = warehouse;
		if (x && _y && width && height) {
            const maxY = _y + height;
            const minY = Math.min(_y * -1, maxY * -1); // 浏览器坐标系对Y取负值转换为笛卡尔坐标
			const radio = round(Math.max(stageSize.width / width, stageSize.height / height) * 4, 4);
			console.log('radio: ', radio);	// 打印不能删除
			editorStore.setRadio(radio);
			editorStore.setStageOffset({ x, y: minY });
			const points = [0, 0, width * radio, 0, width * radio, height * radio, 0, height * radio, 0, 0];
			setBorder({
				points,
				stroke: '#666',
				strokeWidth: 12
			})
			
		}
	}, [stageSize, warehouse]);

    useEffect(() => {
        if(!rcsPoints) return;
        const { x, y } = offset;
        const radio = CADToCanvasRadio;
        const newVertices: Konva.CircleConfig[] = rcsPoints.map(p => ({
            x: round((p?.position?.x! - x) * radio, 2),
            y: round((-p?.position?.y! - y) * radio, 2),
            radius: 8,
            name: POINT_NAME_PREFIX + generateUUID(),
            fill: "#c5c5c5"
        }));
        setVertices(newVertices);
    }, [rcsPoints, offset, CADToCanvasRadio])

	return {
		vertices,
		border
	};
}
