import { Switch } from 'antd'
import {
  setDefaultDataFilter,
  setSearchTableDefaultValue,
  setGlobalDialogField,
  registerField,
  MwFormField,
  setDefaultSearchFilter,
  AnyKeyProps,
  LoadParams
} from 'multiway'
import type { ReactNode } from 'react'

/**
 * 表格请求后过滤
 * @param data object 接口请求完成的数据
 */

setDefaultDataFilter((res: any) => {
  return {
    content: res.items,
    totalCount: res.totalCount
  }
})

setGlobalDialogField(() => {
  return {
    maskClosable: false,
    destroyOnClose: true
  }
})

setSearchTableDefaultValue({
  extraRefreshVisible: false,
  extraSizeVisible: false,
  extraSettingVisible: false,
  extraFullscreenVisible: false
})

interface ICustomChildren {
  checkedChildren?: ReactNode
  unCheckedChildren?: ReactNode
}
/**
 * 注册带有文件或图标的switch表单类型
 */
registerField('switch-custom-children', {
  type: 'switch',
  defaultValue: false,
  valuePropName: 'checked',
  render: ({ field }: MwFormField & ICustomChildren) => {
    return <Switch checkedChildren={field.checkedChildren} unCheckedChildren={field.unCheckedChildren}></Switch>
  }
})

setDefaultSearchFilter((params: AnyKeyProps) => {
  // return 的数据会作为实际表格所请求的数据，此处为一个示例
  return {
    Search: params.search,
    PageNumber: params.pagination.current,
    PageSize: params.pagination.pageSize,
    Sorting: params.sorts,
    Filter: params.filters
  }
})

export interface IMwTableRef<T = any> {
  getTableData: () => T[]
  setTableData: (data: T[]) => void
  getApiParams: () => AnyKeyProps
  setPaginitionValue(paginition: LoadParams['pagination']): void
}
