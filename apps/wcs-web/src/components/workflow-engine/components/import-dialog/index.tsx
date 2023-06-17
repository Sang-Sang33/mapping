import React, { memo, useState } from 'react'
import type { FC } from 'react'
import { Modal, message, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/lib/upload'

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
      message.error('请选择JSON格式的文件')
      return false
    }
    setFile(file)
    return false // 阻止自动上传
  }

  // 对话框的确认按钮点击事件处理函数
  const handleOk = () => {
    if (!file) {
      message.error('请选择JSON格式的文件')
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
      <Modal open={visible} title="导入JSON文件" onOk={handleOk} onCancel={onCancel} okText="导入" cancelText="取消">
        <Upload.Dragger beforeUpload={beforeUpload} fileList={file ? [file] : []} accept=".json" maxCount={1}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件导入</p>
          <p className="ant-upload-hint">支持JSON文件单个导入</p>
        </Upload.Dragger>
      </Modal>
    </div>
  )
}

export default memo(ImportDialog)
