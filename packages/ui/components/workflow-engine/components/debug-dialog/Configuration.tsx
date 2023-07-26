import React, { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react'
import type { ElementRef } from 'react'
import { Radio, message, type RadioChangeEvent } from 'antd'
import { i18n } from '@packages/i18n'
import KeyValueTable from './KeyValueTable'
import JsonEditor from './JsonEditor'

interface IProps {
  defaultValue?: any
  defaultEditorHeight?: string
}

interface IConfigurationRef {
  configurationMode: EConfiguration
  getValues: () => Promise<any>
}

export enum EConfiguration {
  KEY_VAVLUE_TABLE = 'keyValueTable',
  JSON_EDITOR = 'jsonEditor'
}

const t = (key: string) => i18n.t(key, { ns: 'workflowEngine' })

const Configuration = forwardRef<IConfigurationRef, IProps>((props, ref) => {
  const { defaultValue, defaultEditorHeight } = props
  const [configurationMode, setConfiguration] = useState<EConfiguration>(EConfiguration.KEY_VAVLUE_TABLE)
  useImperativeHandle(
    ref,
    () => ({
      configurationMode,
      getValues: () =>
        new Promise((resolve, reject) => {
          {
            if (configurationMode === EConfiguration.KEY_VAVLUE_TABLE) {
              const forms = keyValueTableRef.current!.forms
              Promise.all(forms.map((form: any) => form?.validateFields()))
                .then(() => {
                  console.log('all validate success')
                  const entries = forms.map((f: any) => {
                    const { key, value } = f.getFieldsValue()
                    return [key, value]
                  })
                  const properties = Object.fromEntries(entries)
                  resolve(properties)
                })
                .catch(reject)
            } else if (configurationMode === EConfiguration.JSON_EDITOR) {
              const editor = jsonEditorRef.current
              const value = editor?.getValue?.()
              try {
                const json = JSON.parse(value ?? '{}')
                resolve(json)
              } catch (err) {
                console.log('err:', err)
                reject(err)
                message.error(t('debugDialog.jsonInvalid'))
              }
            }
          }
        })
    }),
    [configurationMode]
  )
  const keyValueTableRef = useRef<ElementRef<typeof KeyValueTable>>(null)
  const jsonEditorRef = useRef<ElementRef<typeof JsonEditor>>(null)

  const onChange = (e: RadioChangeEvent) => {
    setConfiguration(e.target.value)
  }
  return (
    <div>
      <div className="flex items-center justify-end h-20">
        <Radio.Group onChange={onChange} value={configurationMode} buttonStyle="solid">
          <Radio.Button value={EConfiguration.KEY_VAVLUE_TABLE}>{t('debugDialog.keyValuePair')}</Radio.Button>
          <Radio.Button value={EConfiguration.JSON_EDITOR}>JSON</Radio.Button>
        </Radio.Group>
      </div>
      <div className={configurationMode === EConfiguration.KEY_VAVLUE_TABLE ? '' : 'hidden'}>
        <KeyValueTable ref={keyValueTableRef} defaultValue={defaultValue}></KeyValueTable>
      </div>
      <div className={configurationMode === EConfiguration.JSON_EDITOR ? '' : 'hidden'}>
        <JsonEditor ref={jsonEditorRef} defaultValue={defaultValue} defaultHeight={defaultEditorHeight}></JsonEditor>
      </div>
    </div>
  )
})

export default memo(Configuration)
