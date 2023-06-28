import type { FC, ReactNode } from 'react'
import { createInstance } from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import resources from './resources'
import { getBrowserCulture, getCultureIC, setCultureIc } from '@packages/utils'

const cultureIc = getCultureIC()
const culture = cultureIc ?? getBrowserCulture()
// 当前cookie中没有culture, 使用浏览器当前culture, 并设置到cookie中
!cultureIc && setCultureIc(culture)

const i18n = createInstance({
  resources,
  lng: culture, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
  // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
  // if you're using a language detector, do not define the lng option

  interpolation: {
    escapeValue: false // react already safes from xss
  },
  fallbackLng: 'en'
})

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init()

const I18nextPackagesProvider: FC<{ children: ReactNode }> = (props) => (
  <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>
)

export default I18nextPackagesProvider
