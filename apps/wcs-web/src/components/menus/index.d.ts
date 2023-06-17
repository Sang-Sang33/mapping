export interface Item {
  key: string
  path?: string
  icon?: any
  label: string
  permission?: string
  children?: Item[]
  url?: string
}

export interface MenuItem extends Item {
  children?: Array<Item>
}
