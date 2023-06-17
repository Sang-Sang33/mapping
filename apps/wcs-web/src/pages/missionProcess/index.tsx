import WorkflowEngine, { CreateDataFn, DeleteDataFn, FetchDataFn, UpdateDataFn } from '@/components/workflow-engine'
import React, { memo } from 'react'
import type { FC } from 'react'
import {
  fetchMissionProcess,
  deleteMissionProcess,
  createMissionProcess,
  fetchMissionProcessWorkflowDefinition,
  updateMissionProcess,
  fetchMissionProcessAvailableNames
} from '@/http/'
import fields from './config/formFields'
import workflowApi from './config/workflowApi'
import { IMenuItem } from '@/components/workflow-engine/components/aside'
import { WorkflowTypeEnum } from '@/components/workflow-engine/common'
import i18n from '@/i18n'
import { MwDialogFormField } from 'multiway'
import { IconFont } from '@/components/Icon'

interface FormData {
  name: string
}

const Event: FC = () => {
  // 获取事件工作流数据
  const fetchData: FetchDataFn = () =>
    fetchMissionProcess().then((res) =>
      res.map((x) => ({
        label: x.name,
        field: x.name,
        definitionId: x.id, // 工作流需要设置definitionId, 并且这个definitionId有效, workflowEngine组件会根据definitionId来打开工作流引擎并显示
        data: x,
        type: WorkflowTypeEnum.MISSION_PROCESS,
        icon: <IconFont type="icon-renwuchuli-black" />
      }))
    )

  const deleteData: DeleteDataFn = (menuItem: IMenuItem) => deleteMissionProcess(menuItem.definitionId!)
  const createData: CreateDataFn = ({ name }: FormData) => {
    return createMissionProcess([
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
    const [workflowDefinition] = await fetchMissionProcessWorkflowDefinition([menuItem.definitionId!])
    const { definitionId, isPublished } = workflowDefinition
    return updateMissionProcess({
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

    const workflowDefinitionList = await fetchMissionProcessWorkflowDefinition(definitionIds)
    return createMissionProcess(
      workflowDefinitionList.map(({ definitionId, activities, connections, persistenceBehavior }) => ({
        name: idNameMap[definitionId],
        activities,
        connections,
        persistenceBehavior,
        publish: false
      }))
    )
  }

  const handleBeforeDialogOpen = async (formFields: MwDialogFormField[]) => {
    const missionProcessAvailableNames = await fetchMissionProcessAvailableNames()
    const missionProcessNames = (await fetchMissionProcess()).map((x) => x.name)
    formFields[0]!.options = missionProcessAvailableNames
      .filter((x) => !missionProcessNames.includes(x))
      .map((x) => ({
        label: x,
        value: x
      }))

    return [...formFields]
  }

  return (
    <WorkflowEngine
      title={i18n.t(`missionProcess.title`)}
      type={WorkflowTypeEnum.MISSION_PROCESS}
      formFields={fields}
      fetchData={fetchData}
      deleteData={deleteData}
      createData={createData}
      updateData={updateData}
      batchCreateData={batchCreateData}
      workflowApi={workflowApi}
      beforeDialogOpen={handleBeforeDialogOpen}
    ></WorkflowEngine>
  )
}

export default memo(Event)
