import { FC, useEffect } from "react";
import RouterConfig from "@/router/index";
import { useStore } from "@/store/index";
import { observer } from "mobx-react-lite";
import { setLanguage } from "multiway";

// 国际化配置
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import moment from "moment";
import "moment/dist/locale/zh-cn";
// import enUS from "antd/lib/locale/en_US";

const App: FC = () => {
	const { configStore } = useStore();
	ConfigProvider.config({
		// ui主题配置
		theme: configStore.theme
	});

	setLanguage("zh_CN");
	moment.locale("zh-cn");

	return (
		<ConfigProvider locale={zhCN}>
			<RouterConfig />
		</ConfigProvider>
	);
};

export default observer(App);
