import React, { memo, useEffect, useRef, useState } from 'react'
import type { ElementRef, FC } from 'react'
import { Modal, Button, Radio, type RadioChangeEvent, message } from 'antd'
import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { MwForm, MwFormField } from 'multiway'
import { i18n } from '@packages/i18n'
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// self.MonacoEnvironment = {
//   getWorker(_, label) {
//     if (label === 'json') {
//       return new jsonWorker()
//     }
//     if (label === 'css' || label === 'scss' || label === 'less') {
//       return new cssWorker()
//     }
//     if (label === 'html' || label === 'handlebars' || label === 'razor') {
//       return new htmlWorker()
//     }
//     if (label === 'typescript' || label === 'javascript') {
//       return new tsWorker()
//     }
//     return new editorWorker()
//   }
// }

// loader.config({ monaco })

const t = (key: string) => i18n.t(key, { ns: 'workflowEngine' })

interface IProps {
  visible: boolean
  onConfirm?: (data: any) => void
  onCancel?: () => void
}

enum EConfigurationMode {
  KEY_VAVLUE_TABLE = 'keyValueTable',
  JSON_EDITOR = 'jsonEditor'
}

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
          message: t('debugDialog.keyNull')
        }
      ],
      placeholder: t('debugDialog.keyPlaceholder')
    },
    {
      key: 'valueType',
      type: 'select',
      defaultValue: 'input',
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
      placeholder: t('debugDialog.valuePlaceholder')
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
  const [formCount, setFormCount] = useState(1)
  const [forms, setForms] = useState<ElementRef<typeof MwForm>[]>([])
  let editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const onChange = (e: RadioChangeEvent) => {
    setConfigurationMode(e.target.value)
  }
  const renderConfigurationMode = () => (
    <div className="flex items-center justify-end h-20">
      <Radio.Group onChange={onChange} value={configurationMode} buttonStyle="solid">
        <Radio.Button value={EConfigurationMode.KEY_VAVLUE_TABLE}>{t('debugDialog.keyValuePair')}</Radio.Button>
        <Radio.Button value={EConfigurationMode.JSON_EDITOR}>JSON</Radio.Button>
      </Radio.Group>
    </div>
  )
  const renderConfiguration = () => [renderKeyValueTable(), renderJsonEditor()]

  const renderKeyValueTable = () => (
    <div className={configurationMode === EConfigurationMode.KEY_VAVLUE_TABLE ? '' : 'hidden'}>
      <div className={`flex ${formCount === 0 ? 'hidden' : ''}`}>
        <div className="flex-[3] flex">
          <span className="flex-1">{t('debugDialog.key')}</span>
          <span className="flex-1">{t('debugDialog.valueType')}</span>
          <span className="flex-1">{t('debugDialog.value')}</span>
        </div>
        <span className="flex-[0.5]">操作</span>
      </div>
      {new Array(formCount).fill('').map((_, i) => (
        <div className="flex">
          <div className="flex-[3]">
            <KeyValueForm
              key={i}
              onRender={(formRef) => setForms((forms) => [...forms, formRef.current])}
            ></KeyValueForm>
          </div>
          <div className="flex-[0.5]">
            <Button
              type="link"
              danger
              onClick={() => {
                const newForms = [...forms]
                newForms.splice(i, 1)
                console.log('🚀 ~ file: index.tsx ~ line 171 ~ newForms', newForms)
                setForms(newForms)
                setFormCount((c) => c - 1)
              }}
            >
              删除
            </Button>
          </div>
        </div>
      ))}
      <Button className="w-full" type="dashed" onClick={() => setFormCount((c) => c + 1)}>
        {t('debugDialog.add')}
      </Button>
    </div>
  )
  const renderJsonEditor = () => (
    <div className={configurationMode === EConfigurationMode.JSON_EDITOR ? '' : 'hidden'}>
      <Editor
        onMount={(editor) => (editorRef.current = editor)}
        height="50vh"
        defaultLanguage="json"
        defaultValue="{}"
      />
    </div>
  )

  const handleConfirm = () => {
    if (configurationMode === EConfigurationMode.KEY_VAVLUE_TABLE) {
      Promise.all(forms.map((form: any) => form?.validateFields()))
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
        message.error(t('debugDialog.jsonInvalid'))
      }
    }
  }

  return (
    <Modal
      open={visible}
      title={t('debugDialog.title')}
      width={800}
      onCancel={onCancel}
      onOk={handleConfirm}
      maskClosable={false}
      keyboard={false}
    >
      {renderConfigurationMode()}
      {renderConfiguration()}
    </Modal>
  )
}

export default memo(DebugDialog)
