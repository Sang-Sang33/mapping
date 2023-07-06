import { makeAutoObservable, toJS } from "mobx";
import { setPermissionList } from "multiway";
// 全局配置
class PermissionStore {
	constructor() {
		makeAutoObservable(this);
	}
	permission = [];
	setPermission = (ary: any) => {
		this.permission = ary;
		setPermissionList(this.permission);
	};
	getPermission = () => {
		return toJS(this.permission);
	};
	isExitPermission = (key: string) => {
		// console.log("toJS(this.permission)", toJS(this.permission));
		return toJS(this.permission).includes(key);
	};

	// 这个看看是啥意思
	firstActiveMenuLink = "/layout/operations/maintenancePlanList";
	setFirstActiveMenuLink = (permission: Array<string>, items: any) => {
		console.log("setFirstActiveMenuLink", permission, items);
		let _items: any = [],
			key = "";
		for (let i = 0; i < items.length; i++) {
			_items.push({ ...items[i] });
		}
		let menu = this.getPermissionMenu(permission, _items);
		menu = menu.filter((it: any) => it.children === undefined || it.children.length);
		if (menu.length) {
			key = this.firstActiveMenuLink = menu[0].children ? menu[0].children[0].path : menu[0].path;
		}
		return key;
	};
	// 递归去除没有权限的菜单
	getPermissionMenu = (permission: Array<string>, items: any) => {
		let newitems = items.filter((it: any) => {
			const hasPermission = it.permission ? permission.includes(it.permission) : true;
			it.children && it.children.length && (it.children = this.getPermissionMenu(permission, it.children));
			return hasPermission;
		});
		return newitems;
	};
	checkPathnameInMenu = (menu: any, pathname: string) => {
		let isExit = false;
		menu.forEach((item: any) => {
			if (item.path === pathname) {
				isExit = true;
				return isExit;
			}
			if (item.children && item.children.length) {
				this.checkPathnameInMenu(item.children, pathname);
			}
			// item.children && item.children.length && this.checkPathnameInMenu(item.children, pathname);
		});
		return isExit;
	};
}

export default PermissionStore;
