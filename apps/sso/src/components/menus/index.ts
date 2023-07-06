import { MenuItem } from "./index.d";
// 菜单管理
export const menus: Array<MenuItem> = [
	// {
	// 	key: "home",
	// 	label: "aside.equipmentMonitoring.nav",
	// 	icon: "wms-shebeijiankong",
	// 	path: "/" // 我的状态
	// },
	{
		key: "wmsMission",
		label: "aside.wmsMission.nav",
		icon: "icon-component",
		path: "/wmsMission",
		permission: ""
	},
	{
		key: "rcsMission",
		label: "aside.rcsMission.nav",
		icon: "icon-component",
		path: "rcsMission",
		permission: ""
	},



	{
		key: "logs",
		label: "aside.logs.nav",
		icon: "icon-component",
		path: "logs",
		permission: ""
	},
	
	// {
	// 	key: "permission",
	// 	label: "aside.permission.nav",
	// 	icon: "icon-quanxianziyuan",
	// 	children: [
	// 		{
	// 			key: "permission/user",
	// 			label: "aside.permission.user.nav",
	// 			icon: "icon-yonghu",
	// 			path: "/permission/user",
	// 			permission: ""
	// 		},
	// 		{
	// 			key: "permission/role",
	// 			label: "aside.permission.role.nav",
	// 			icon: "icon-jiaoseguanli",
	// 			path: "/permission/role",
	// 			permission: ""
	// 		}
	// 	]
	// }

];
