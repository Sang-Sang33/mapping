import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react'
import { FormJson, ETypes, useJsonStates } from 'antd-form-json'
import type { IFormItem } from 'antd-form-json'
import { generateUUID } from '@packages/utils'
import { Button } from 'antd'
import { i18n } from '@packages/i18n'

interface IProps {
  defaultValue?: any
  value?: Record<string, any>
}

interface IKeyValueTableRef {
  getJson: () => Record<string, any>
}

const getFormStates = (value: Record<string, any>) => {
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
  _recursion(value, formStates)

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
  const { defaultValue, value } = props
  const [formStates, setFormStates] = useState<IFormItem[]>(
    defaultValue && Object.keys(defaultValue).length ? getFormStates(defaultValue) : [getNewFormState()]
  )
  const jsonState = useJsonStates(formStates)
  useImperativeHandle(
    ref,
    () => ({
      getJson: () => jsonState
    }),
    [jsonState]
  )

  useEffect(() => {
    value && setFormStates(getFormStates(value))
  }, [value])

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
