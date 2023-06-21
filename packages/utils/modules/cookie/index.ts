import Cookies from 'js-cookie'
import { ECookie } from '@packages/enum'

export * from './external'

export type TAppCookieKey = keyof typeof ECookie
const AppCookie = {
  get: (key: TAppCookieKey) => Cookies.get(ECookie[key]),
  set: (key: TAppCookieKey, value: string, options?: Cookies.CookieAttributes) =>
    Cookies.set(ECookie[key], value, options),
  remove: (key: TAppCookieKey, options?: Cookies.CookieAttributes) => Cookies.remove(ECookie[key], options)
}

export default AppCookie
