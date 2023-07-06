import Cookies from "js-cookie";

import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";
import ja_JP from "antd/lib/locale/ja_JP";
import ko_KR from "antd/lib/locale/ko_KR";

const TOKEN_KEY = "AuthenticationToken";
const DOMAIN = import.meta.env.VITE_DOMAIN || ".multiway-cloud.com";

const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// 浏览器语言字段映射到网页
const lanDict: any = {
  web: {
    // 自身网页的映射
    "zh-CN": "zh",
    en: "en",
    ja: "ja",
    ko: "ko",
  },
  antd: {
    // antd组件的映射
    zh: zhCN,
    en: enUS,
    ja: ja_JP,
    ko: ko_KR,
  },
  moment: {
    // moment 组件的映射
    zh: "zh-cn",
    en: "en",
    ja: "ja",
  },
  multiway: {
    // multiway 组件的映射
    "zh-CN": "zh_CN",
    en: "en_US",
    ja: "ja_JP",
    ko: "ko_KR",
  },
};

/**
 * [获取当前语言]
 * 所有语言的获取以这个为准
 * @response lanCookies => cookie中获取的 cookie中取到的字段不需要映射
 * browserLan ===> 浏览器当前语言 浏览器要走web的映射转换成cookie一样的字段
 * @err
 */
const getLanguage = () => {
  const urlParams = new URLSearchParams(window.location.href);
  const urlLang = urlParams.get("lang");
  console.log("urlLang", urlLang);
  const lanCookiesString = Cookies.get(".AspNetCore.Culture");
  const lanCookiesAry: any = lanCookiesString?.split("uic=");
  const lanCookies =
    lanCookiesAry && lanCookiesAry.length > 0 ? lanCookiesAry[1] : undefined;
  const browserLan = navigator.language;
  return urlLang || lanCookies || lanDict.web[browserLan];
};

const setLanguage = (key: string) => {
  Cookies.set(".AspNetCore.Culture", `c=${key}|uic=${key}`, {
    expires: 365,
    domain: DOMAIN,
  });
  localStorage.setItem("MULTIWAY_LOCALE", lanDict?.multiway[key] ?? "zh_CN");
};

export { getToken, setToken, clearToken, getLanguage, setLanguage };
