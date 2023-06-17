import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import ja_JP from 'antd/lib/locale/ja_JP'
import ko_KR from 'antd/lib/locale/ko_KR'
import { getCultureIC } from './cookie'

export type TCulture = 'zh' | 'en' | 'ja' | 'ko'

// Cookie culture --> locale(antd\multiway...)
const cultureToLibLocaleMap = {
  antd: {
    // antd组件的映射
    zh: zhCN,
    en: enUS,
    ja: ja_JP,
    ko: ko_KR
  },
  // TODO 升级成dayjs
  moment: {
    // moment 组件的映射
    zh: 'zh-cn',
    en: 'en',
    ja: 'ja',
    ko: 'ko'
  },
  multiway: {
    // multiway 组件的映射
    zh: 'zh_CN',
    en: 'en_US',
    ja: 'ja_JP',
    ko: 'ko_KR'
  }
}
type TCultureToLibLocaleMap = typeof cultureToLibLocaleMap
type TLib = keyof TCultureToLibLocaleMap

// web browser language --> Cookie culture
const navigatorLanguageToLocaleMap: Record<string, TCulture> = {
  'zh-CN': 'zh',
  zh: 'zh',
  en: 'en',
  ja: 'ja',
  ko: 'ko'
}

/**
 * @description: 获取指定文化对应库的语言环境
 * @param {string} lib 第三方库的名称
 * @return {string} locale
 */
export const getLibLocale = (culture: TCulture) => (lib: TLib) => cultureToLibLocaleMap[lib][culture]

/**
 * @description: 获取浏览器对应的文化
 * @return {*}
 */
export const getBrowserCulture = () => navigatorLanguageToLocaleMap[navigator.language || 'en']

/**
 * @description: 获取cookie或浏览器环境中的文化, 对应库的语言环境
 * @param {string} lib 第三方库的名称
 * @return {string} locale
 */
export const getLocalLibLocale = (lib: TLib) => {
  const cultureIC = getCultureIC()
  const culture = cultureIC ?? getBrowserCulture()
  return getLibLocale(culture)(lib)
}
