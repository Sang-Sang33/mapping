import React, { memo, useEffect, useRef, useState } from 'react'
import type { FC, ElementRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MwDialog, MwForm, MwFormField, MwSearchTableField } from 'multiway'
import Configuration from '@packages/ui/components/workflow-engine/components/debug-dialog/Configuration'

interface IProps {
  open: boolean
  title: string
  fields: (MwSearchTableField | MwFormField)[]
  initialValues?: Record<string, any>
  onConfirm?: (data: any) => Promise<any>
  onCancel?: () => void
}

const MissionDialog: FC<IProps> = (props) => {
  const { open = false, title, fields, initialValues, onConfirm, onCancel } = props
  console.log('🚀 ~ file: index.tsx ~ line 18 ~ fields', fields)
  // const [dialogOpen, setDialogOpen] = useState(false)
  const dialogFormRef = useRef<any>(null)
  const configurationRef = useRef<ElementRef<typeof Configuration>>(null)
  const [dialogConfirmLoading, setDialogConfirmLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setTimeout(() => {
      dialogFormRef.current?.setFieldsValue(initialValues)
    }, 0)
  }, [initialValues, open])

  const onDialogConfirm = async () => {
    setDialogConfirmLoading(true)
    try {
      const formValues = dialogFormRef.current.getFieldsValue()
      const configurationValues = await configurationRef.current?.getValues()
      const combineValues = { ...formValues, extraProperties: configurationValues }
      await onConfirm?.(combineValues)
      setDialogConfirmLoading(false)
    } catch (err) {
      console.log('err:', err)
      setDialogConfirmLoading(false)
    }
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
      <div className="flex">
        <div className="w-[120px] text-right whitespace-nowrap">{t('wmsMission.extraProperties')}：</div>
        <div className="flex-1 px-2">
          <Configuration
            ref={configurationRef}
            defaultEditorHeight="30vh"
            value={initialValues?.['extraProperties'] ?? {}}
          ></Configuration>
        </div>
      </div>
    </MwDialog>
  )
}

export default memo(MissionDialog)
