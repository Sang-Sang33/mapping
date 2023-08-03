import React, { memo, useEffect, useRef, useState } from 'react'
import type { FC, ElementRef, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MwDialog, MwForm, MwFormField, MwSearchTableField } from 'multiway'
import Configuration from '@packages/ui/components/workflow-engine/components/debug-dialog/Configuration'
import JsonEditor from '@packages/ui/components/workflow-engine/components/debug-dialog/JsonEditor'
import KeyValueTable from '@packages/ui/components/workflow-engine/components/debug-dialog/KeyValueTable'

type TConfigurationMode = 'All' | 'Json' | 'KeyValuePairs' | 'None'

interface IProps {
  open: boolean
  title: string
  fields: (MwSearchTableField | MwFormField)[]
  initialValues?: Record<string, any>
  configurationMode?: TConfigurationMode
  onConfirm?: (data: any) => Promise<any>
  onCancel?: () => void
}

const MissionDialog: FC<IProps> = (props) => {
  const { open = false, title, fields, initialValues, onConfirm, onCancel, configurationMode = 'All' } = props
  const { t } = useTranslation()
  const dialogFormRef = useRef<any>(null)
  const configurationRef = useRef<ElementRef<typeof Configuration>>(null)
  const jsonEditorRef = useRef<ElementRef<typeof JsonEditor>>(null)
  const keyValueTableRef = useRef<ElementRef<typeof KeyValueTable>>(null)
  const [dialogConfirmLoading, setDialogConfirmLoading] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      dialogFormRef.current?.setFieldsValue(initialValues)
    }, 0)
  }, [initialValues, open])

  const getJsonDataStrategy: Record<TConfigurationMode, () => any> = {
    All: async () => await configurationRef.current?.getValues(),
    Json: async () => JSON.parse((await jsonEditorRef.current?.getValue?.()) ?? '{}'),
    KeyValuePairs: () => keyValueTableRef.current?.getJson(),
    None: () => null
  }
  const onDialogConfirm = async () => {
    setDialogConfirmLoading(true)
    try {
      const formValues = dialogFormRef.current.getFieldsValue()
      const configurationValues = await getJsonDataStrategy[configurationMode]()
      const combineValues = { ...formValues }
      if (configurationValues) combineValues.extraProperties = configurationValues
      await onConfirm?.(combineValues)
      setDialogConfirmLoading(false)
    } catch (err) {
      console.log('err:', err)
      setDialogConfirmLoading(false)
    }
  }

  const value = initialValues?.['extraProperties'] ?? {}
  const configurationModeStrategy: Record<TConfigurationMode, ReactNode> = {
    All: <Configuration ref={configurationRef} defaultEditorHeight="30vh" value={value}></Configuration>,
    Json: <JsonEditor ref={jsonEditorRef} defaultHeight="30vh" value={value}></JsonEditor>,
    KeyValuePairs: <KeyValueTable ref={keyValueTableRef} value={value}></KeyValueTable>,
    None: null
  }

  return (
    <MwDialog
      width={800}
      title={title}
      visible={open}
      onConfirm={onDialogConfirm}
      onCancel={onCancel}
      maskClosable={false}
      keyboard={false}
      loading={dialogConfirmLoading}
    >
      <MwForm ref={dialogFormRef} fields={fields}></MwForm>
      {configurationMode !== 'None' && (
        <div className="flex">
          <div className="w-[120px] text-right whitespace-nowrap">{t('wmsMission.extraProperties')}：</div>
          <div className="flex-1 px-2">{configurationModeStrategy[configurationMode]}</div>
        </div>
      )}
    </MwDialog>
  )
}

export default memo(MissionDialog)
