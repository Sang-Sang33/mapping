import { EWorkflowPersistenceBehavior, IActivityDefinition, IConnectionDefinition } from '../../typings'

/**
 * 事件列表子项
 */
export interface IEventItem {
  id: string
  name: string
}

/**
 * 添加设备功能
 */
export interface ICreateEventData {
  name: string
  activities: IActivityDefinition[]
  connections: IConnectionDefinition[]
  persistenceBehavior?: EWorkflowPersistenceBehavior
  publish: false
}
