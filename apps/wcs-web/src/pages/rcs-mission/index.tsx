import React, { ElementRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Button, Drawer, List, Switch, Tooltip } from 'antd'
import { AnyKeyProps, MwButton, MwSearchTable, MwSearchTableField, MwTableCtrlField } from 'multiway'
import { type IRcsItem, type IListParams, useWcsRequest } from '@packages/services'
import { IMwTableRef } from '@packages/multiway-config'
import JsonEditor from '@packages/ui/components/workflow-engine/components/debug-dialog/JsonEditor'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import RcsSubMission from './RcsSubMission'
import MissionDialog from '@/components/mission-dialog'
import { ColorBox, rcsMissionfields, rcsSubMissionFields } from './fields'
import './index.less'

const getFormFieldsFromTableFields = (tableFields: MwSearchTableField[]) =>
  tableFields.filter((f) => f.dialog).map((f) => (typeof f.dialog === 'object' ? { ...f, ...f.dialog } : f))

const getDetailDrawerFieldsFromTableFields = (tableFields: MwSearchTableField[]) =>
  tableFields.map((f) => ({
    key: f.key,
    title: f.title,
    render: f.render
  }))

const RcsMission: FC = () => {
  const {
    getRcsMissionList,
    getRcsMissionPage,
    createRcsMission,
    updateRcsMission,
    completeRcsMission,
    cancelRcsMission,
    createRcsSubMission,
    updateRcsSubMission,
    cancelRcsSubMission
  } = useWcsRequest()
  const [missionId, setMissionId] = useState<string>('')
  const rcsMissionTableRef = useRef<ElementRef<typeof MwSearchTable> & IMwTableRef<IRcsItem>>(null)

  useTableAutoRefresh(rcsMissionTableRef)

  const { antTableRef, focusToRow } = useTableFocusRow()
  const [preRcsMissionId, setPreRcsMissionId] = useState('')
  const focusToRowExternal = async (rcsMissionId: string) => {
    const { getTableData, getApiParams, setPaginitionValue } = rcsMissionTableRef.current!
    const rcsMissionList = getTableData()
    const findMission = rcsMissionList.find((x) => x.id === rcsMissionId)
    if (findMission) {
      // 在当前页有数据,直接在当前聚焦
      setMissionId(rcsMissionId)
      setTimeout(() => {
        focusToRow(rcsMissionId)
      })
    } else {
      const params = getApiParams() as IListParams
      const res = await getRcsMissionPage({ ...params, Id: rcsMissionId })
      setPaginitionValue({ current: res, pageSize: params.PageSize })
      // 存储当前点击的mission id, 等到后面数据请求完之后再聚焦展开对应的行
      setPreRcsMissionId(rcsMissionId)
    }
  }

  rcsMissionfields.forEach((field) => {
    if (field.key === 'predecessorIds') {
      field.render = (values: string[]) => {
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
      field.options = rcsMissionTableRef.current?.getTableData().map((d) => ({ label: d.id, value: d.id }))
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
        <RcsSubMission
          rcsSubMissionId={record.id}
          isDebugging={isDebugging}
          onUpdate={(subMissionRecord) => {
            setIsSub(true)
            setMode('update')
            setDialogFormFields(getFormFieldsFromTableFields(rcsSubMissionFields))
            setMissionDialogOpen(true)
            Promise.resolve().then(() => setInitialValues(subMissionRecord))
          }}
          onCancel={cancelRcsSubMission}
          onView={(subRecord) => {
            setDetail(subRecord as IRcsItem)
            setDetailDrawerFields(getDetailDrawerFieldsFromTableFields(rcsSubMissionFields))
            setDetailDrawerOpen(true)
          }}
        ></RcsSubMission>
      ),
      onExpand: handleExpand,
      expandedRowKeys: [missionId]
    },
    ref: antTableRef,
    size: 'middle'
  }

  const handleLoad = () => {
    if (!preRcsMissionId) return
    setMissionId(preRcsMissionId)
    setTimeout(() => {
      focusToRow(preRcsMissionId)
      setMissionId(preRcsMissionId)
      setPreRcsMissionId('') // 置空,防止下一次加载数据还会再次聚焦
    })
  }

  let [dialogFormFields, setDialogFormFields] = useState(getFormFieldsFromTableFields(rcsMissionfields))

  const [isDebugging, setIsDebugging] = useState(false)
  const ctrl: MwTableCtrlField = {
    width: 300,
    render: (_, record) => (
      <div className="flex gap-2 ">
        <MwButton
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={() => {
            setIsSub(false)
            setMode('update')
            setDialogFormFields(getFormFieldsFromTableFields(rcsMissionfields))
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
            setDetail(record as IRcsItem)
            setDetailDrawerFields(getDetailDrawerFieldsFromTableFields(rcsMissionfields))
            setDetailDrawerOpen(true)
          }}
        >
          详情
        </MwButton>
        <MwButton
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={() => {
            completeRcsMission(record.id)
          }}
        >
          完成
        </MwButton>
        <MwButton
          danger
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={() => {
            cancelRcsMission(record.id)
          }}
        >
          取消
        </MwButton>
        <MwButton
          className="!px-1 !py-0 !h-[17px] !leading-[17px]"
          type="link"
          onClick={() => {
            setIsSub(true)
            setDialogFormFields(getFormFieldsFromTableFields(rcsSubMissionFields))
            setMissionDialogOpen(true)
          }}
        >
          添加子任务
        </MwButton>
      </div>
    ),
    fixed: 'right'
  }

  useEffect(() => {
    setDialogFormFields(getFormFieldsFromTableFields(rcsMissionfields))
  }, [isDebugging])

  const [missionDialogOpen, setMissionDialogOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [isSub, setIsSub] = useState(false)
  const missionDialogTitle = useMemo(() => (mode === 'create' ? '添加' : '编辑'), [mode])
  const [initialValues, setInitialValues] = useState({})
  const onMissionDialogConfirm = async (data: any) => {
    if (!isSub) {
      if (mode === 'create') {
        await createRcsMission(data)
      } else {
        await updateRcsMission(data)
      }
    } else {
      if (mode === 'create') {
        await createRcsSubMission(data)
      } else {
        await updateRcsSubMission(data)
      }
    }

    setMissionDialogOpen(false)
  }

  // 详情
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [detail, setDetail] = useState<IRcsItem>()
  const [detailDrawerFields, setDetailDrawerFields] = useState(getDetailDrawerFieldsFromTableFields(rcsMissionfields))

  return (
    <div>
      <MwSearchTable
        title={
          <div className="flex items-center py-2">
            调试模式：
            <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={isDebugging} onChange={setIsDebugging} />
          </div>
        }
        ref={rcsMissionTableRef}
        rowKey="id"
        fields={rcsMissionfields}
        api={getRcsMissionList}
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
            size="middle"
            onClick={() => {
              setIsSub(false)
              setMode('create')
              setDialogFormFields(getFormFieldsFromTableFields(rcsMissionfields))
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
          mode={mode}
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

      <Drawer title="任务详情" width={520} open={detailDrawerOpen} onClose={() => setDetailDrawerOpen(false)}>
        {detailDrawerOpen &&
          detailDrawerFields.map((f) => {
            const value = detail?.[f.key as keyof IRcsItem]
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

export default memo(RcsMission)
