export interface IRcsItem {
  id: string
  predecessorIds: any[]
  priority: number
  vehicles: any[]
  status: string
  extraProperties: any
  creationTime: string
  lastModificationTime?: any
}

export interface IForkArm {
  liftHeight: number
  declineHeight: number
}

export interface IRcsSubItem {
  id: string
  predecessorIds: string[]
  priority: number
  to: string
  action: string
  status: string
  vehicle: string
  forkArm: IForkArm
  extraProperties: Record<string, any>
}

export type TCreateRcsItem = Omit<IRcsItem, 'id' | 'status' | 'creationTime' | 'lastModificationTime'>
export type TUpdateRcsItem = TCreateRcsItem
export type TCreateRcsSubItem = Omit<IRcsSubItem, 'id' | 'status' | 'action'>
export type TUpdateRcsSubItem = TCreateRcsSubItem
