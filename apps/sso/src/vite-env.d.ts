/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_FLAG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
type RefType = MutableRefObject<unknown> | ((instance: unknown) => void);

type CommonObjectType<T = any> = Record<string, T>;

declare interface Window {
  AUTH_API: string;
  BASIC_API: string;
  EXCEPT_PARAMS: stirng;
}
declare module "react/jsx-runtime" {
  export default any;
}

declare module "qs" {
  export default any;
}
