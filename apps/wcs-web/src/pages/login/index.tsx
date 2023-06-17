import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Spin, message, Switch } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/index";
import { observer } from "mobx-react-lite";
import { getToken, clearToken } from "@/utils/token";
import logoOrigin from "@/assets/imgs/logo.png";
import loginBg from "@/assets/imgs/login.png";
import bg from "@/assets/imgs/bg1.png";

interface IFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const style: any = {
  container: {
    background: "#4f69a5",
    // background: "linear-gradient(to right, #cbb4d8 0%, #97db97 0%, #F8F8F8 0%, #00D1D1 33%, #00D1A1 66%, #d8778f 100%)"
  },
  li: {
    listStyleType: "none",
    display: "block",
    position: "absolute",
    bottom: "-120px",
    width: "15px",
    height: "15px",
    zIndex: "-8",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
};
const liStyle = {
  F: {
    ...style.li,
    animationDuration: "10s",
  },
  S: {
    ...style.li,
    animationDuration: "15s",
  },
  T: {
    ...style.li,
    animationDuration: "18s",
  },
  Fo: {
    ...style.li,
    animationDuration: "12s",
    animationDelay: "3s",
  },
  Fi: {
    ...style.li,
    animationDuration: "16s",
    animationDelay: "5s",
  },
  Si: {
    ...style.li,
    animationDuration: "8s",
  },
  Se: {
    ...style.li,
    animationDuration: "15s",
    animationDelay: "3s",
    left: "70%",
  },
  E: {
    ...style.li,
    animationDelay: "4s",
  },
  N: {
    ...style.li,
    animationDuration: "28s",
    left: "82%",
  },
  Te: {
    ...style.li,
    animationDuration: "20s",
    animationDelay: "6s",
    left: "90%",
  },
};

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { basicStore, configStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(true);

  useEffect(() => {}, []);

  const onFinish = () => {
    console.log("onFinish", onFinish);
  };

  return (
    <div className="w-full h-full" style={style.container}>
      <div className=" flex space-between  w-full h-full">
        <img src={bg} className=" absolute left-0 top-0 w-40 h-full " alt="" />
        <div
          className=" w-2/3 2xl:w-3/4 p-16 text-center"
          style={{ backgroundColor: "#EBF2F9" }}
        >
          <img src={loginBg} className="inline relative" alt="" />
        </div>

        {/* Login Form */}
        <div className="w-2/3 sm:w-2/5 xl:w-1/3 2xl:w-1/4 pt-5 px-5 flex items-center justify-around content-center">
          <Spin spinning={loading}>
            <div className="cursor-pointer relative z-50 max-w-xs mb-8 mx-auto text-center">
              <img
                className="px-3 inline-block w-32 sm:px-10"
                src={logoOrigin}
                alt=""
              />
              <h3 style={{ fontSize: "24px", color: "white" }}>
                {t("system")}
              </h3>
            </div>

            <Form
              name="normal_login"
              className="max-w-xs !m-auto z-20 relative"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: t("login.username_check"),
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder={t("login.username")}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("login.password_check"),
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder={t("login.password")}
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <div className="flex items-center">
                    <Checkbox className="w-3/5 !text-white select-none">
                      {t("login.remember")}
                    </Checkbox>
                  </div>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  {t("login.login")}
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>

      {/* background */}
      <ul className="overflow-hidden absolute top-0 right-0 w-2/6 h-full z-10">
        <li style={liStyle.F} className="animate-square left-0"></li>
        <li
          style={liStyle.S}
          className="!w-10 !h-10 animate-square left-16"
        ></li>
        <li
          style={liStyle.T}
          className="!w-6 !h-6 animate-square left-1/4"
        ></li>
        <li
          style={liStyle.Fo}
          className="!w-12 !h-12 animate-square left-1/3"
        ></li>
        <li
          style={liStyle.Fi}
          className="!w-16 !h-16 animate-square left-1/2"
        ></li>
        <li style={liStyle.S} className="animate-square left-2/3"></li>
        <li style={liStyle.Se} className="!w-24 !h-24 animate-square"></li>
        <li
          style={liStyle.N}
          className="!w-28 !h-28 animate-square left-3/4"
        ></li>
        <li style={liStyle.E} className="!w-16 !h-16 animate-square"></li>
        <li style={liStyle.Te} className="!w-20 !h-20 animate-square"></li>
      </ul>
    </div>
  );
}
export default observer(Login);
