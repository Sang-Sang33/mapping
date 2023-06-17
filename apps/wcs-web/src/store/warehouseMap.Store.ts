import { makeAutoObservable } from "mobx";

// 仓库配置
class WarehouseMapStore {
	constructor() {
		makeAutoObservable(this);
	}
	mapWidth = 1000;
	floorPadding = 100;
	floorDepth = 1;
	areaYaxis = this.floorDepth + 1;
	shelfYaxis = this.floorDepth + 1;
	shelfConfig = {
		binLength: 50, // 库位长度
		binWidth: 50, // 库位宽度
		binHeight: 55, // 库位高
		holderHeight: 2, // 托盘高度
		bottomHeight: 20, // 货架底层高度
		rackLength: 3, // 支架的长度
		rackWidth: 3, // 支架的宽度
		intervalRackNum: 4, //间隔多少库位有一个主支架
		shelfMatColor: 0x175ec0
	};
	locationConfig = {
		length: 43, // 货位长度
		width: 46, // 货位宽度
		height: 50, // 货位高度
		color: {
			occupied: "#00D1D1",
			empty: "#aaa4a4",
			emptiedTheirAbnormal: "#faad14",
			placeholderAbnormal: "#faad14",
			maintain: "#6088bb",
			alarm: "red"
		}
	};
	initConfigByLayout(baseWidth: number) {
		this.shelfConfig = {
			...this.shelfConfig,
			binLength: Math.floor(baseWidth * 0.86),
			binWidth: Math.floor(baseWidth * 0.86),
			binHeight: baseWidth
		};
		this.locationConfig = {
			...this.locationConfig,
			length: Math.floor(baseWidth * 0.8),
			width: Math.floor(baseWidth * 0.8),
			height: Math.floor(baseWidth * 0.8)
		};
	}
}

export default WarehouseMapStore;
