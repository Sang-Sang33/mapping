import React, { memo, useState } from 'react'
import type { FC } from 'react'
import { useWcsRequest } from '@packages/services'
import { WorkflowEngine, WorkflowTypeEnum } from '@packages/ui'
import type { TCreate, TDelete, TFetch, TUpdate, IMenuItem } from '@packages/ui'
import { useStorage } from '@packages/hooks'
import i18n from '@/i18n'
import { MwDialogFormField } from 'multiway'
import { IconFont } from '@/components/Icon'
import fields from './config/formFields'
import workflowApi from './config/workflowApi'

interface FormData {
  name: string
}

const Event: FC = () => {
  const {
    fetchMissionProcess,
    deleteMissionProcess,
    createMissionProcess,
    fetchMissionProcessWorkflowDefinition,
    updateMissionProcess,
    fetchMissionProcessAvailableNames,
    debugMissionProcess
  } = useWcsRequest()
  const storage = useStorage()

  // 获取事件工作流数据
  const onFetch: TFetch = () =>
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

  const onDelete: TDelete = (menuItem: IMenuItem) => deleteMissionProcess(menuItem.definitionId!)
  const onCreate: TCreate = ({ name }: FormData) => {
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
  const onUpdate: TUpdate = async ({ name }: FormData, menuItem) => {
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
  const onBatchCreate = async (menu: IMenuItem[]) => {
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

  // 调试
  let [missionProcessDebugHistory, setMissionProcessDebugHistory] = useState(
    storage.getItem('MISSION_PROCESS_DEBUG_HISTORY') ?? {}
  )
  const debug = async (id: string, data: any) => {
    const newMissionProcessDebugHistory = { ...missionProcessDebugHistory }
    newMissionProcessDebugHistory[id] = data
    storage.setItem('MISSION_PROCESS_DEBUG_HISTORY', newMissionProcessDebugHistory)
    setMissionProcessDebugHistory(newMissionProcessDebugHistory)
    return debugMissionProcess({
      id,
      extraProperties: data
    })
  }

  return (
    <WorkflowEngine
      title={i18n.t(`missionProcess.title`)}
      type={WorkflowTypeEnum.MISSION_PROCESS}
      workflowEngineUrl={import.meta.env.VITE_WORKFLOW_ENGINE_URL || 'http://120.79.85.168:6034'}
      formFields={fields}
      onFetch={onFetch}
      onDelete={onDelete}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onBatchCreate={onBatchCreate}
      workflowApi={workflowApi}
      beforeDialogOpen={handleBeforeDialogOpen}
      debug={debug}
      debuggingHistory={missionProcessDebugHistory}
    ></WorkflowEngine>
  )
}

export default memo(Event)
