export interface IListResult<T> {
  totalCount: number
  items: T[]
}

export interface IListParams {
  PageNumber: number
  PageSize: number
  Sorting?: { key: string; order: string }[]
}
