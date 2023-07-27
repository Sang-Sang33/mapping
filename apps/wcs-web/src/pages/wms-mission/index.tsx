import React, { ElementRef, memo, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Button, List, Switch, Tooltip, message } from 'antd'
import { debounce } from 'lodash'
import { AnyKeyProps, MwSearchTable, MwButton, MwSearchTableField } from 'multiway'
import { IMwTableRef } from '@packages/multiway-config'
import { type IListParams, type IWmsItem, useWcsRequest } from '@packages/services'
import { generateUUID } from '@packages/utils'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import useToggleDebuggingField from '@/hooks/useToggleDebuggingField'
import MissionDialog from '@/components/mission-dialog'
import WmsSubMission from './WmsSubMission'
import { ColorBox, wmsMissionfields, wmsSubMissionFields } from './fields'
import './index.less'

const getFormFieldsFromTableFields = (tableFields: MwSearchTableField[]) =>
  tableFields.filter((f) => f.dialog).map((f) => (typeof f.dialog === 'object' ? { ...f, ...f.dialog } : f))

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
          '无'
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
              message.success('任务已取消')
            })
          }
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
  useToggleDebuggingField(wmsMissionfields, isDebugging, (_, record) => (
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
      >
        编辑
      </MwButton>
      <MwButton
        className="!px-1 !py-0 !h-[17px] !leading-[17px]"
        type="link"
        onClick={() => {
          completeWmsMission(record.id).then(() => {
            message.success('任务已完成')
          })
        }}
      >
        完成
      </MwButton>
      <MwButton
        danger
        className="!px-1 !py-0 !h-[17px] !leading-[17px]"
        type="link"
        onClick={() => {
          cancelWmsMission(record.id).then(() => {
            message.success('任务已取消')
          })
        }}
      >
        取消
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
        添加子任务
      </MwButton>
    </div>
  ))

  const [missionDialogOpen, setMissionDialogOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [isSub, setIsSub] = useState(false)
  const missionDialogTitle = useMemo(() => (mode === 'create' ? '添加' : '编辑'), [mode])
  const [initialValues, setInitialValues] = useState<Record<string, any>>({})
  const onMissionDialogConfirm = async (data: any) => {
    if (!isSub) {
      if (mode === 'create') {
        await createWmsMission({ missionId: generateUUID(), ...data })
        message.success('创建WMS任务成功')
      } else {
        await updateWmsMission({ missionId: initialValues.id, ...data })
        message.success('编辑WMS任务成功')
      }
    } else {
      if (mode === 'create') {
        await createWmsSubMission({ missionId: parentMissionId, subMissionId: generateUUID(), ...data })
        message.success('创建WMS子任务成功')
      } else {
        await updateWmsSubMission({ missionId: parentMissionId, subMissionId: initialValues.id, ...data })
        message.success('编辑WMS子任务成功')
      }
    }

    setMissionDialogOpen(false)
  }

  return (
    <div>
      <MwSearchTable
        title={
          <div className="flex items-center py-2">
            调试模式：
            <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={isDebugging} onChange={setIsDebugging} />
          </div>
        }
        ref={wmsMissionTableRef}
        rowKey="id"
        fields={wmsMissionfields}
        api={getWmsMissionList}
        tableExtend={tableExtend}
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
            添加
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
          onCancel={() => {
            setInitialValues({})
            setMissionDialogOpen(false)
          }}
        ></MissionDialog>
      )}
    </div>
  )
}

export default memo(WmsMission)
