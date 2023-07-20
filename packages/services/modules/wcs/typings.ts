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
