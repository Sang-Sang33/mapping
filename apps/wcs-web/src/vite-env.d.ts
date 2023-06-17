/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_FLAG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
type RefType = MutableRefObject<unknown> | ((instance: unknown) => void)

type CommonObjectType<T = any> = Record<string, T>

declare interface Window {
  __AUTH_API__: string
  __MAPPING_API__: string
  __WCS_API__: string
  __WORKFLOW_ENGINE_URL__: stirng
}

declare module 'react/jsx-runtime' {
  export default any
}
