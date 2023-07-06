import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/styles/index.css";
import "@/styles/global.less";
import "antd/dist/antd.variable.min.css";
// 引入国际化
import "@/i18n/index";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
