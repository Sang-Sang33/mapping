import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import type { ReactNode, FC, ElementRef } from 'react'
import { i18n } from '@packages/i18n'
import { MwForm, MwFormField } from 'multiway'
import { Button } from 'antd'

interface IProps {
  defaultValue?: any
}

interface IKeyValueTableRef {
  forms: any[]
}

const t = (key: string) => i18n.t(key, { ns: 'workflowEngine' })

const KeyValueForm = ({
  defaultValue,
  onRender
}: {
  defaultValue?: any
  onRender?: (formRef: React.MutableRefObject<any>) => void
}) => {
  const formRef = useRef<any>(null)
  const fields: Array<MwFormField> = [
    {
      key: 'key',
      rules: [
        {
          required: true,
          message: t('debugDialog.keyNull')
        }
      ],
      placeholder: t('debugDialog.keyPlaceholder'),
      defaultValue: defaultValue['key']
    },
    {
      key: 'valueType',
      type: 'select',
      defaultValue: defaultValue['valueType'] || 'input',
      rules: [
        {
          required: true,
          message: t('debugDialog.valueTypeNull')
        }
      ],
      options: [
        {
          label: t('debugDialog.valueTypeString'),
          value: 'input'
        },
        {
          label: t('debugDialog.valueTypeNumber'),
          value: 'number'
        },
        {
          label: t('debugDialog.valueTypeBoolean'),
          value: 'select'
        }
      ],
      placeholder: t('debugDialog.valueTypePlaceholder'),
      onChange: (_, __, setFieldsValue) => {
        setFieldsValue?.({
          value: ''
        })
      }
    },
    {
      key: 'value',
      type: '{{ formValues.valueType }}',
      rules: [
        {
          required: true,
          message: t('debugDialog.valueNull')
        }
      ],
      options: [
        {
          label: 'true',
          value: true
        },
        {
          label: 'false',
          value: false
        }
      ],
      placeholder: t('debugDialog.valuePlaceholder'),
      defaultValue: defaultValue['value']
    }
  ]

  useEffect(() => {
    onRender?.(formRef)
  }, [])

  return (
    <MwForm
      className="!mb-2"
      ref={formRef as any}
      fields={fields}
      formLayout="vertical"
      span={8}
      gutter={8}
      props={{ initialValues: defaultValue }}
    ></MwForm>
  )
}

const KeyValueTable = forwardRef<IKeyValueTableRef, IProps>((props, ref) => {
  const { defaultValue } = props
  const [formCount, setFormCount] = useState(1)
  const [forms, setForms] = useState<any[]>([])
  const debuggingDefaultValueEntries = useMemo(() => (defaultValue ? Object.entries(defaultValue) : []), [defaultValue])
  useImperativeHandle(
    ref,
    () => ({
      forms
    }),
    [forms]
  )
  useEffect(() => {
    setFormCount(debuggingDefaultValueEntries.length || 1)
  }, [debuggingDefaultValueEntries])

  return (
    <div>
      <div className={`flex ${formCount === 0 ? 'hidden' : ''}`}>
        <div className="flex-[3] flex">
          <span className="flex-1">{t('debugDialog.key')}</span>
          <span className="flex-1">{t('debugDialog.valueType')}</span>
          <span className="flex-1">{t('debugDialog.value')}</span>
        </div>
        <span className="flex-[0.5]">操作</span>
      </div>
      {new Array(formCount).fill('').map((_, i) => {
        const [key, value] = debuggingDefaultValueEntries[i] ?? []
        let valueType = ''
        switch (typeof value) {
          case 'string':
            valueType = 'input'
            break
          case 'number':
            valueType = 'number'
            break
          case 'boolean':
            valueType = 'select'
            break
          default:
            valueType = 'input'
            break
        }
        const defaultValue = {
          key: key ?? '',
          value: value ?? '',
          valueType
        }

        return (
          <div className="flex" key={key}>
            <div className="flex-[3]">
              <KeyValueForm
                key={i}
                onRender={(formRef) => {
                  setForms((forms) => [...forms, formRef.current])
                  // formRef.current?.setFieldsValue?.(defaultValue)
                }}
                defaultValue={defaultValue}
              ></KeyValueForm>
            </div>
            <div className="flex-[0.5]">
              <Button
                type="link"
                danger
                onClick={() => {
                  const newForms = [...forms]
                  newForms.splice(i, 1)
                  setForms(newForms)
                  setFormCount((c) => c - 1)
                }}
              >
                删除
              </Button>
            </div>
          </div>
        )
      })}
      <Button className="w-full" type="dashed" onClick={() => setFormCount((c) => c + 1)}>
        {t('debugDialog.add')}
      </Button>
    </div>
  )
})

export default memo(KeyValueTable)
