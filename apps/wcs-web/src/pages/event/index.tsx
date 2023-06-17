import WorkflowEngine, { CreateDataFn, DeleteDataFn, FetchDataFn, UpdateDataFn } from '@/components/workflow-engine'
import React, { memo } from 'react'
import type { FC } from 'react'
import { fetchEvent, deleteEvent, createEvent, fetchEventWorkflowDefinition, updateEvent } from '@/http/'
import fields from './config/formFields'
import workflowApi from './config/workflowApi'
import { IMenuItem } from '@/components/workflow-engine/components/aside'
import { WorkflowTypeEnum } from '@/components/workflow-engine/common'
import i18n from '@/i18n'
import { IconFont } from '@/components/Icon'

interface FormData {
  name: string
}

const Event: FC = () => {
  // 获取事件工作流数据
  const fetchData: FetchDataFn = () =>
    fetchEvent().then((res) =>
      res.map((x) => ({
        label: x.name,
        field: x.name,
        definitionId: x.id, // 工作流需要设置definitionId, 并且这个definitionId有效, workflowEngine组件会根据definitionId来打开工作流引擎并显示
        data: x,
        type: WorkflowTypeEnum.EVENT,
        icon: <IconFont type="icon-shijian-black" />
      }))
    )

  const deleteData: DeleteDataFn = (menuItem: IMenuItem) => deleteEvent(menuItem.definitionId!)
  const createData: CreateDataFn = ({ name }: FormData) => {
    return createEvent([
      {
        name,
        activities: [],
        connections: [],
        persistenceBehavior: 'WorkflowBurst',
        publish: false
      }
    ])
  }
  const updateData: UpdateDataFn = async ({ name }: FormData, menuItem) => {
    const [workflowDefinition] = await fetchEventWorkflowDefinition([menuItem.definitionId!])
    const { definitionId, isPublished } = workflowDefinition
    return updateEvent({
      ...workflowDefinition,
      name,
      workflowDefinitionId: definitionId,
      publish: isPublished
    })
  }
  // 复制或导入
  const batchCreateData = async (menu: IMenuItem[]) => {
    const definitionIds = menu.map((menuItem) => menuItem.definitionId as string)
    const idNameMap = Object.fromEntries(menu.map(({ definitionId, label }) => [definitionId, label]))

    const workflowDefinitionList = await fetchEventWorkflowDefinition(definitionIds)
    return createEvent(
      workflowDefinitionList.map(({ definitionId, activities, connections, persistenceBehavior }) => ({
        name: idNameMap[definitionId],
        activities,
        connections,
        persistenceBehavior,
        publish: false
      }))
    )
  }

  return (
    <WorkflowEngine
      title={i18n.t(`event.title`)}
      type={WorkflowTypeEnum.EVENT}
      formFields={fields}
      fetchData={fetchData}
      deleteData={deleteData}
      createData={createData}
      updateData={updateData}
      batchCreateData={batchCreateData}
      workflowApi={workflowApi}
    ></WorkflowEngine>
  )
}

export default memo(Event)
