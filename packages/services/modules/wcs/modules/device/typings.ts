import { EWorkflowPersistenceBehavior, IActivityDefinition, IConnectionDefinition } from '../../typings'

/**
 * 设备列表子项类型
 */
export interface IDeviceItem {
  name: string
  functions: IFunction[]
}

/**
 * 设备功能
 */
export interface IFunction {
  id: string
  name: string
  isActive: boolean
}

/**
 * 添加设备功能
 */
export interface ICreateDeviceFunctionData {
  name: string
  activities: IActivityDefinition[]
  connections: IConnectionDefinition[]
  persistenceBehavior?: EWorkflowPersistenceBehavior
  publish: false
}

export type TDeviceStatusLevel = 'Normal' | 'Abnormal' | 'Fault' | 'Unknown'
export type TDeviceStatus = Record<string, { key: string; value: string; level?: TDeviceStatusLevel }[]>
