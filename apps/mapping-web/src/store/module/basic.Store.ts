import { makeAutoObservable } from "mobx";
import { setToken, getToken, clearToken } from "@/utils/token";

// 全局配置
class BasicStore {
	constructor() {
		makeAutoObservable(this);
	}
	token = getToken() || "";
	userInfo = {
		username: '',
		tenant: ''
	}

	// 退出登录
	logout = () => {
		clearToken();
	};

	setUserInfo(val) {
		this.userInfo = val
	}
}

export default new BasicStore();
