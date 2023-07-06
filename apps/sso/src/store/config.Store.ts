import { makeAutoObservable } from "mobx";
import i18n from "i18next";

interface themeColor {
	primaryColor: any;
	errorColor: string;
	warningColor: string;
	successColor: string;
	infoColor: string;
}

interface itemConfig {
	[propName: string]: any;
}

// 全局配置
class ConfigStore {
	constructor() {
		makeAutoObservable(this);
	}
	collapsed = localStorage.getItem("collapsed");
	dictList = localStorage.getItem("dicts");
	parentItem: itemConfig = {}; // 默认激活的一级菜单
	activeItem: itemConfig = {}; // 默认激活的二级菜单
	locale = "zh_CN"; // 默认中文
	themeStyle: any = localStorage.getItem("themeStyle") ? localStorage.getItem("themeStyle") : "dark"; // 整体风格
	theme: themeColor = {
		primaryColor: localStorage.getItem("primaryColor") ? localStorage.getItem("primaryColor") : "#13C2C2",
		errorColor: "#ff4d4f",
		warningColor: "#faad14",
		successColor: "#52c41a",
		infoColor: "#1890ff"
	};
	multyTab = Boolean(localStorage.getItem("multyTab") === "true") || false;
	fullScreen = false;

	// 面包屑导航一级菜单
	operateCrumbMenu = (item: any) => {
		this.parentItem = item;
		let parentNode = {
			label: item.label,
			key: item.key
		};
		localStorage.setItem("parentItem", JSON.stringify(parentNode));
	};

	// 菜单切换
	switchMenuItem = (item: any) => {
		this.activeItem = item;
		localStorage.setItem("activeItem", JSON.stringify(item));
	};

	// 菜单的展开受控
	openKeys: any[] = [];
	setOpenKeys = (ary: any[]) => {
		this.openKeys = ary;
	};

	// 点击logo返回首页
	crumbItem = () => {
		this.activeItem = {};
		this.parentItem = {};
		localStorage.removeItem("activeItem");
		localStorage.removeItem("parentItem");
	};

	// 语言切换
	switchLanguage = (lang: string) => {
		this.locale = lang;
		localStorage.setItem("locale", lang);
		i18n.changeLanguage(lang === "zh_CN" ? "zh" : "en");
	};

	// 切换风格
	switchStyle = (style: string) => {
		this.themeStyle = style;
		localStorage.setItem("themeStyle", style);
	};

	// 切换主题色
	switchColor = (color: string) => {
		this.theme.primaryColor = color;
		localStorage.setItem("primaryColor", color);
	};
	switchTab = (bol: boolean) => {
		this.multyTab = bol;
		localStorage.setItem("multyTab", String(bol));
		// setTimeout(() => {
		// 	window.location.hash = "/";
		// });
	};
	setCollapsed = (collapsed: string) => {
		this.collapsed = collapsed;
		localStorage.setItem("collapsed", String(collapsed));
	};
	setFullScreen = (fullScreen: boolean) => {
		this.fullScreen = fullScreen;
	};
	setDicts = (dicts: string) => {
		this.dictList = dicts;
		localStorage.setItem("dicts", dicts);
	};
}

export default ConfigStore;
