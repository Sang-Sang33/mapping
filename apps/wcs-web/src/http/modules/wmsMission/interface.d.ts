export interface IWmsItem {
  id: string
  predecessorIds: any[]
  priority: number
  from: string[]
  to: string[]
  autoRun: boolean
  autoAbort: boolean
  comments: string
  status: string
  extraProperties: any
  creationTime: string
  lastModificationTime?: any
}

export interface IWmsSubItem {
  id: string
  predecessorIds: string[]
  priority: number
  to: string[]
  action: string
  comments: string
  extraProperties: Record<string, any>
}
