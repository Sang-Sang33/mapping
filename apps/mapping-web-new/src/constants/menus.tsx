enum ETabKey {
	Area = "area",
	Tunnel = "tunnel",
	Location = "location",
	Shelf = "shelf",
	Route = "route",
	LocationGroup = "locationGroup",
}

export const Tabs = [
	{ label: "区域", icon: "icon-area", key: ETabKey.Area },
	{ label: "巷道", icon: "icon-road", key: ETabKey.Tunnel },
	{ label: "货架", icon: "icon-shelf", key: ETabKey.Shelf },
	{ label: "货位", icon: "icon-storage", key: ETabKey.Location },
	{ label: "路径", icon: "icon-route", key: ETabKey.Route },
	{ label: "货位分组", icon: "icon-locationGroup", key: ETabKey.LocationGroup },
];

export type ITab = typeof Tabs[number];

export const RectStylesMap = {
	[ETabKey.Location]: {
		rectFill: "#fff",
		rectStroke: "#030712"
	},
	[ETabKey.Area]: {
		rectFill: "#f7faff",
		rectStroke: "#007aff"
	},
	[ETabKey.Shelf]: {
		rectFill: "#f7faff",
		rectStroke: "#a855f7"
	},
	[ETabKey.Tunnel]: {
		rectFill: "#d6d3d1",
		rectStroke: "#78716c"
	}
};

export enum Direction {
	LeftTop = "leftTop",
	LeftBottom = "leftBottom",
	RightTop = "rightTop",
	RightBottom = "rightBottom"
}

export const DIRECTION_OPTIONS = [
	{ value: Direction.LeftTop, label: "左上" },
	{ value: Direction.LeftBottom, label: "左下" },
	{ value: Direction.RightTop, label: "右上" },
	{ value: Direction.RightBottom, label: "右下" }
];
