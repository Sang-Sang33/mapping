import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

// 登录/写cookie/转跳的逻辑在这里操作
// 判断有权限的路由第一个跳过去
function Gateway() {
  const location = useLocation();

  useEffect(() => {
    const key = import.meta.env.VITE_TOKEN_KEY,
      domain = import.meta.env.VITE_DOMAIN;
    const searchParams = new URLSearchParams(location.search);
    const token: any = searchParams.get(key);
    const tenant: any = searchParams.get("tenant") || "";
    // 同一个域名下的cookie先共享
    Cookies.set(key, token, { domain: domain, SameSite: "None", Secure: true });
    Cookies.set("tenant", tenant, {
      domain: domain,
      SameSite: "None",
      Secure: true,
    });
  }, []);

  return <>正在转跳中..</>;
}
export default Gateway;
