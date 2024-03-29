import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Breadcrumb, Button, Empty, message, Popconfirm } from 'antd'
import { EditFilled, DeleteFilled, AppstoreAddOutlined, SettingFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { MwDialogForm, MwDialogFormField } from 'multiway'
import { IWorkflowDefinition, MWAxiosRequestConfig } from '@packages/services'
import { downloadJSON, getLocalLibLocale } from '@packages/utils'
import { I18nextPackagesProvider } from '@packages/i18n'

import Aside, { IMenuItem, type IAsideComponentRef } from './components/aside'
import WorkflowIframe from './components/workflow-iframe'
import ImportDialog from './components/import-dialog'
import ActionArea from './components/aside/ActionArea'
import MultiCheckDialog from './components/multi-check-dialog/MultiCheckDialog'
import useCopyAndPaste from './hooks/useCopyAndPaste'
import { IDefaultDialogFormProps, WorkflowTypeEnum, defaultDialogProps, showMessage } from './common'
import { WorkflowConfigContext } from './context'
import DebugDialog from './components/debug-dialog'

import './style.less'

export type TFetch = () => Promise<IMenuItem[]>
export type TDelete = (menuItem: IMenuItem) => Promise<any>
export type TCreate = (data: any) => Promise<any>
export type TUpdate = (data: any, menuItem: IMenuItem) => Promise<any>
export type TBatchCreate = (
  menu: IMenuItem[],
  workflowDefinitions: IWorkflowDefinition[],
  parentMenu?: IMenuItem
) => Promise<any>
export type GetFormInitialValueFn = (menuItem: IMenuItem) => Promise<any>
export type TNotEditWorkflow = (menuItem: IMenuItem) => void
export type TBeforeCopy = (copyContent: IMenuItem[], parentMenu?: IMenuItem) => void
export type TFetchWorkflowDefinitions = (ids: string[]) => Promise<IWorkflowDefinition[]>

interface IProps {
  title: string
  type: WorkflowTypeEnum
  workflowEngineUrl: string
  formFields: MwDialogFormField[]
  editable?: boolean
  onFetch: TFetch // 获取菜单数据
  onDelete: TDelete // 删除工作流
  onCreate: TCreate // 创建工作流
  onUpdate: TUpdate // 更新工作流
  onBatchCreate: TBatchCreate // 批量创建工作流
  getFormInitialValue?: GetFormInitialValueFn // 获取工作流详情
  workflowApi: {
    [key: string]: {
      [key: string]: MWAxiosRequestConfig
    } // workflow api的request config, 用来控制elsa-designer发起请求
  }
  onNotEditWorkflow?: TNotEditWorkflow // 如果不是编辑工作流, 则由外界进行处理
  debuggingHistory?: Record<string, any>
  beforeDialogOpen?: (formFields: MwDialogFormField[]) => Promise<MwDialogFormField[]> // 新增编辑弹窗打开之前(可用于修改formField配置)
  debug?: (workflowDefinitionId: string, data: any) => Promise<any>
  beforeCopy?: TBeforeCopy
  onFetchWorkflowDefinitions: TFetchWorkflowDefinitions
}

export interface IWorkflowEngineComponentRef {
  loadData: () => void
}

type TBatchCreateContent = { menu: IMenuItem[]; workflowDefinitions: IWorkflowDefinition[] }

const WorkflowEngine = forwardRef<IWorkflowEngineComponentRef, IProps>((props, ref) => {
  const {
    title,
    type,
    workflowEngineUrl,
    formFields,
    editable = true,
    onFetch,
    onDelete,
    onCreate,
    onUpdate,
    onBatchCreate,
    getFormInitialValue = (menuItem) =>
      Object.fromEntries(formFields.map((x) => [x.key, menuItem.data?.[x.key as keyof IMenuItem]])),
    workflowApi,
    onNotEditWorkflow,
    debuggingHistory,
    beforeDialogOpen,
    debug,
    beforeCopy,
    onFetchWorkflowDefinitions
  } = props
  useImperativeHandle(ref, () => ({
    loadData
  }))
  const [selectedWorkflowDefinitionId, setSelectedWorkflowDefinitionId] = useState<string>()
  const [menu, setMenu] = useState<IMenuItem[]>([])
  const asideRef = useRef<IAsideComponentRef>(null)
  const [selectedMenuItem, setSelectedMenuItem] = useState<IMenuItem>()
  const selectedChildMenuItem = useMemo(
    () => selectedMenuItem?.children?.find((x) => x.definitionId === selectedWorkflowDefinitionId),
    [selectedMenuItem, selectedWorkflowDefinitionId]
  )
  const { t } = useTranslation('workflowEngine')

  const loadData = async () => {
    const newMenu = await onFetch()
    setMenu(newMenu)
    setSelectedMenuItem((oldSelectedMenuItem) => {
      // 如果重新加载数据找不到需要选中的menuItem, 需要清空selectedWorkflowDefinitionId, 防止仍在显示之前的workflow
      const selectedMenuItem = newMenu.find((x) => x.field === oldSelectedMenuItem?.field)
      !selectedMenuItem && setSelectedWorkflowDefinitionId(undefined)
      return selectedMenuItem
    })
  }
  useEffect(() => {
    loadData()
  }, [])

  const handleSelectChange = useCallback(
    async (menuItem: IMenuItem, menuPath: IMenuItem[]) => {
      if (menuItem.definitionId) {
        setSelectedWorkflowDefinitionId(menuItem.definitionId)
      } else {
        setSelectedWorkflowDefinitionId('')
      }
      // 暂时只有两级菜单,后续可增加level字段菜单支持多级菜单
      setSelectedMenuItem(menuPath.length === 1 ? menuItem : menuPath[0])
    },
    [menu]
  )

  const handleScrollToBottom = () => {
    console.log('load more')
  }

  const handleDelete = async (menuItem: IMenuItem) => {
    try {
      await onDelete(menuItem)
      showMessage('delete_success')()
      setSelectedWorkflowDefinitionId(undefined)
      setIsOpenPopConfirm(false)
      // 重新获取数据
      await loadData()
    } catch (err: any) {
      message.error(err.message)
    }
  }

  const [dialogProps, setDialogProps] = useState<IDefaultDialogFormProps>(defaultDialogProps)
  const [editingMenuItem, setEditingMenuItem] = useState<IMenuItem>()
  /** 新增 */
  const handleAdd = async (isHeaderAdd = false) => {
    let initialValues: Record<string, any> = {}
    let newFormFields
    // selectedMenuItem.children.length大于0 说明选择的是父级菜单 添加时需要设置默认值(只有在点击头部的点击按钮时)
    if (selectedMenuItem?.children?.length && isHeaderAdd) {
      initialValues = await getFormInitialValue(selectedMenuItem)
      // 找到对应field并设置只读
      const originFormFields = formFields
      newFormFields = originFormFields.map((f) => ({ ...f, readonly: Boolean(initialValues[f.key!]) }))
    }

    newFormFields = await beforeDialogOpen?.(newFormFields || formFields)

    setDialogProps({
      title: `${t('action.add')} ${title}`,
      mode: 'add',
      initialValues,
      visible: true,
      spinning: false,
      fields: newFormFields || formFields
    })
  }
  /** 编辑 */
  const handleEdit = async (menuItem: IMenuItem) => {
    if (!menuItem.definitionId) {
      // 编辑的不是工作流, 由外层组件处理弹窗
      onNotEditWorkflow?.(menuItem)
      return
    }
    setEditingMenuItem(menuItem)
    const initialValues = await getFormInitialValue(menuItem)

    setDialogProps({
      title: `${t('action.edit')} ${title}`,
      mode: 'update',
      initialValues,
      visible: true,
      spinning: false
    })
  }

  const handleSuccess = async () => {
    const { mode } = dialogProps
    mode === 'add' ? showMessage('add_success')() : showMessage('update_success')()
    // success(`${mode === 'add' ? '添message.加' : '编辑'}成功`)
    loadData()
  }

  /** 调试 */
  const [debugDialogVisible, setDebugDialogVisible] = useState(false)
  const handleDebug = () => {
    setDebugDialogVisible(true)
  }

  /** 复制 */
  const { copy, paste } = useCopyAndPaste<TBatchCreateContent>()
  const handleCopy = async (menuItem: IMenuItem) => {
    beforeCopy?.([menuItem], selectedMenuItem)
    const definitionIds =
      menuItem.type === WorkflowTypeEnum.DEVICE
        ? menuItem.children?.map((x) => x.definitionId as string) || []
        : [menuItem.definitionId as string]
    copy({ menu: [menuItem], workflowDefinitions: await onFetchWorkflowDefinitions(definitionIds) })
    // message.success(`已复制"${menuItem.label}"`)
    showMessage('copy_success')(menuItem.label)
  }

  /** 粘贴 */
  // 检查当前设备\功能\事件名称是否已经重复, 并返回去重化的名称
  const checkLabelDulplicate = (menu: IMenuItem[], label: string) => {
    let suffix = 1
    const regex = /\(\d+\)$/
    while (menu.some((x) => x.label === label)) {
      if (regex.test(label)) {
        label = label.replace(regex, `(${suffix})`)
      } else {
        label = label + `(${suffix})`
      }
      suffix++
    }

    return label
  }
  // 批量处理名称是否重复 返回处理后的数据
  const batchCheckDulplicate = (newData: IMenuItem[], to: IMenuItem[]) => {
    const result = [...newData]
    result.forEach((item) => {
      const label = checkLabelDulplicate(to, item.label)
      item.data.name = label
      if (item.field === item.label) item.field = label
      item.label = label
      to = [...to, item]
    })

    return result
  }
  const handlePaste = async (pasteToType: WorkflowTypeEnum = type, pastedTo: IMenuItem[] = menu) => {
    const { menu, workflowDefinitions } = paste()
    if (!menu || !menu.length) {
      // message.warn('请先复制数据')
      showMessage('paste_null')()
      return false
    }
    const menuType = menu[0].type
    if (menuType !== pasteToType) {
      // 类型不同不能粘贴
      // message.error(`"${i18n.t(menuType + '.title')}"不能粘贴到"${i18n.t(pasteToType + '.title')}"`)
      showMessage('paste_invalid')(menuType, pasteToType)
      return
    }

    const result = batchCheckDulplicate(menu, pastedTo)
    await onBatchCreate(result, workflowDefinitions, selectedMenuItem)
    await loadData()
    showMessage('paste_success')()
  }

  /** 导入 */
  const [importDialogVisible, setImportDialogVisible] = useState(false)
  const [importTo, setImportTo] = useState<IMenuItem[]>([])
  const handleImport = (to: IMenuItem[]) => {
    setImportDialogVisible(true)
    setImportTo(to)
  }
  const handleUpload = async (data: TBatchCreateContent) => {
    const { menu, workflowDefinitions } = data
    const importDataType = menu[0].type
    const importToType = importTo[0].type
    if (importDataType !== importToType) {
      // 类型不同不能导入
      // message.error(`"${i18n.t(importDataType + '.title')}"不能导入到"${i18n.t(importToType + '.title')}"`)
      showMessage('import_invalid')(importDataType, importToType)
      return
    }

    const result = batchCheckDulplicate(menu, importTo)
    setImportDialogVisible(false)
    await onBatchCreate(result, workflowDefinitions, selectedMenuItem)
    await loadData()
    showMessage('import_success')()
  }

  /** 导出 */
  const handleExport = async (menu: IMenuItem[], fileName = `${title}数据`) => {
    const definitionIds =
      menu[0].type === WorkflowTypeEnum.DEVICE
        ? menu.flatMap((menuItem) => menuItem.children?.map((x) => x.definitionId as string) || [])
        : menu.map((menuItem) => menuItem.definitionId as string)
    downloadJSON(
      {
        menu,
        workflowDefinitions: await onFetchWorkflowDefinitions(definitionIds)
      },
      fileName
    )
  }

  /** 复制多个 */
  const handleCopyMultiple = async (menu: IMenuItem[]) => {
    beforeCopy?.(menu, selectedMenuItem)
    const definitionIds =
      menu[0].type === WorkflowTypeEnum.DEVICE
        ? menu.flatMap((menuItem) => menuItem.children?.map((x) => x.definitionId as string) || [])
        : menu.map((menuItem) => menuItem.definitionId as string)
    copy({
      menu,
      workflowDefinitions: await onFetchWorkflowDefinitions(definitionIds)
    })
    const content = menu
      .slice(0, 3)
      .map((x) => x.label)
      .join('、')
    const suffix = menu.length > 3 ? '等' : ''
    // message.success(`已复制"${content}${suffix}"`)
    showMessage('copy_success')(content + suffix)
  }

  const [isOpenPopConfirm, setIsOpenPopConfirm] = useState(false)
  const handleConfirmCancel = () => {
    setIsOpenPopConfirm(false)
    // message.warn('取消')
    showMessage('delete_cancel')()
  }

  const [copyDialogOpen, setCopyDialogOpen] = useState(false)
  const handleCopyOk = (data: IMenuItem[]) => {
    setCopyDialogOpen(false)
    handleCopyMultiple(data)
  }
  const renderCopyDialog = () => {
    return (
      selectedMenuItem?.children && (
        <MultiCheckDialog
          title={t('action.copyDialogTitle')}
          open={copyDialogOpen}
          data={selectedMenuItem?.children}
          onOk={handleCopyOk}
          onCancel={() => setCopyDialogOpen(false)}
        ></MultiCheckDialog>
      )
    )
  }
  const [exportDialogOpen, seExportDialogOpen] = useState(false)
  const handleExportOk = (data: IMenuItem[]) => {
    seExportDialogOpen(false)
    handleExport(data, t(`${data[0].type}.title`) + '数据')
  }
  const renderExportDialog = () => {
    return (
      selectedMenuItem?.children && (
        <MultiCheckDialog
          title={t('action.exportDialogTitle')}
          open={exportDialogOpen}
          data={selectedMenuItem?.children}
          onOk={handleExportOk}
          onCancel={() => seExportDialogOpen(false)}
        ></MultiCheckDialog>
      )
    )
  }
  const renderHeaderActionArea = () => {
    return (
      <ActionArea
        onCopyMulitiple={() => setCopyDialogOpen(true)}
        onPaste={() => handlePaste(selectedMenuItem?.children?.[0].type, selectedMenuItem?.children!)}
        onImport={() => handleImport(selectedMenuItem?.children!)}
        onExport={() => seExportDialogOpen(true)}
      ></ActionArea>
    )
  }
  const renderHeader = () => {
    if (!selectedMenuItem) return
    const { label, icon } = selectedMenuItem

    return (
      <header className="flex justify-between py-4 px-6 border-b-2 border-solid border-gray-200">
        <Breadcrumb>
          <Breadcrumb.Item>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex scale-110 origin-left">{icon}</span>
              <span>{label}</span>
            </div>
          </Breadcrumb.Item>
          {selectedMenuItem.children?.length && (
            <Breadcrumb.Item className="flex items-center">
              <div className="inline-flex items-center gap-2">
                {selectedMenuItem.children[0].icon}
                {selectedChildMenuItem?.label}
              </div>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
        <div className="flex gap-2">
          {selectedMenuItem?.children?.length && renderHeaderActionArea()}

          {selectedWorkflowDefinitionId && (
            <Button
              shape="round"
              icon={<SettingFilled className="align-middle" />}
              type="default"
              ghost
              onClick={handleDebug}
              style={{ color: '#7f8c8d', borderColor: '#7f8c8d' }}
            >
              {t('action.debug')}
            </Button>
          )}
          <Button
            shape="round"
            icon={<AppstoreAddOutlined className="align-middle" />}
            type="primary"
            ghost
            onClick={() => handleAdd(true)}
          >
            {t('action.add')}
          </Button>
          {selectedWorkflowDefinitionId && editable && (
            <Button
              shape="round"
              icon={<EditFilled className="align-middle" />}
              type="default"
              onClick={() => handleEdit(selectedChildMenuItem || selectedMenuItem)}
            >
              {t('action.edit')}
            </Button>
          )}

          {selectedWorkflowDefinitionId && (
            <Popconfirm
              placement={'right'}
              title={`${t('action.deletePopConfirmTitle')}"${selectedChildMenuItem?.label || label}"`}
              onConfirm={() => handleDelete(selectedChildMenuItem || selectedMenuItem)}
              onCancel={handleConfirmCancel}
              open={isOpenPopConfirm}
            >
              <Button
                shape="round"
                icon={<DeleteFilled className="align-middle" />}
                type="default"
                ghost
                danger
                onClick={() => setIsOpenPopConfirm(true)}
              >
                {t('action.delete')}
              </Button>
            </Popconfirm>
          )}
        </div>
        {renderCopyDialog()}
        {renderExportDialog()}
      </header>
    )
  }

  const renderEmpty = () => (
    <div className="flex flex-col justify-center items-center m-auto w-full h-full bg-[#fbfbfb]">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      {menu.length === 0 ? (
        <Button type="primary" onClick={() => handleAdd()}>
          {t('empty.goToCreate')}
          {title}
        </Button>
      ) : (
        <Button type="link">{t('empty.chooseWorkflow')}</Button>
      )}
    </div>
  )

  const renderWorkflowIframe = () => {
    if (menu.length && selectedWorkflowDefinitionId)
      return (
        <WorkflowIframe workflowDefinitionId={selectedWorkflowDefinitionId} workflowApi={workflowApi}></WorkflowIframe>
      )
    else return renderEmpty()
  }

  const [canInteract, setCanInteract] = useState(true)

  return (
    <div className="w-full h-full flex rounded-md overflow-hidden bg-[#fbfbfb]">
      <WorkflowConfigContext.Provider
        value={{
          locale: getLocalLibLocale('workflowEngine') as string,
          canInteract,
          setCanInteract,
          menuListDesignHeight: 886,
          menuItemHeight: 50,
          workflowEngineUrl,
          editable
        }}
      >
        <Aside
          ref={asideRef}
          title={title}
          menu={menu}
          onSelectChange={handleSelectChange}
          onScrollToBottom={handleScrollToBottom}
          onDelete={handleDelete}
          onCreate={handleAdd}
          onEdit={handleEdit}
          onCopy={handleCopy}
          onPaste={() => handlePaste()}
          onImport={handleImport}
          onExport={handleExport}
          onCopyMulitiple={handleCopyMultiple}
        ></Aside>
        <section className="flex-1 flex flex-col">
          {renderHeader()}
          {renderWorkflowIframe()}
        </section>
        <MwDialogForm
          fields={formFields}
          {...dialogProps}
          onClose={() => setDialogProps(defaultDialogProps)}
          onSuccess={handleSuccess}
          addApi={onCreate}
          updateApi={(params) => onUpdate(params, editingMenuItem!)}
        />
        <ImportDialog
          visible={importDialogVisible}
          onUpload={(data) => handleUpload(data)}
          onCancel={() => setImportDialogVisible(false)}
        ></ImportDialog>
        {debugDialogVisible && (
          <DebugDialog
            visible={debugDialogVisible}
            debuggingDefaultValue={
              (selectedWorkflowDefinitionId && debuggingHistory?.[selectedWorkflowDefinitionId]) ?? {}
            }
            onCancel={() => setDebugDialogVisible(false)}
            onConfirm={async (data) => {
              if (!selectedWorkflowDefinitionId) return
              await debug?.(selectedWorkflowDefinitionId, data)
              setDebugDialogVisible(false)
            }}
          ></DebugDialog>
        )}
      </WorkflowConfigContext.Provider>
    </div>
  )
})

const I18nWorkflowEngine = forwardRef<IWorkflowEngineComponentRef, IProps>((props: IProps, ref) => (
  <I18nextPackagesProvider>
    <WorkflowEngine {...props} ref={ref} />
  </I18nextPackagesProvider>
))

export default memo(I18nWorkflowEngine)
