import React from "react";
import EditorStore from '@/pages/CanvasEditor/store'

class RootStore {
	public editorStore: EditorStore
	constructor() {
		this.editorStore = new EditorStore();
	}
}

// 实例化根store
export const context = React.createContext(new RootStore());
export const useStore = () => React.useContext(context);
