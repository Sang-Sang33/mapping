import React, { useState } from 'react'
import { Button, Drawer, Space } from 'antd'
import { useStore } from '../store/index'
import { observer } from 'mobx-react-lite'
import EditForm from './editForm'
import type { IMenu } from '@/types'

const EditDrawer: React.FC = () => {
  const { EditorStore } = useStore()
  const { drawerOpen, currentMenu } = EditorStore

  const editTitle = currentMenu?.label

  const onClose = () => {
    EditorStore.setDrawerOpen(false)
    EditorStore.setEditingRectName(undefined)
  }

  return (
    <Drawer title={`编辑${editTitle}`} placement="right" onClose={onClose} open={drawerOpen}>
      <EditForm></EditForm>
    </Drawer>
  )
}

export default observer(EditDrawer)
