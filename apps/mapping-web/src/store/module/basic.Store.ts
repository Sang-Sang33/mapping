import { makeAutoObservable } from 'mobx'
import { getTokenIC, removeTokenIC } from '@packages/utils'
// import { setToken, getToken, clearToken } from "@/utils/token";

// 全局配置
class BasicStore {
  constructor() {
    makeAutoObservable(this)
  }
  token = getTokenIC() || ''
  userInfo = {
    username: '',
    tenant: ''
  }

  // 退出登录
  logout = () => {
    removeTokenIC()
  }

  setUserInfo(val) {
    this.userInfo = val
  }
}

export default new BasicStore()
