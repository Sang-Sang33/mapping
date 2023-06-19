import React, { memo, useRef, useState } from 'react'
import type { FC } from 'react'
import { message } from 'antd'
import { MwDialogForm, MwDialogFormField } from 'multiway'
import WorkflowEngine, {
  CreateDataFn,
  DeleteDataFn,
  FetchDataFn,
  GetFormInitialValueFn,
  IWorkflowEngineComponentRef,
  OnNotEditWorkflow,
  UpdateDataFn
} from '@/components/workflow-engine'
import { useWcsRequest } from '@packages/services'
import { IDefaultDialogFormProps, WorkflowTypeEnum, defaultDialogProps } from '@/components/workflow-engine/common'
import { IMenuItem } from '@/components/workflow-engine/components/aside'
import { IconFont } from '@/components/Icon'
import { useTranslation } from 'react-i18next'
import workflowApi from './config/workflowApi'
import fields from './config/formFields'

interface FormData {
  deviceName: string
  functionName: string
  behaviour: string
}

const Feature: FC = () => {
  const { t } = useTranslation()
  const {
    fetchDevice,
    deleteDeviceFunction,
    createDeviceFunction,
    deleteDevice,
    updateDeviceFunction,
    updateDevice,
    fetchDeviceFunction
  } = useWcsRequest()
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
          icon: <IconFont type="icon-shebeigongnengguanli-black" />
        })),
        type: WorkflowTypeEnum.DEVICE,
        parentData: null,
        icon: <IconFont type="icon-device-black" />,
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
      title: t('device.editDialog.oldName'),
      key: 'oldName',
      required: true,
      readonly: true
    },
    {
      title: t('device.editDialog.oldName'),
      key: 'newName',
      required: true,
      rules: [
        {
          pattern: /^[^.]*$/,
          message: `${t('device.addDialog.deviceName') + t('device.addDialog.cannotContainDecimalPoint')}`
        }
      ]
    }
  ]
  // 编辑的不是工作流数据(没有definitionId),
  const handleNotEditWorkflow: OnNotEditWorkflow = (menuItem) => {
    setDialogProps({
      title: t('device.edit'),
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

  return (
    <>
      <WorkflowEngine
        ref={workflowEngineRef}
        title={t(`device.title`)}
        type={WorkflowTypeEnum.DEVICE}
        formFields={fields}
        fetchData={fetchData}
        deleteData={deleteData}
        createData={createData}
        updateData={updateData}
        batchCreateData={batchCreateData}
        getFormInitialValue={getFormInitialValue}
        workflowApi={workflowApi}
        onNotEditWorkflow={handleNotEditWorkflow}
      ></WorkflowEngine>
      <MwDialogForm
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
