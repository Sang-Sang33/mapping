import React from "react";
import EditorStore from "./module/editor.store";
import BasicStore from './module/basic.Store'

class RootStore {
	public EditorStore: any;
	public BasicStore: any
	constructor() {
		this.BasicStore = BasicStore
		this.EditorStore = EditorStore;
	}
}

// 实例化根store
export const context = React.createContext(new RootStore());
export const useStore = () => React.useContext(context);
