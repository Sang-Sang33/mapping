import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh_CN from './locales/zh_CN'
import en_US from './locales/en_US'
import ja from './locales/ja'
import ko from './locales/ko'
import { getLanguage } from '@/utils/token'

const resources: any = {
  en: {
    translation: en_US
  },
  zh: {
    translation: zh_CN
  },
  ja: {
    translation: ja
  },
  ko: {
    translation: ko
  }
}

const lang = localStorage.getItem('locale') || 'zh'
i18n.use(initReactI18next).init({
  resources,
  lng: getLanguage() ? (resources[getLanguage()] ? getLanguage() : 'zh') : 'zh', // 缓存没有时默认中文
  interpolation: {
    escapeValue: false
  }
})
export default i18n
