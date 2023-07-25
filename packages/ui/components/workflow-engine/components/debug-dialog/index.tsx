import React, { memo, useRef } from 'react'
import type { ElementRef, FC } from 'react'
import { Modal } from 'antd'
import { i18n } from '@packages/i18n'
import Configuration from './Configuration'

const t = (key: string) => i18n.t(key, { ns: 'workflowEngine' })

interface IProps {
  visible: boolean
  debuggingDefaultValue?: Record<string, any>
  onConfirm?: (data: any) => void
  onCancel?: () => void
}

const DebugDialog: FC<IProps> = (props) => {
  const { visible, debuggingDefaultValue, onConfirm, onCancel } = props
  const configurationRef = useRef<ElementRef<typeof Configuration>>(null)

  const handleConfirm = async () => {
    const values = await configurationRef.current?.getValues()
    onConfirm?.(values)
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
      <Configuration ref={configurationRef} defaultValue={debuggingDefaultValue}></Configuration>
    </Modal>
  )
}

export default memo(DebugDialog)
