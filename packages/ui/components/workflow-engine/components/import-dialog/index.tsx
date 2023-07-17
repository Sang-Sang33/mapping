import React, { memo, useState } from 'react'
import type { FC } from 'react'
import { Modal, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/lib/upload'
import { i18n } from '@packages/i18n'
import { showMessage } from '../../common'

const t = (key: string) => i18n.t(key, { ns: 'workflowEngine' })

interface IProps {
  visible: boolean
  onUpload?: (data: any) => void
  onCancel?: () => void
}

const ImportDialog: FC<IProps> = (props) => {
  const { visible, onUpload, onCancel } = props
  const [file, setFile] = useState<RcFile>() // 存储用户选择的文件

  // 导入前的文件类型检查
  const beforeUpload = (file: RcFile) => {
    if (file.type !== 'application/json') {
      showMessage('file_invalid')()
      return false
    }
    setFile(file)
    return false // 阻止自动上传
  }

  // 对话框的确认按钮点击事件处理函数
  const handleOk = () => {
    if (!file) {
      showMessage('file_invalid')()
      return
    }
    const reader = new FileReader()
    reader.onload = function (event) {
      if (event.target) {
        const jsonData = JSON.parse(event.target.result as string)
        onUpload?.(jsonData)
        setFile(undefined)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <Modal open={visible} title={t('importDialog.title')} onOk={handleOk} onCancel={onCancel}>
        <Upload.Dragger beforeUpload={beforeUpload} fileList={file ? [file] : []} accept=".json" maxCount={1}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t('importDialog.importText')}</p>
          <p className="ant-upload-hint">{t('importDialog.importHint')}</p>
        </Upload.Dragger>
      </Modal>
    </div>
  )
}

export default memo(ImportDialog)
