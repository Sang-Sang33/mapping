import { FC } from "react";
import RouterConfig from "@/router/index";
import { observer } from "mobx-react-lite";
// 国际化配置
import { ConfigProvider } from "antd";
import "moment/locale/zh-cn";

const App: FC = () => {
  return (
    <ConfigProvider>
      <RouterConfig />
    </ConfigProvider>
  );
};

export default observer(App);
