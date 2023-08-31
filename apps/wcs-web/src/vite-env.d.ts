/// <reference types="vite/client" />

type RefType = MutableRefObject<unknown> | ((instance: unknown) => void)

type CommonObjectType<T = any> = Record<string, T>

declare module 'react/jsx-runtime' {
  export default any
}
