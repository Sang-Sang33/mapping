import React from "react";
import ConfigStore from "./config.Store";
import BasicStore from "./basic.Store";
import WarehouseMap from "./warehouseMap.Store";
import PermissionStore from "./permission.Store";

class RootStore {
	public configStore: ConfigStore;
	public basicStore: BasicStore;
	public warehouseMap: WarehouseMap;
	public permissionStore: PermissionStore;

	constructor() {
		this.configStore = new ConfigStore();
		this.basicStore = new BasicStore();
		this.warehouseMap = new WarehouseMap();
		this.permissionStore = new PermissionStore();
	}
}

// 实例化根store
const context = React.createContext(new RootStore());
export const useStore = () => React.useContext(context);
