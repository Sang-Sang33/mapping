import React, { ElementRef, memo, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Button, Drawer, List, Switch, Tooltip, message } from 'antd'
import { debounce } from 'lodash'
import { AnyKeyProps, MwSearchTable, MwButton, MwSearchTableField, MwTableCtrlField } from 'multiway'
import { IMwTableRef } from '@packages/multiway-config'
import { type IListParams, type IWmsItem, useWcsRequest } from '@packages/services'
import { generateUUID } from '@packages/utils'
import JsonEditor from '@packages/ui/components/workflow-engine/components/debug-dialog/JsonEditor'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import MissionDialog from '@/components/mission-dialog'
import i18n from '@/i18n'
import WmsSubMission from './WmsSubMission'
import { ColorBox, wmsMissionfields, wmsSubMissionFields } from './fields'
import './index.less'

const t = (key: string) => i18n.t(key)

const getFormFieldsFromTableFields = (tableFields: MwSearchTableField[]) =>
  tableFields
    .filter((f) => f.dialog)
    .map((f) => (typeof f.dialog === 'object' ? { ...f, ...f.dialog, hidden: false } : f))

const getDetailDrawerFieldsFromTableFields = (tableFields: MwSearchTableField[]) =>
  tableFields.map((f) => ({
    key: f.key,
    title: f.title,
    render: f.render
  }))

const WmsMission: FC = () => {
  const [missionId, setMissionId] = useState<string>('')
  const wmsMissionTableRef = useRef<ElementRef<typeof MwSearchTable> & IMwTableRef<IWmsItem>>(null)
  const {
    getWmsMissionList,
    getWmsMissionPage,
    createWmsMission,
    updateWmsMission,
    completeWmsMission,
    cancelWmsMission,
    createWmsSubMission,
    updateWmsSubMission,
    cancelWmsSubMission,
    fetchWmsMissionAvailablePredecessors,
    fetchSlot
  } = useWcsRequest()
  useTableAutoRefresh(wmsMissionTableRef)
  const { antTableRef, focusToRow } = useTableFocusRow()
  const [preWmsMissionId, setPreWmsMissionId] = useState('')
  const focusToRowExternal = async (wmsMissionId: string) => {
    const { getTableData, getApiParams, setPaginitionValue } = wmsMissionTableRef.current!
    const wmsMissionList = getTableData()
    const findMission = wmsMissionList.find((x) => x.id === wmsMissionId)
    if (findMission) {
      // 在当前页有数据,直接在当前聚焦
      setMissionId(wmsMissionId)
      setTimeout(() => {
        focusToRow(wmsMissionId)
      })
    } else {
      const params = getApiParams() as IListParams
      const res = await getWmsMissionPage({ ...params, Id: wmsMissionId })
      setPaginitionValue({ current: res, pageSize: params.PageSize })
      // 存储当前点击的mission id, 等到后面数据请求完之后再聚焦展开对应的行
      setPreWmsMissionId(wmsMissionId)
    }
  }

  // 更新表单项的options
  const updateDialogFormFieldOptions = (
    fieldKey: MwSearchTableField['key'],
    options: MwSearchTableField['options']
  ) => {
    setDialogFormFields((fields) => {
      const newDialogFormFields = [...fields]
      const targetFields = newDialogFormFields.find((f) => f.key === fieldKey)
      if (targetFields) targetFields.options = options
      return newDialogFormFields
    })
  }
  // 初始化from或to的field配置, 实现库位点列表防抖搜索
  const initFromOrToField = (field: MwSearchTableField) => {
    const dialog = field.dialog as any
    const updateSlotOptions = async (searchItem = '') => {
      const slot = await fetchSlot(searchItem)
      const options = slot.map((s) => ({ label: s, value: s }))
      updateDialogFormFieldOptions(field.key, options)
    }
    dialog.onSearch = debounce(updateSlotOptions, 200)
    dialog.onFocus = debounce(() => updateSlotOptions(), 200)
  }
  // 初始化前置任务的field配置, 实现聚焦获取列表
  const initPredecessorIds = (field: MwSearchTableField) => {
    const dialog = field.dialog as any
    const updatePrecessorsOptions = async () => {
      const predecessors = await fetchWmsMissionAvailablePredecessors()
      const options = predecessors.map((s) => ({ label: s, value: s }))
      updateDialogFormFieldOptions(field.key, options)
    }
    dialog.onFocus = debounce(() => updatePrecessorsOptions(), 200)
  }

  // field 处理
  wmsMissionfields.forEach(async (field) => {
    if (field.key === 'predecessorIds') {
      field.render ??= (values: string[]) => {
        return values.length > 0 ? (
          <List
            size="small"
            dataSource={values}
            renderItem={(item, index) => (
              <List.Item>
                <Tooltip title={item}>
                  <div
                    className="flex items-center overflow-hidden cursor-pointer"
                    onClick={() => focusToRowExternal(item)}
                  >
                    <div
                      className={`w-2 h-[12px] `}
                      style={{ backgroundColor: ColorBox[index % ColorBox.length] }}
                      color={ColorBox[index % ColorBox.length]}
                    ></div>
                    <span className="ml-2 overflow-hidden whitespace-nowrap text-ellipsis">{item}</span>
                  </div>
                </Tooltip>
              </List.Item>
            )}
          />
        ) : (
          t('empty')
        )
      }
      initPredecessorIds(field)
    } else if (field.key === 'from' || field.key === 'to') {
      initFromOrToField(field)
    }
  })
  wmsSubMissionFields.forEach((field) => {
    if (field.key === 'predecessorIds') {
      initPredecessorIds(field)
    } else if (field.key === 'to') {
      initFromOrToField(field)
    }
  })

  const handleExpand = (expanded: boolean, record: AnyKeyProps) => {
    const newMissionId = expanded ? record.id : ''
    setMissionId(newMissionId)
    setTimeout(() => {
      focusToRow(newMissionId)
    })
  }

  const tableExtend = {
    expandable: {
      expandedRowRender: (record: AnyKeyProps) => (
        <WmsSubMission
          wmsMissionId={record.id}
          isDebugging={isDebugging}
          onUpdate={async (subMissionRecord) => {
            setIsSub(true)
            setMode('update')
            setDialogFormFields(getFormFieldsFromTableFields(wmsSubMissionFields))
            setParentMissionId(record.id)
            setMissionDialogOpen(true)
            Promise.resolve().then(() => setInitialValues(subMissionRecord))
          }}
          onCancel={(subMissionId) =>
            cancelWmsSubMission({
              subMissionId,
              missionId: record.id
            }).then(() => {
              message.success(t('wmsMission.cancelMissionSuccess'))
            })
          }
          onView={(subRecord) => {
            setDetail(subRecord as IWmsItem)
            setDetailDrawerFields(getDetailDrawerFieldsFromTableFields(wmsSubMissionFields))
            setDetailDrawerOpen(true)
          }}
        ></WmsSubMission>
      ),
      onExpand: handleExpand,
      expandedRowKeys: [missionId]
    },
    ref: antTableRef,
    size: 'middle'
  }

  const handleLoad = () => {
    if (!preWmsMissionId) return
    setMissionId(preWmsMissionId)
    setTimeout(() => {
      focusToRow(preWmsMissionId)
      setMissionId(preWmsMissionId)
      setPreWmsMissionId('') // 置空,防止下一次加载数据还会再次聚焦
    })
  }

  const [dialogFormFields, setDialogFormFields] = useState(getFormFieldsFromTableFields(wmsMissionfields))

  const [parentMissionId, setParentMissionId] = useState('')

  const [isDebugging, setIsDebugging] = useState(false)
  const ctrl: MwTableCtrlField = {
    width: 360,
    title: t('wmsMission.action'),
    render: (_, record) => (
      <div className="flex gap-2">
        <MwButton
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={async () => {
            setIsSub(false)
            setMode('update')
            setDialogFormFields(getFormFieldsFromTableFields(wmsMissionfields))
            setMissionDialogOpen(true)
            Promise.resolve().then(() => setInitialValues(record))
          }}
          disabled={!record.isUpdatable}
        >
          {t('wmsMission.edit')}
        </MwButton>
        <MwButton
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={() => {
            setDetail(record as IWmsItem)
            setDetailDrawerFields(getDetailDrawerFieldsFromTableFields(wmsMissionfields))
            setDetailDrawerOpen(true)
          }}
        >
          {t('wmsMission.detail')}
        </MwButton>
        <MwButton
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={() => {
            completeWmsMission(record.id).then(() => {
              message.success(t('wmsMission.completeMissionSuccess'))
            })
          }}
          disabled={!record.isCompletable}
        >
          {t('wmsMission.complete')}
        </MwButton>
        <MwButton
          danger
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={() => {
            cancelWmsMission(record.id).then(() => {
              message.success(t('wmsMission.cancelMissionSuccess'))
            })
          }}
          disabled={!record.isCancelable}
        >
          {t('wmsMission.cancel')}
        </MwButton>
        <MwButton
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={async () => {
            setIsSub(true)
            setMode('create')
            setDialogFormFields(getFormFieldsFromTableFields(wmsSubMissionFields))
            setParentMissionId(record.id)
            setMissionDialogOpen(true)
          }}
        >
          {t('wmsMission.createSubMission')}
        </MwButton>
      </div>
    ),
    fixed: 'right'
  }

  const [missionDialogOpen, setMissionDialogOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [isSub, setIsSub] = useState(false)
  const missionDialogTitle = useMemo(() => (mode === 'create' ? t('wmsMission.create') : t('wmsMission.edit')), [mode])
  const [initialValues, setInitialValues] = useState<Record<string, any>>({})
  const onMissionDialogConfirm = async (data: any) => {
    if (!isSub) {
      if (mode === 'create') {
        await createWmsMission({ missionId: generateUUID(), ...data })
        message.success(t('wmsMission.createMissionSuccess'))
      } else {
        await updateWmsMission({ missionId: initialValues.id, ...data })
        message.success(t('wmsMission.editMissionSuccess'))
      }
    } else {
      if (mode === 'create') {
        await createWmsSubMission({ missionId: parentMissionId, subMissionId: generateUUID(), ...data })
        message.success(t('wmsMission.createSubMissionSuccess'))
      } else {
        await updateWmsSubMission({ missionId: parentMissionId, subMissionId: initialValues.id, ...data })
        message.success(t('wmsMission.editSubMissionSuccess'))
      }
    }

    setMissionDialogOpen(false)
    wmsMissionTableRef.current?.refresh()
  }

  // 详情
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [detail, setDetail] = useState<IWmsItem>()
  const [detailDrawerFields, setDetailDrawerFields] = useState(getDetailDrawerFieldsFromTableFields(wmsMissionfields))

  return (
    <div>
      <MwSearchTable
        title={
          <div className="flex items-center py-2">
            {t('wmsMission.debugMode')}：
            <Switch
              checkedChildren={t('wmsMission.open')}
              unCheckedChildren={t('wmsMission.close')}
              checked={isDebugging}
              onChange={setIsDebugging}
            />
          </div>
        }
        ref={wmsMissionTableRef}
        rowKey="id"
        fields={wmsMissionfields}
        api={getWmsMissionList}
        tableExtend={tableExtend}
        ctrl={isDebugging ? ctrl : undefined}
        pagination={{
          onChange: () => {
            setMissionId('')
          }
        }}
        onLoad={handleLoad}
      >
        {isDebugging && (
          <Button
            type="primary"
            onClick={async () => {
              setIsSub(false)
              setMode('create')
              setDialogFormFields(getFormFieldsFromTableFields(wmsMissionfields))
              setMissionDialogOpen(true)
            }}
          >
            {t('wmsMission.create')}
          </Button>
        )}
      </MwSearchTable>

      {missionDialogOpen && (
        <MissionDialog
          open={missionDialogOpen}
          title={missionDialogTitle}
          fields={dialogFormFields}
          initialValues={initialValues}
          onConfirm={onMissionDialogConfirm}
          configurationMode={mode === 'create' ? 'KeyValuePairs' : 'None'}
          onCancel={() => {
            setInitialValues({})
            setMissionDialogOpen(false)
          }}
        ></MissionDialog>
      )}

      <Drawer
        title={t('wmsMission.detail')}
        width={520}
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
      >
        {detailDrawerOpen &&
          detailDrawerFields.map((f) => {
            const value = detail?.[f.key as keyof IWmsItem]
            if (f.key === 'extraProperties') {
              f.render = (value) => {
                return (
                  <JsonEditor
                    defaultHeight={'300px'}
                    value={value as Record<string, any>}
                    options={{ readOnly: true }}
                  ></JsonEditor>
                )
              }
            }
            return (
              <div className="flex items-center my-2 pt-1 text-sm min-h-[42px]" key={f.key}>
                <span className="w-[100px]">{f.title}：</span>
                <div className="flex-1">{f.render ? f.render(value, detail ?? {}, 0) : <span>{value}</span>}</div>
              </div>
            )
          })}
      </Drawer>
    </div>
  )
}

export default memo(WmsMission)
