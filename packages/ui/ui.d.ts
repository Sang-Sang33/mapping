// images
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.gif' {
  const src: string
  export default src
}
declare module '*.svg' {
  const src: string
  export default src
}
declare module '*.ico' {
  const src: string
  export default src
}
declare module '*.webp' {
  const src: string
  export default src
}
declare module '*.avif' {
  const src: string
  export default src
}

// css
declare module '*.less' {
  const classes: CSSModuleClasses
  export default classes
}

// monaco-editor worker
declare module 'monaco-editor/esm/vs/editor/editor.worker?worker'
declare module 'monaco-editor/esm/vs/language/json/json.worker?worker'
declare module 'monaco-editor/esm/vs/language/css/css.worker?worker'
declare module 'monaco-editor/esm/vs/language/html/html.worker?worker'
declare module 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// window global varaibles
declare interface Window {
  __APP_LIST__: { label: string; link: string }[]
}
