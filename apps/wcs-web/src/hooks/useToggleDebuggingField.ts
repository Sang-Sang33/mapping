import { MwSearchTableField, MwTableField } from 'multiway'

const useToggleDebuggingField = (
  fields: MwSearchTableField[],
  isDebugging: boolean,
  fieldRender: MwTableField['render']
) => {
  const debuggingFieldIndex = fields.findIndex((field) => field.key === 'handler')
  const debuggingField: MwSearchTableField = {
    title: '操作',
    width: 250,
    key: 'handler',
    render: fieldRender
  }
  if (debuggingFieldIndex === -1) {
    // 不存在
    if (isDebugging) {
      fields.push(debuggingField)
    }
  } else {
    // 存在
    if (isDebugging) {
      // degbu模式
      fields.splice(debuggingFieldIndex, 1, debuggingField)
    } else {
      // 非debug
      fields.splice(debuggingFieldIndex, 1)
    }
  }
}

export default useToggleDebuggingField
