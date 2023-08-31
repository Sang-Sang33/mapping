import Konva from "konva";
import React from "react";

const GUIDELINE_OFFSET = 5;

type Snap = "start" | "center" | "end";
type SnappingEdges = {
	vertical: Array<{
		guide: number;
		offset: number;
		snap: Snap;
	}>;
	horizontal: Array<{
		guide: number;
		offset: number;
		snap: Snap;
	}>;
};

interface IConfig {
	getCompareNodes: () => Konva.Circle[]
}

// 拖拽时的辅助线
export default function usePointGuildLine({ getCompareNodes }: IConfig) {
	const getLineGuideStops = (skipShape: Konva.Shape) => {
		const stage = skipShape.getStage();
		if (!stage) return { vertical: [], horizontal: [] };

		// we can snap to stage borders and the center of the stage
		const vertical = [0, stage.width() / 2, stage.width()];
		const horizontal = [0, stage.height() / 2, stage.height()];
		// and we snap over edges and center of each object on the canvas
		getCompareNodes().forEach(guideItem => {
			if (guideItem === skipShape) {
				return;
			}
			const x = guideItem.x();
			const y = guideItem.y();
			// and we can snap to all edges of shapes
			vertical.push(x);
			horizontal.push(y);
		});
		return {
			vertical,
			horizontal
		};
	};

	const getObjectSnappingEdges = React.useCallback((node: Konva.Shape): SnappingEdges => {
		const x = node.x();
		const y = node.y();
		const absPos = node.position();

		return {
			vertical: [
				{
					guide: Math.round(x),
					offset: Math.round(absPos.x - x),
					snap: "start"
				},
			],
			horizontal: [
				{
					guide: Math.round(y),
					offset: Math.round(absPos.y - y),
					snap: "start"
				},
			]
		};
	}, []);

	const getGuides = React.useCallback(
		(lineGuideStops: ReturnType<typeof getLineGuideStops>, itemBounds: ReturnType<typeof getObjectSnappingEdges>) => {
			const resultV: Array<{
				lineGuide: number;
				diff: number;
				snap: Snap;
				offset: number;
			}> = [];

			const resultH: Array<{
				lineGuide: number;
				diff: number;
				snap: Snap;
				offset: number;
			}> = [];
			lineGuideStops.vertical.forEach(lineGuide => {
				itemBounds.vertical.forEach(itemBound => {
					const diff = Math.abs(lineGuide - itemBound.guide);
					if (diff < GUIDELINE_OFFSET) {
						resultV.push({
							lineGuide: lineGuide,
							diff: diff,
							snap: itemBound.snap,
							offset: itemBound.offset
						});
					}
				});
			});

			lineGuideStops.horizontal.forEach(lineGuide => {
				itemBounds.horizontal.forEach(itemBound => {
					const diff = Math.abs(lineGuide - itemBound.guide);
					if (diff < GUIDELINE_OFFSET) {
						resultH.push({
							
							lineGuide: lineGuide,
							diff: diff,
							snap: itemBound.snap,
							offset: itemBound.offset
						});
					}
				});
			});

			const guides: Array<{
				lineGuide: number;
				offset: number;
				orientation: "V" | "H";
				snap: "start" | "center" | "end";
			}> = [];

			const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
			const minH = resultH.sort((a, b) => a.diff - b.diff)[0];

			if (minV) {
				guides.push({
					lineGuide: minV.lineGuide,
					offset: minV.offset,
					orientation: "V",
					snap: minV.snap
				});
			}

			if (minH) {
				guides.push({
					lineGuide: minH.lineGuide,
					offset: minH.offset,
					orientation: "H",
					snap: minH.snap
				});
			}

			return guides;
		},
		[]
	);

	const drawGuides = React.useCallback((guides: ReturnType<typeof getGuides>, layer: Konva.Layer) => {
		guides.forEach(lg => {
			if (lg.orientation === "H") {
				const line = new Konva.Line({
					points: [-6000, 0, 6000, 0],
					stroke: "rgb(0, 161, 255)",
					strokeWidth: 1,
					name: "guid-line",
					dash: [4, 6]
				});
				layer.add(line);
				line.position({
					x: 0,
					y: lg.lineGuide
				});
			} else if (lg.orientation === "V") {
				const line = new Konva.Line({
					points: [0, -6000, 0, 6000],
					stroke: "rgb(0, 161, 255)",
					strokeWidth: 1,
					name: "guid-line",
					dash: [4, 6]
				});
				layer.add(line);
				line.position({
					x: lg.lineGuide,
					y: 0
				});
			}
		});
	}, []);

	const onPointDragMove = React.useCallback(
		(e: Konva.KonvaEventObject<DragEvent>) => {
			const layer = e.target.getLayer();

			// clear all previous lines on the screen
			layer.find(".guid-line").forEach((l: Konva.Shape) => l.destroy());

			// find possible snapping lines
			const lineGuideStops = getLineGuideStops(e.target as Konva.Shape);
			// find snapping points of current object
			const itemBounds = getObjectSnappingEdges(e.target as Konva.Shape);

			// now find where can we snap current object
			const guides = getGuides(lineGuideStops, itemBounds);

			// do nothing if no snapping
			if (!guides.length) {
				return;
			}

			drawGuides(guides, layer);

			const absPos = e.target.position();
			// now force object position
			guides.forEach(lg => {
				switch (lg.snap) {
					case "start": {
						switch (lg.orientation) {
							case "V": {
								absPos.x = lg.lineGuide + lg.offset;
								break;
							}
							case "H": {
								absPos.y = lg.lineGuide + lg.offset;
								break;
							}
						}
						break;
					}
				}
			});
			e.target.position(absPos);
		},
		[drawGuides, getGuides, getObjectSnappingEdges]
	);

	const onPointDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
		const layer = e.target.getLayer();
		// clear all previous lines on the screen
		layer.find(".guid-line").forEach((l: Konva.Shape) => l.destroy());
	};

    return {
        onPointDragMove,
        onPointDragEnd
    }
}
