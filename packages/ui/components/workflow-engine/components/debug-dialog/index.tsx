import React, { memo, useEffect, useRef, useState } from 'react'
import type { ElementRef, FC } from 'react'
import { Modal, Steps, Button, Radio, type RadioChangeEvent, message } from 'antd'
import Editor from '@monaco-editor/react'
import { type editor } from 'monaco-editor'
import { MwForm, MwFormField } from 'multiway'

interface IProps {
  visible: boolean
  onConfirm?: (data: any) => void
  onCancel?: () => void
}

enum EStepContent {
  CONFIGURATION_MODE = 'configurationMode',
  CONFIGURATION = 'configuration'
}

enum EConfigurationMode {
  KEY_VAVLUE_TABLE = 'keyValueTable',
  JSON_EDITOR = 'jsonEditor'
}

const steps = [
  {
    title: '选择参数配置方式',
    content: EStepContent.CONFIGURATION_MODE
  },
  {
    title: '参数配置',
    content: EStepContent.CONFIGURATION
  }
]

const KeyValueForm = ({
  onRender
}: {
  onRender?: (formRef: React.MutableRefObject<ElementRef<typeof MwForm>>) => void
}) => {
  const formRef = useRef<ElementRef<typeof MwForm>>(null)
  const fields: Array<MwFormField> = [
    {
      key: 'key',
      rules: [
        {
          required: true,
          message: '键不能为空'
        }
      ]
    },
    {
      key: 'valueType',
      type: 'select',
      defaultValue: 'input',
      rules: [
        {
          required: true,
          message: '值类型不能为空'
        }
      ],
      options: [
        {
          label: '字符串',
          value: 'input'
        },
        {
          label: '数值',
          value: 'number'
        },
        {
          label: '布尔值',
          value: 'select'
        }
      ]
    },
    {
      key: 'value',
      type: '{{ formValues.valueType }}',
      rules: [
        {
          required: true,
          message: '值不能为空'
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
      ]
    }
  ]

  useEffect(() => {
    onRender?.(formRef)
  }, [])

  return (
    <MwForm className="!mb-2" ref={formRef as any} fields={fields} formLayout="vertical" span={8} gutter={8}></MwForm>
  )
}

const DebugDialog: FC<IProps> = (props) => {
  const { visible, onConfirm, onCancel } = props
  const [configurationMode, setConfigurationMode] = useState<EConfigurationMode>(EConfigurationMode.KEY_VAVLUE_TABLE)
  const [current, setCurrent] = useState(0)
  const [formCount, setFormCount] = useState(1)
  const [forms, setForms] = useState<ElementRef<typeof MwForm>[]>([])
  let editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const next = () => {
    setCurrent(current + 1)
  }
  const prev = () => {
    setCurrent(current - 1)
  }
  const onChange = (e: RadioChangeEvent) => {
    setConfigurationMode(e.target.value)
  }
  const renderConfigurationMode = () => (
    <div className="flex items-center justify-center h-20">
      <Radio.Group onChange={onChange} value={configurationMode} buttonStyle="solid">
        <Radio.Button value={EConfigurationMode.KEY_VAVLUE_TABLE}>键值对</Radio.Button>
        <Radio.Button value={EConfigurationMode.JSON_EDITOR}>JSON</Radio.Button>
      </Radio.Group>
    </div>
  )
  const renderConfiguration = () => ConfigurationMap[configurationMode]()

  const renderKeyValueTable = () => (
    <>
      <div className="flex">
        <span className="flex-1">键</span>
        <span className="flex-1">值类型</span>
        <span className="flex-1">值</span>
      </div>
      {new Array(formCount).fill('').map((_, i) => (
        <KeyValueForm key={i} onRender={(formRef) => setForms((forms) => [...forms, formRef.current])}></KeyValueForm>
      ))}
      <Button className="w-full -mt-8" type="dashed" onClick={() => setFormCount((c) => c + 1)}>
        新增
      </Button>
    </>
  )
  const renderJsonEditor = () => (
    <Editor onMount={(editor) => (editorRef.current = editor)} height="50vh" defaultLanguage="json" defaultValue="{}" />
  )
  const ConfigurationMap = {
    [EConfigurationMode.KEY_VAVLUE_TABLE]: renderKeyValueTable,
    [EConfigurationMode.JSON_EDITOR]: renderJsonEditor
  }
  const StepContentMap = {
    [EStepContent.CONFIGURATION_MODE]: renderConfigurationMode,
    [EStepContent.CONFIGURATION]: renderConfiguration
  }
  const items = steps.map((item) => ({ key: item.title, title: item.title }))

  const handleConfirm = () => {
    if (configurationMode === EConfigurationMode.KEY_VAVLUE_TABLE) {
      Promise.all(forms.map((form: any) => form.validateFields()))
        .then(() => {
          console.log('all validate success')
          const entries = forms.map((f: any) => {
            const { key, value } = f.getFieldsValue()
            return [key, value]
          })
          const properties = Object.fromEntries(entries)
          onConfirm?.(properties)
        })
        .catch((err) => {
          console.log('err', err)
        })
    } else if (configurationMode === EConfigurationMode.JSON_EDITOR) {
      const editor = editorRef.current
      const value = editor?.getValue()!
      try {
        const json = JSON.parse(value)
        onConfirm?.(json)
      } catch (err) {
        console.log('err:', err)
        message.error('请输入合法的JSON数据')
      }
    }
  }

  return (
    <Modal open={visible} title="调试" width={800} onCancel={onCancel} footer={null}>
      <Steps current={current} items={items} />
      <div className="steps-content my-4">{StepContentMap[steps[current].content]()}</div>
      <div className="steps-action flex justify-end">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            上一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleConfirm}>
            确认
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default memo(DebugDialog)
