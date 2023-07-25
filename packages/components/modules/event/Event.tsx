import React, { memo, useState } from 'react'
import type { FC } from 'react'
import { useWcsRequest } from '@packages/services'
import { WorkflowEngine, WorkflowTypeEnum } from '@packages/ui'
import type { TCreate, TDelete, TFetch, TUpdate, IMenuItem } from '@packages/ui'
import { i18n } from '@packages/i18n'
import { useStorage } from '@packages/hooks'
import fields from './config/formFields'
import workflowApi from './config/workflowApi'

interface IEventProps {
  workflowEngineUrl: string
  baseUrl?: string
}

interface FormData {
  name: string
}

const Event: FC<IEventProps> = (props) => {
  const { workflowEngineUrl, baseUrl } = props
  const { fetchEvent, deleteEvent, createEvent, fetchEventWorkflowDefinition, updateEvent, debugEvent } =
    useWcsRequest(baseUrl)
  const storage = useStorage()

  // 获取事件工作流数据
  const onFetch: TFetch = () =>
    fetchEvent().then((res) =>
      res.map((x) => ({
        label: x.name,
        field: x.name,
        definitionId: x.id, // 工作流需要设置definitionId, 并且这个definitionId有效, workflowEngine组件会根据definitionId来打开工作流引擎并显示
        data: x,
        type: WorkflowTypeEnum.EVENT,
        icon: (
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1210"
            width="16"
            height="16"
          >
            <path
              d="M825.164055 162.905916H198.834886c-59.639847 0-107.986583 44.72724-107.986583 99.902336V842.249066c0 55.173332 48.347089 99.903041 107.986583 99.903042H825.164055c59.639495 0 107.987995-44.729709 107.987995-99.903042V262.808252c0-55.175096-48.348853-99.902336-107.987995-99.902336z m36.649342 670.074629c0 23.844227-20.892185 43.173961-46.665399 43.17396H208.852354c-25.773214 0-46.666104-19.329734-46.666104-43.17396V272.077832c0-23.843874 20.892891-43.173608 46.666104-43.173608h606.295292c25.773566 0 46.665399 19.329381 46.665398 43.173608v560.902713z"
              fill="#2c2c2c"
              p-id="1211"
            ></path>
            <path
              d="M908.803351 386.664881c0 19.472609-19.264823 35.257988-43.027205 35.257988H158.225618c-23.764499 0-43.028616-15.785379-43.028617-35.257988s19.264117-35.257988 43.028617-35.257988h707.550528c23.76203 0 43.027205 15.785379 43.027205 35.257988zM804.401692 572.697121c0 19.472609-14.286075 35.257282-31.909777 35.257283H247.761589c-17.623702 0-31.910836-15.784673-31.910836-35.257283 0-19.472256 14.287133-35.258341 31.910836-35.25834h524.730326c17.623702-0.000353 31.909777 15.785732 31.909777 35.25834zM806.276704 729.918734c0 19.472256-14.286075 35.256929-31.91013 35.25693H249.63519c-17.623702 0-31.910836-15.784673-31.910836-35.25693 0-19.472609 14.287133-35.258693 31.910836-35.258693h524.731032c17.624408-0.000353 31.910483 15.785732 31.910482 35.258693zM302.395524 288.572646c-19.472609 0-35.256929-5.017906-35.256929-11.208092V93.055631c0-6.18948 15.784673-11.208092 35.256929-11.208091 19.472609 0 35.258693 5.018612 35.258693 11.208091v184.308923c0 6.190538-15.786085 11.208092-35.258693 11.208092zM718.908551 288.572646c-19.472256 0-35.256929-5.017906-35.25693-11.208797V93.055631c0-6.18948 15.784673-11.208092 35.25693-11.208091 19.472609 0 35.258693 5.018612 35.258693 11.208091v184.308218c0 6.191244-15.786085 11.208797-35.258693 11.208797z"
              fill="#2c2c2c"
              p-id="1212"
            ></path>
          </svg>
        )
      }))
    )

  const onDelete: TDelete = (menuItem: IMenuItem) => deleteEvent(menuItem.definitionId!)
  const onCreate: TCreate = ({ name }: FormData) => {
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
  const onUpdate: TUpdate = async ({ name }: FormData, menuItem) => {
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
  const onBatchCreate = async (menu: IMenuItem[]) => {
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
  // 调试
  let [eventDebugHistory, setEventDebugHistory] = useState(storage.getItem('EVENT_DEBUG_HISTORY') ?? {})
  const debug = async (id: string, data: any) => {
    const newEventDebugHistory = { ...eventDebugHistory }
    newEventDebugHistory[id] = data
    storage.setItem('EVENT_DEBUG_HISTORY', newEventDebugHistory)
    setEventDebugHistory(newEventDebugHistory)

    return debugEvent({
      id,
      extraProperties: data
    })
  }

  return (
    <WorkflowEngine
      title={i18n.t(`title`, { ns: 'event' })}
      type={WorkflowTypeEnum.EVENT}
      workflowEngineUrl={workflowEngineUrl}
      formFields={fields}
      onFetch={onFetch}
      onDelete={onDelete}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onBatchCreate={onBatchCreate}
      debug={debug}
      workflowApi={workflowApi}
      debuggingHistory={eventDebugHistory}
    ></WorkflowEngine>
  )
}

export default memo(Event)
