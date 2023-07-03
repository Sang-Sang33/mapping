import type { ReactNode } from 'react'
import { Switch } from 'antd'
import { registerField, MwFormField } from 'multiway'

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
