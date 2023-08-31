import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh_CN from "./locales/zh.json";
import en_US from "./locales/en.json";
import ja_jp from "./locales/ja.json";
import ko_kr from "./locales/kr.json";
import { getLanguage } from "@/utils";

const resources: any = {
    en: {
      translation: en_US,
    },
    zh: {
      translation: zh_CN,
    },
    ja: {
      translation: ja_jp,
    },
    ko: {
      translation: ko_kr,
    },
  };
  
  const lang = localStorage.getItem("locale") || "zh";
  i18n.use(initReactI18next).init({
    resources,
    lng: getLanguage() ? (resources[getLanguage()] ? getLanguage() : "zh") : "zh", // 缓存没有时默认中文
    interpolation: {
      escapeValue: false,
    },
  });
  export default i18n;