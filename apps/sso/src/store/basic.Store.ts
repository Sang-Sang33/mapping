import { makeAutoObservable } from "mobx";
import { setToken, getToken, clearToken } from "@/utils/token";

// 全局配置
class BasicStore {
	constructor() {
		makeAutoObservable(this);
	}
	token = getToken() || "";

	// 登录
	login = (val: string) => {
		this.token = val;
		setToken(this.token);
	};

	// 退出登录
	logout = () => {
		clearToken();
	};
}

export default BasicStore;
