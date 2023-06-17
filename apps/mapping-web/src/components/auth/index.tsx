import { Navigate, useLocation, matchRoutes } from "react-router-dom";
import { getToken } from "@/utils/token";
import routes from "@/router/routes";
interface IAuthProps {
	children?: React.ReactNode;
}

// 路由鉴权
function Auth({ children }: IAuthProps) {
	const { pathname } = useLocation();
	if (pathname === "/login") return children;
	const matchroute = matchRoutes(routes, pathname);
	// * 如果访问的地址没有在路由表中重定向到403页面
	if (!matchroute) return <Navigate to="/403" />;
	const token = getToken();
	if (token) {
		return <>{children}</>;
	} else {
		return <Navigate to="/login" replace />;
	}
}

export default Auth;
