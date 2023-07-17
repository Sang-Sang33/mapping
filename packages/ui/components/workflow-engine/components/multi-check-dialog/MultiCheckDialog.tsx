import React, { Key, memo, useMemo, useState } from 'react'
import type { FC } from 'react'
import { Button, Modal, Tree, TreeProps } from 'antd'
import type { DataNode } from 'antd/lib/tree'
import { i18n } from '@packages/i18n'
import { IMenuItem } from '../aside'

const t = (key: string) => i18n.t(key, { ns: 'workflowEngine' })

interface IProps {
  open: boolean
  data: IMenuItem[]
  title?: string
  onOk?: (data: IMenuItem[]) => void
  onCancel?: () => void
}

const MultiCheckDialog: FC<IProps> = (props) => {
  const { open, title = '请选择', data, onOk, onCancel } = props

  const handleOk = () => {
    const result = data.filter((x) => checkedKeys.includes(x.field)) || []
    onOk?.(result)
    setCheckedKeys([])
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const onCheck: TreeProps['onCheck'] = (keys, { node }) => {
    const newCheckedKeys = checkedKeys.includes(node.key)
      ? checkedKeys.filter((x) => x !== node.key)
      : [...checkedKeys, node.key]
    setCheckedKeys(newCheckedKeys)
  }
  const treeData: DataNode[] = useMemo(
    () => data.map((x) => ({ title: x.label, key: x.field, icon: x.icon })) || [],
    [data]
  )
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([])
  const isAllChecked = useMemo(() => checkedKeys.length === treeData.length, [checkedKeys, treeData])
  const handleSelect = () => {
    const checkedKeys = !isAllChecked ? treeData.map((x) => x.key) : []
    setCheckedKeys(checkedKeys)
  }
  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="select" type="primary" onClick={handleSelect}>
          {isAllChecked ? t('multiCheckDialog.deselectAll') : t('multiCheckDialog.selectAll')}
        </Button>,
        <Button key="cancel" type="default" onClick={handleCancel}>
          {t('multiCheckDialog.cancel')}
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {t('multiCheckDialog.confirm')}
        </Button>
      ]}
    >
      <Tree checkable selectable={false} onCheck={onCheck} treeData={treeData} checkedKeys={checkedKeys} showIcon />
    </Modal>
  )
}

export default memo(MultiCheckDialog)
