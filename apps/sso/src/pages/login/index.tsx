import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Spin,
  message,
  Modal,
  Select,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useStore } from "@/store/index";
import { observer } from "mobx-react-lite";
import { getToken, clearToken } from "@/utils/token";
import logoOrigin from "@/assets/imgs/logo.png";
import loginBg from "@/assets/imgs/login.png";
import bg from "@/assets/imgs/bg1.png";

import { style, liStyle } from "./login.style";
import {
  isIp,
  getTenant,
  setLoginCookie,
  loadIFrame,
  deleteLoginCookie,
} from "./login.func";

import { post, get } from "@/http/request/index";
import useOptions from "@/hooks/useOptions";

import md5 from "md5";
import qs from "qs";

interface IFormValues {
  username: string;
  password: string;
  remember: boolean;
  tenant: string;
}

interface IUrlParams {
  returnUrl: string;
  type?: "url" | "cookie";
  params?: any;
  tokenKey?: string;
}

const url = {
  login: "/connect/token",
  customer: "/api/mapping/customer",
};

/**
 * @description 单点登录页面 重点注意 租户 都要同步设置到cookie里面
 * @param { URLparams } 地址解析
 * @param { returnUrl: string } 登录成功回调的地址，需要urlencode
 * @param { type : url | cookie } 使用哪种方式回调cookie,默认使用cookie
 * @param { params: string } 回调的时候携带的参数，由各个系统自定义
 * @param { tokenKey } 写入的token的key
 * @param { crosUrl: string} 如果是跨域的话,把一个能写cookie的页面传给我 这个优先级应该是最大的，如果有这个值，
 * 							直接设置目标域的cookie，但是需要目标系统集成这个功能
 * @param { tenantKey } 写入租户的key
 * @param { lang } 单点登录系统所要展示的语言，传入lang参数，以lang为准，其次是读取cookies里面
 * 					的.AspNetCore.Culture，最后的默认浏览器的语言类型，最后默认是中文
 * @tips 目前只支持同一个域名下
 */
function Login() {
  const [paramsMap, setParamsMap] = useState<any>();
  const [isTalent, setIsTalent] = useState<boolean>(false);
  //   const [customerOpts, setCustomerOpts] = useState([]);

  const { options: customerOpts } = useOptions(() => get(url.customer), {
    transform: {
      value: "id",
      label: "displayName",
    },
  });

  const location = useLocation();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let oParamsMap: any = {};
    for (let [key, value] of searchParams) {
      oParamsMap[key] = value;
    }
    console.log(
      "[初始化获取到的参数信息]oParamsMap",
      oParamsMap,
      import.meta.env.VITE_APP_AUTH_API
    );
    setParamsMap(oParamsMap);
    const { returnUrl, tenantKey = "ssoTenant" } = oParamsMap;

    if (!returnUrl) {
      message.error("没有回调地址,无法正确登录,请检查地址是否正确", 100000000);
      return;
    }

    const tenant = getTenant(returnUrl);
    // 初始化的时候设置一次租户，不管是不是ip的
    // 如果是ip且有tenant字段则默认打开租户选项
    !isIp && setLoginCookie(tenantKey, tenant);
    //   : setLoginCookie(tenantKey, tenantValue);
    isIp && tenant && setIsTalent(true);
  }, []);

  useEffect(() => {
    if (!isIp) return;
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    const tenantKey = searchParams.get("tenantKey") || "tenant";
    const returnUrl = searchParams.get("returnUrl");
    const tenantValue = getTenant(returnUrl) || searchParams.get("tenant");
    if (isTalent && customerOpts.length) {
      form.setFieldsValue({
        tenant: tenantValue || customerOpts[0]?.value,
      });
      setLoginCookie(tenantKey, tenantValue || customerOpts[0]?.value);
    } else {
      // 关闭的时候要去除tenant
      setLoginCookie(tenantKey, "");
    }

    customerOpts.length && console.log(customerOpts);
  }, [isTalent, customerOpts]);

  const onFinish = async (values: IFormValues) => {
    const {
      tokenKey = "access_token",
      type,
      returnUrl,
      mode,
      crosUrl,
      tenantKey = "tenant",
    } = paramsMap;

    if (!returnUrl) {
      message.error("没有回调地址,无法正确登录,请检查地址是否正确");
      return;
    }

    const { password, username, tenant = "" } = values;

    const params = {
      username,
      password,
      grant_type: "password",
      client_id: "Logistics_App",
    };

    setLoading(true);

    try {
      const { token_type, access_token } = (await post(
        (window.AUTH_API || import.meta.env.VITE_APP_AUTH_API) + url.login,
        // url.login,
        qs.stringify(params)
      )) as any;

      message.success("登录成功，正在转跳");

      // 跨站点登录，现在暂时用不到。只能用于设置localhost的域。用于设置开发环境
      if (crosUrl) {
        let ourl = crosUrl + `?${tokenKey}=${token_type} ${access_token}`;
        tenant && (ourl += `&${tenantKey}=${tenant}`);
        loadIFrame(ourl, () => {
          locationTargetWebsite(mode, returnUrl);
        });
        return;
      }

      // 同一个二级域名下写cookie，组装回调的地址以及参数
      const domain = returnUrl.indexOf("localhost") ? "localhost" : undefined;
      console.log("[查看目标网站的域名]", domain);
      setLoginCookie(tokenKey, `${token_type} ${access_token}`);
      // 如果是ip则重新生成
      isIp && tenant && setLoginCookie(tenantKey, tenant);
      let ary = [],
        ourl = returnUrl;
      const hasKey = ["params"];
      for (let key in paramsMap) {
        hasKey.includes(key) && ary.push(key);
      }
      ary.length && (ourl += "?");
      ary.forEach((item: any, index: number) => {
        ourl +=
          item + "=" + paramsMap[item] + (index === ary.length - 1 ? "" : "&");
      });
      if (type && type === "url") {
        !ary.length && (ourl += "?");
        ourl +=
          (ary.length ? "&" : "") +
          tokenKey +
          "=" +
          `${token_type} ${access_token}`;
      }
      // 登录以后把tenant删除
      deleteLoginCookie(tenantKey);
      locationTargetWebsite(mode, ourl);
    } catch (error) {
      setLoading(false);
    }
  };

  const locationTargetWebsite = (mode: string | undefined, url: string) => {
    if (mode && mode === "dev") {
      Modal.confirm({
        title: "是否要转跳?",
        onOk() {
          window.location.href = url;
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      window.location.href = url;
    }
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
              form={form}
            >
              {isIp && (
                <Form.Item
                  label={<span style={{ color: "white" }}>租户</span>}
                  name="checked"
                  valuePropName={"isTalent"}
                  colon={false}
                >
                  <Switch
                    checked={isTalent}
                    onChange={(val) => setIsTalent(val)}
                  />
                </Form.Item>
              )}
              {isIp && isTalent && (
                <Form.Item
                  name="tenant"
                  rules={[{ required: true, message: "请选择租户" }]}
                >
                  <Select options={customerOpts}></Select>
                </Form.Item>
              )}

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
              {/* <Form.Item>
									<Form.Item name="remember" valuePropName="checked" noStyle>
										<div className="flex items-center">
											<Checkbox className="w-3/5 !text-white select-none">{t("login.remember")}</Checkbox>
										</div>
									</Form.Item>
								</Form.Item> */}

              <Form.Item>
                <Button
                  disabled={!paramsMap?.returnUrl}
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                >
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
