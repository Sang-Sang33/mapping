import type { WorkflowStatus } from '@packages/enum'

export interface IListResult<T> {
  totalCount: number
  items: T[]
}

export interface IListParams {
  PageNumber: number
  PageSize: number
  Sorting?: { key: string; order: string }[]
}

/**
 * 调试事件
 */

export interface IDebugWorkflow {
  id: string
  extraProperties: Record<string, string>
}

/**
 * 实例类型
 */
export interface IWorkflowInstanceItem {
  id: 'string'
  definitionId: 'string'
  definitionVersionId: 'string'
  tenantId: 'string'
  version: number
  workflowStatus: number
  correlationId: 'string'
  contextType: 'string'
  contextId: 'string'
  name: 'string'
  createdAt: string
  lastExecutedAt: string
  finishedAt: string
  cancelledAt: string
  faultedAt: string
  metadata: Record<string, any>
}

export interface IWorkflowInstanceListParams {
  page: number
  pageSize: number
  workflowStatus: WorkflowStatus | null
  searchTerm: string | null
  orderBy: string | null
  // searchTerm: string
}

export interface IWorkflowDefinition {
  id?: string
  definitionId?: string
  tenantId?: string
  name?: string
  displayName?: string
  description?: string
  version: number
  variables?: string
  customAttributes?: Record<string, any>
  contextOptions?: IWorkflowContextOptions
  isSingleton?: boolean
  persistenceBehavior?: EWorkflowPersistenceBehavior
  deleteCompletedInstances?: boolean
  isPublished: boolean
  isLatest: boolean
  activities: Array<IActivityDefinition>
  connections: Array<IConnectionDefinition>
  tag?: string
  channel?: string
}

export interface IWorkflowContextOptions {
  contextType: string
  contextFidelity: WorkflowContextFidelity
}

export enum WorkflowContextFidelity {
  Burst = 'Burst',
  Activity = 'Activity'
}

export enum EWorkflowPersistenceBehavior {
  Suspended = 'Suspended',
  WorkflowBurst = ' WorkflowBurst',
  WorkflowPassCompleted = 'WorkflowPassCompleted',
  ActivityExecuted = 'ActivityExecuted'
}

export interface IActivityDefinition {
  activityId: string
  type: string
  name: string
  displayName: string
  description: string
  top?: number
  left?: number
  x?: number
  y?: number
  persistWorkflow: boolean
  loadWorkflowContext: boolean
  saveWorkflowContext: boolean
  properties: Array<IActivityDefinitionProperty>
  propertyStorageProviders: Record<string, any>
}

export interface IActivityDefinitionProperty {
  name: string
  syntax?: string
  expressions: Record<string, any>
  value?: any
}

export interface IConnectionDefinition {
  sourceActivityId?: string
  targetActivityId?: string
  outcome?: string
}
