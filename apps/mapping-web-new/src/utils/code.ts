import { Direction } from "../constants";

interface IPoint {
	x: number;
	y: number;
	id: string;
	puDoPoint: string;
}

interface IConfig {
	direction: Direction;
	isColumn: boolean;
	areaCode: string;
	tunnelCode: string;
	layer: number;
	height: number;
	rowCode: string;
}

export function genLocationLayoutList(
	points: IPoint[],
	{ direction, isColumn, areaCode, tunnelCode, layer, height, rowCode }: IConfig
) {
	let values: Array<Array<[number, number, string, string]>> = [],
		visited = new Map<number, Array<[number, number, string, string]>>();

	// 列方向为纵向，X值相同为一列
	if (isColumn) {
		for (let i = 0; i < points.length; i++) {
			const { x, y, id, puDoPoint } = points[i];
			if (!visited.has(x)) {
				visited.set(x, []);
			}
			visited.get(x)?.push([x, y, id, puDoPoint]);
		}
	} else {
		// 列方向为横向，Y值相同为一列
		for (let i = 0; i < points.length; i++) {
			const { x, y, id, puDoPoint } = points[i];
			if (!visited.has(y)) {
				visited.set(y, []);
			}
			visited.get(y)?.push([x, y, id, puDoPoint]);
		}
	}
	values = [...visited.values()];
	// **由于Y轴为反方向，实际排序为倒序，例如 y升序排列 =》 b[1] - a[1] / b[0][1] - a[0][1]**
	if (isColumn) {
		// 先对X排序，再对Y排序
		switch (direction) {
			// 左上为起始点时，x升序排列，y升序排列
			case Direction.LeftTop:
				values = values.sort((a, b) => a[0][0] - b[0][0]);
				values = values.map(val => val.sort((a, b) => b[1] - a[1]));
				break;
			// 左下为起始点时，x升序排列，y降序排列
			case Direction.LeftBottom:
				values = values.sort((a, b) => a[0][0] - b[0][0]);
				values = values.map(val => val.sort((a, b) => a[1] - b[1]));
				break;
			// 右上为起始点时，x降序排列，y升序排列
			case Direction.RightTop:
				values = values.sort((a, b) => b[0][0] - a[0][0]);
				values = values.map(val => val.sort((a, b) => b[1] - a[1]));
				break;
			// 右下为起始点时，x降序排列，y降序排列
			default:
				values = values.sort((a, b) => b[0][0] - a[0][0]);
				values = values.map(val => val.sort((a, b) => a[1] - a[0]));
				break;
		}
	} else {
		// 先对Y排序，再对X排序
		switch (direction) {
			// 左上为起始点时，x升序排列，y升序排列
			case Direction.LeftTop:
				values = values.sort((a, b) => b[0][1] - a[0][1]);
				values = values.map(val => val.sort((a, b) => a[0] - b[0]));
				break;
			// 左下为起始点时，x升序排列，y降序排列
			case Direction.LeftBottom:
				values = values.sort((a, b) => a[0][1] - b[0][1]);
				values = values.map(val => val.sort((a, b) => a[0] - b[0]));
				break;
			// 右上为起始点时，x降序排列，y升序排列
			case Direction.RightTop:
				values = values.sort((a, b) => b[0][1] - a[0][1]);
				values = values.map(val => val.sort((a, b) => b[0] - a[0]));
				break;
			// 右下为起始点时，x降序排列，y降序排列
			default:
				values = values.sort((a, b) => a[0][1] - b[0][1]);
				values = values.map(val => val.sort((a, b) => b[1] - a[1]));
				break;
		}
	}

	let result = [];
	// i为列，j为深
	// locationCode生成规则  `${areaCode}-${tunnelCode}-${排}-${列}-${层}-${深}`
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < values[i].length; j++) {
			const [x, y, id, puDoPoint] = values[i][j];
			const locationRow = rowCode.padStart(3, "0");
			const locationColumn = (i + 1).toString().padStart(3, "0");
			const locationDepth = (j + 1).toString().padStart(2, "0");
			for (let i = 1; i <= layer; i++) {
				const locationLayer = i.toString().padStart(3, "0");
				const item = {
					id,
					x,
					y,
					z: (i - 1) * height,
					locationCode: `${areaCode}-${tunnelCode}-${locationRow}-${locationColumn}-${locationLayer}-${locationDepth}`,
					puDoPoint,
					layer: i
				};
				result.push(item);
			}
		}
	}
	return result;
}

export function genSlots(locations: ReturnType<typeof genLocationLayoutList>, recordForkArms: IRecordForkArm[], vehicleTypes: string[]) {
	return locations.map<Slot>((location) => {
		const { locationCode, puDoPoint, layer } = location;
		const forkArm = recordForkArms[layer - 1];
		return {
			name: locationCode,
			puDoPoint,
			vehicleTypes,
			forkArm,
		}
	})
}