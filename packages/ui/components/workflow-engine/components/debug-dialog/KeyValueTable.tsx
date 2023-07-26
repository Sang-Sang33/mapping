import React, { forwardRef, memo, useImperativeHandle, useState } from 'react'
import { FormJson, ETypes, useJsonStates } from 'antd-form-json'
import type { IFormItem } from 'antd-form-json'
import { generateUUID } from '@packages/utils'
import { Button } from 'antd'
import { i18n } from '@packages/i18n'

interface IProps {
  defaultValue?: any
}

interface IKeyValueTableRef {
  getJson: () => Record<string, any>
}

const getDefaultFormStates = (defaultValue: Record<string, any>) => {
  const formStates: IFormItem[] = []
  const _recursion = (data: Record<string, any>, parent: IFormItem[] = []) => {
    for (let k in data) {
      const formItem = {
        name: k,
        value: data[k] ?? '',
        id: generateUUID() + '',
        children: [],
        type: ETypes.Object
      }
      const valueType = typeof data[k]
      if (valueType === 'object') {
        formItem.type = ETypes.Object
        _recursion(data[k], formItem.children)
      } else {
        formItem.type = valueType as ETypes
      }
      parent.push(formItem)
    }
  }
  _recursion(defaultValue, formStates)

  return formStates
}

const t = (key: string) => i18n.t(key, { ns: 'workflowEngine' })
const getNewFormState = () => ({
  name: '',
  value: '',
  id: generateUUID() + '',
  children: [],
  type: ETypes.String
})

const KeyValueTable = forwardRef<IKeyValueTableRef, IProps>((props, ref) => {
  const { defaultValue } = props
  const [formStates, setFormStates] = useState<IFormItem[]>(
    Object.keys(defaultValue).length ? getDefaultFormStates(defaultValue) : [getNewFormState()]
  )
  const jsonState = useJsonStates(formStates)
  useImperativeHandle(
    ref,
    () => ({
      getJson: () => jsonState
    }),
    [jsonState]
  )

  return (
    <div>
      <FormJson formStates={formStates} setFormStates={setFormStates} />
      {!formStates.length && (
        <Button className="w-full" type="dashed" onClick={() => setFormStates([getNewFormState()])}>
          {t('debugDialog.add')}
        </Button>
      )}
    </div>
  )
})

export default memo(KeyValueTable)
