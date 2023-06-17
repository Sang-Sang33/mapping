/**
 * 任务处理列表子项
 */
export interface IMissionItem {
  id: string
  name: string
}

/**
 * 添加任务功能
 */
export interface ICreateMissionData {
  name: string
  activities: []
  connections: []
  persistenceBehavior: string
  publish: false
}
