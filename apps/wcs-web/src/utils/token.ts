import Cookies from 'js-cookie'

import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import ja_JP from 'antd/lib/locale/ja_JP'
import ko_KR from 'antd/lib/locale/ko_KR'

const NEW_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'access_token'
const TOKEN_KEY = 'AuthenticationToken'
const DOMAIN = import.meta.env.VITE_DOMAIN

const getToken = () => localStorage.getItem(TOKEN_KEY) || ''
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const getNewToken = () => {
  return Cookies.get(NEW_TOKEN_KEY)
}

const clearNewToken = () => {
  Cookies.remove(NEW_TOKEN_KEY)
}

// 浏览器语言字段映射到网页
const lanDict: any = {
  web: {
    // 自身网页的映射
    'zh-CN': 'zh',
    en: 'en',
    ja: 'ja',
    ko: 'ko'
  },
  antd: {
    // antd组件的映射
    zh: zhCN,
    en: enUS,
    ja: ja_JP,
    ko: ko_KR
  },
  moment: {
    // moment 组件的映射
    zh: 'zh-cn',
    en: 'en',
    ja: 'ja'
  },
  multiway: {
    // multiway 组件的映射
    'zh-CN': 'zh_CN',
    en: 'en_US',
    ja: 'ja_JP',
    ko: 'ko_KR'
  }
}

/**
 * [获取当前语言]
 * 所有语言的获取以这个为准
 * @response lanCookies => cookie中获取的 cookie中取到的字段不需要映射
 * browserLan ===> 浏览器当前语言 浏览器要走web的映射转换成cookie一样的字段
 * @err
 */
const getLanguage = () => {
  const lanCookiesString = Cookies.get('.AspNetCore.Culture')
  const lanCookiesAry: any = lanCookiesString?.split('uic=')
  const lanCookies = lanCookiesAry && lanCookiesAry.length > 0 ? lanCookiesAry[1] : undefined
  const browserLan = navigator.language
  return lanCookies || lanDict.web[browserLan]
}

const setLanguage = (key: string) => {
  Cookies.set('.AspNetCore.Culture', `c=${key}|uic=${key}`, {
    expires: 365,
    domain: DOMAIN
  })
  localStorage.setItem('MULTIWAY_LOCALE', lanDict?.multiway[key] ?? 'zh_CN')
}

/**
 * [重定向到sso页面]
 * 本地localhost的链接和线上的是不一样的，看下怎么区分开来配置
 * @params
 * @err
 */

const redirectToSso = () => {
  clearNewToken()
  clearTenant()
  clearWarehouseInCookie()
  const { origin, href } = window.location
  const env = import.meta.env.VITE_APP_FLAG
  let url: any = {}
  const SSO_URL = window.__AUTH_API__ || import.meta.env.VITE_SSO_URL + '/login'

  url.local =
    SSO_URL +
    // "http://localhost:44307/#/login" +
    `?crosUrl=${encodeURIComponent(origin + '/#/gateway')}&&returnUrl=${encodeURIComponent(href)}&&tokenKey=${
      import.meta.env.VITE_TOKEN_KEY
    }&&lang=${getLanguage()}&&mode=dev&&tenant=${getTenant()}`

  url.dev =
    SSO_URL +
    `?returnUrl=${encodeURIComponent(href)}&&lang=${getLanguage()}&&tokenKey=${import.meta.env.VITE_TOKEN_KEY}`

  window.location.href = url[env] || url.dev
}

const ipReg = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,}$/
const isIp = ipReg.test(window.location.host) || window.location.host.includes('localhost')

const setTenant = (value: string) => {
  Cookies.set('tenantId', value)
}
const getTenant = () => {
  return Cookies.get('tenantId')
}

const clearTenant = () => {
  Cookies.remove('tenantId')
}

const setWarehouseToCookie = (warehouseId: string) => {
  Cookies.set('warehouseId', warehouseId)
}

const getWarehouseInCookie = () => {
  return Cookies.get('warehouseId')
}

const clearWarehouseInCookie = () => {
  Cookies.remove('warehouseId')
}

export {
  getToken,
  setToken,
  clearToken,
  getNewToken,
  redirectToSso,
  setLanguage,
  getLanguage,
  lanDict,
  isIp,
  setTenant,
  getTenant,
  setWarehouseToCookie,
  getWarehouseInCookie
}
