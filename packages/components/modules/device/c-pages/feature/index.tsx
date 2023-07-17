import React, { memo, useRef, useState } from 'react'
import type { FC } from 'react'
import { message } from 'antd'
import { MwDialogForm, MwDialogFormField } from 'multiway'
import { WorkflowEngine, WorkflowTypeEnum, defaultDialogProps } from '@packages/ui'
import type {
  CreateDataFn,
  DeleteDataFn,
  FetchDataFn,
  GetFormInitialValueFn,
  IWorkflowEngineComponentRef,
  OnNotEditWorkflow,
  UpdateDataFn,
  IDefaultDialogFormProps,
  IMenuItem
} from '@packages/ui'
import { useWcsRequest } from '@packages/services'
import { i18n } from '@packages/i18n'
import { useTranslation } from 'react-i18next'
import workflowApi from './config/workflowApi'
import fields from './config/formFields'
interface IFeatureProps {
  workflowEngineUrl: string
  baseUrl?: string
}

interface FormData {
  deviceName: string
  functionName: string
  behaviour: string
}

const Feature: FC<IFeatureProps> = (props) => {
  const { workflowEngineUrl, baseUrl } = props
  const { t } = useTranslation('device')
  const {
    fetchDevice,
    deleteDeviceFunction,
    createDeviceFunction,
    deleteDevice,
    updateDeviceFunction,
    updateDevice,
    fetchDeviceFunction,
    debugDeviceFunction
  } = useWcsRequest(baseUrl)
  // 获取数据
  const fetchData: FetchDataFn = () =>
    fetchDevice().then((res) =>
      res.map((x) => ({
        label: x.name,
        field: x.name,
        definitionId: null,
        children: x.functions.map((f) => ({
          label: f.name,
          field: f.id,
          definitionId: f.id,
          type: WorkflowTypeEnum.FUNCTION,
          parentData: x,
          data: f,
          icon: (
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1663"
              width="16"
              height="16"
            >
              <path
                d="M1016.064 396.032l-108.8-119.808c-13.056-26.368-39.424-42.752-68.608-42.752h-90.624c-23.80288 0-43.25888 19.456-43.25888 43.264 0 23.808 19.456 43.264 43.25888 43.264h84.74112l105.216 112.384v451.84H90.624V432.64l111.104-112.64h87.552c23.808 0 43.008-19.2 43.264-43.008 0-23.808-19.2-43.264-43.008-43.264H195.584c-28.928 0-54.784 15.872-68.096 41.216L12.8 395.008c-5.632 10.752-8.704 23.04-8.704 35.328v463.616c0 42.24 34.304 76.544 76.544 76.544H947.2c42.24 0 76.544-34.304 76.544-76.544V429.824c0.256-11.776-2.56-23.296-7.68-33.792z"
                fill="#2c2c2c"
                p-id="1664"
              ></path>
              <path
                d="M643.328 97.024l-9.472-9.472c-13.056-9.472-28.16-20.736-45.056-29.952-1.792-1.792-5.632-1.792-7.424-3.84-1.792-1.792-5.632-1.792-7.424-3.84-7.41888 0-13.056 1.792-16.896 5.632-1.792 1.792-3.84 3.84-3.84 7.424v120.064c-3.84 11.264-11.264 18.688-20.736 20.736l-35.584-1.792c-11.264 0-18.688-7.424-16.896-16.896V65.024c0-3.84-1.792-5.632-3.84-7.424-3.84-3.84-9.472-5.632-16.896-5.632-3.84 0-5.632 1.792-7.424 3.84-1.792 1.792-5.632 1.792-7.424 3.84-15.104 7.424-32 16.896-45.056 29.952l-7.424 7.424c-58.112 65.792-56.32 165.12 5.632 227.072 5.632 5.632 11.264 11.264 16.896 13.056l-1.792 163.328c0 48.896 39.424 88.32 88.32 88.32h22.528c48.896 0 88.32-39.424 88.32-88.32v-157.696c9.472-5.632 15.104-11.264 22.528-18.688 61.44-61.952 67.072-161.536 8.96-227.072z m-112.64 409.088c-9.47712 9.472-26.368 11.264-37.63712 0-9.472-9.472-11.264-26.368 0-37.632 11.264-11.264 28.16-13.056 37.63712 0 9.216 9.472 11.264 26.368 0 37.632z"
                fill="#2c2c2c"
                p-id="1665"
              ></path>
              <path
                d="M642.048 392.192v122.88c0 58.624-53.248 105.984-119.04 105.984H492.544c-65.792 0-119.04-47.36-119.04-105.984l1.536-122.88H54.272v523.264h919.552V392.192h-331.776z m46.848 392.96h-349.696c-13.824 0-24.832-11.25888-24.832-24.832 0-13.824 11.264-24.832 24.832-24.832h349.44c13.824 0 24.832 11.25888 24.832 24.832 0.256 13.568-11.008 24.832-24.576 24.832z"
                fill="#2c2c2c"
                p-id="1666"
              ></path>
            </svg>
          )
        })),
        type: WorkflowTypeEnum.DEVICE,
        parentData: null,
        icon: (
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1814"
            width="16"
            height="16"
          >
            <path
              d="M943.281 788.429H786.547V112.713a30.688 30.688 0 1 0-61.375 0v491.43h-69.94l-87.785-263.578A153.261 153.261 0 0 0 421.894 235.57H264.861a30.7 30.7 0 0 0-30.689 30.714v276.43H80.736a30.7 30.7 0 0 0-30.689 30.714v245.716a30.7 30.7 0 0 0 30.689 30.714h30.688a92.062 92.062 0 1 0 184.124 0h127.108C436.381 902.693 484.021 942 541.047 942c67.683 0 122.75-55.115 122.75-122.857v-30.714h61.375v30.715a30.7 30.7 0 0 0 30.689 30.714h187.42a30.715 30.715 0 0 0 0-61.429zM509.221 360l81.31 244.139H488.979L416.516 555.8c-7.679-66.093-55.759-119.73-120.969-132.838V297h126.347a91.935 91.935 0 0 1 87.327 63zM295.547 486.948c26.852 9.276 46.452 29.747 55.721 55.768h-55.721v-55.768z m-92.06 393.624a30.714 30.714 0 1 1 30.688-30.714 30.741 30.741 0 0 1-30.689 30.714z m68.117-92.143c-16.863-18.716-41.016-30.714-68.119-30.714s-51.256 12-68.118 30.714h-23.945V604.143h266.9l84.347 56.27a30.727 30.727 0 0 0 17.021 5.16h122.731v47.8a118.862 118.862 0 0 0-61.374-17.085c-57.025 0-104.665 39.308-118.39 92.143H271.603z m269.443 92.143a61.429 61.429 0 1 1 61.375-61.428 61.464 61.464 0 0 1-61.375 61.428zM663.796 727v-61.429h61.375V727h-61.375z"
              fill="#2c2c2c"
              p-id="1815"
            ></path>
          </svg>
        ),
        data: x
      }))
    )
  // 删除数据
  const deleteData: DeleteDataFn = (menuItem) => {
    if (menuItem.definitionId) {
      return deleteDeviceFunction(menuItem.definitionId)
    } else {
      return deleteDevice(menuItem.label)
    }
  }
  // 创建数据
  const createData: CreateDataFn = ({ deviceName, functionName, behaviour }: FormData) => {
    const name = `${deviceName}.${functionName}.${behaviour ? 'Active' : 'Passive'}`
    return createDeviceFunction([
      {
        name,
        activities: [],
        connections: [],
        persistenceBehavior: 'WorkflowBurst',
        publish: false
      }
    ])
  }
  // 更新数据
  const updateData: UpdateDataFn = async ({ deviceName, functionName, behaviour }: FormData, menuItem) => {
    const name = `${deviceName}.${functionName}.${behaviour ? 'Active' : 'Passive'}`
    const [workflowDefinition] = await fetchDeviceFunction([menuItem.definitionId!])
    const { definitionId, isPublished } = workflowDefinition
    return updateDeviceFunction({
      ...workflowDefinition,
      name,
      workflowDefinitionId: definitionId,
      publish: isPublished
    })
  }
  // 复制或导入
  const batchCreateData = async (menu: IMenuItem[], parentMenu?: IMenuItem) => {
    let definitionIds: string[] = []
    let idNameMap: Record<string, string> = {}
    const type = menu[0].type
    if (type === WorkflowTypeEnum.DEVICE) {
      // 复制或导入设备
      definitionIds = menu.flatMap((menuItem) => menuItem.children?.map((x) => x.definitionId as string) || [])
      idNameMap = Object.fromEntries(
        menu.flatMap((menuItem) => {
          const deviceName = menuItem.label

          return (
            menuItem?.children?.map(({ definitionId, data: { name: functionName, isActive } }) => [
              definitionId,
              `${deviceName}.${functionName}.${isActive ? 'Active' : 'Passive'}`
            ]) || []
          )
        })
      )
    } else {
      // 复制或导入功能
      definitionIds = menu.map((menuItem) => menuItem.definitionId as string)
      idNameMap = Object.fromEntries(
        menu.map(({ definitionId, label: funtionName }) => [
          definitionId,
          `${parentMenu!.label}.${funtionName}.${parentMenu!.data.isActive ? 'Active' : 'Passive'}`
        ])
      )
    }

    const workflowDefinitionList = await fetchDeviceFunction(definitionIds)
    return createDeviceFunction(
      workflowDefinitionList.map(({ definitionId, activities, connections, persistenceBehavior }) => ({
        name: idNameMap[definitionId],
        activities,
        connections,
        persistenceBehavior,
        publish: false
      }))
    )
  }

  // 打开编辑或新增弹窗时, 获取弹窗的初始值, 在WorkflowEngine内部会设置
  const getFormInitialValue: GetFormInitialValueFn = async (menuItem: IMenuItem) => {
    let name
    if (menuItem.definitionId) {
      const [deviceFunction] = await fetchDeviceFunction([menuItem.definitionId!])
      name = deviceFunction.name
    } else {
      name = menuItem.label
    }
    const [deviceName, functionName = '', behaviour = 'Passive'] = name.split('.')

    return {
      deviceName,
      functionName,
      behaviour: behaviour === 'Active' ? true : false
    }
  }

  const workflowEngineRef = useRef<IWorkflowEngineComponentRef>(null)
  // 弹窗属性
  const [dialogProps, setDialogProps] = useState<IDefaultDialogFormProps>(defaultDialogProps)

  const deviceFields: Array<MwDialogFormField> = [
    {
      title: t('editDialog.oldName'),
      key: 'oldName',
      required: true,
      readonly: true
    },
    {
      title: t('editDialog.newName'),
      key: 'newName',
      required: true,
      rules: [
        {
          pattern: /^[^.]*$/,
          message: `${t('addDialog.deviceName') + t('addDialog.cannotContainDecimalPoint')}`
        }
      ]
    }
  ]
  // 编辑的不是工作流数据(没有definitionId),
  const handleNotEditWorkflow: OnNotEditWorkflow = (menuItem) => {
    setDialogProps({
      title: t('edit'),
      mode: 'update',
      initialValues: { oldName: menuItem.label },
      visible: true,
      spinning: false
    })
  }
  const handleSuccess = () => {
    message.success('编辑成功')
    workflowEngineRef.current?.loadData()
  }

  // 调试
  const debug = async (id: string, data: any) => {
    return debugDeviceFunction({
      id,
      extraProperties: data
    })
  }

  return (
    <>
      <WorkflowEngine
        ref={workflowEngineRef}
        title={i18n.t(`title`, { ns: 'device' })}
        type={WorkflowTypeEnum.DEVICE}
        workflowEngineUrl={workflowEngineUrl}
        formFields={fields}
        fetchData={fetchData}
        deleteData={deleteData}
        createData={createData}
        updateData={updateData}
        batchCreateData={batchCreateData}
        getFormInitialValue={getFormInitialValue}
        workflowApi={workflowApi}
        onNotEditWorkflow={handleNotEditWorkflow}
        debug={debug}
      ></WorkflowEngine>
      <MwDialogForm
        formExtend={{
          layout: {
            labelCol: { flex: '160px' }
          }
        }}
        {...dialogProps}
        fields={deviceFields}
        updateApi={updateDevice}
        onClose={() => setDialogProps(defaultDialogProps)}
        onSuccess={handleSuccess}
      />
    </>
  )
}

export default memo(Feature)
