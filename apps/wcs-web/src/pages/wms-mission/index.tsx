import React, { ElementRef, useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Button, List, Switch, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { AnyKeyProps, MwSearchTable, MwButton, MwSearchTableField } from 'multiway'
import { IMwTableRef } from '@packages/multiway-config'
import { type IListParams, type IWmsItem, useWcsRequest } from '@packages/services'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import useToggleDebuggingField from '@/hooks/useToggleDebuggingField'
import WmsSubMission from './WmsSubMission'
import MissionDialog from './MissionDialog'
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
    cancelWmsSubMission
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
  wmsMissionfields.forEach((field) => {
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
      field.options = wmsMissionTableRef.current?.getTableData().map((d) => ({ label: d.id, value: d.id }))
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
          onUpdate={(subMissionRecord) => {
            setIsSub(true)
            setMode('update')
            setDialogFormFields(getFormFieldsFromTableFields(wmsSubMissionFields))
            setMissionDialogOpen(true)
            Promise.resolve().then(() => setInitialValues(subMissionRecord))
          }}
          onCancel={cancelWmsSubMission}
        ></WmsSubMission>
      ),
      onExpand: handleExpand,
      expandedRowKeys: [missionId]
    },
    ref: antTableRef
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

  let [dialogFormFields, setDialogFormFields] = useState(getFormFieldsFromTableFields(wmsMissionfields))

  const [isDebugging, setIsDebugging] = useState(false)
  useToggleDebuggingField(wmsMissionfields, isDebugging, (_, record) => (
    <div className="flex gap-2">
      <MwButton
        className="!px-1"
        type="link"
        onClick={() => {
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
        className="!px-1"
        type="link"
        onClick={() => {
          completeWmsMission(record.id)
        }}
      >
        完成
      </MwButton>
      <MwButton
        danger
        className="!px-1"
        type="link"
        onClick={() => {
          cancelWmsMission(record.id)
        }}
      >
        取消
      </MwButton>
      <MwButton
        className="!px-1"
        type="link"
        onClick={() => {
          setIsSub(true)
          setDialogFormFields(getFormFieldsFromTableFields(wmsSubMissionFields))
          setMissionDialogOpen(true)
        }}
      >
        添加子任务
      </MwButton>
    </div>
  ))

  useEffect(() => {
    setDialogFormFields(getFormFieldsFromTableFields(wmsMissionfields))
  }, [isDebugging])

  const [missionDialogOpen, setMissionDialogOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [isSub, setIsSub] = useState(false)
  const missionDialogTitle = useMemo(() => (mode === 'create' ? '添加' : '编辑'), [mode])
  const [initialValues, setInitialValues] = useState({})
  const onMissionDialogConfirm = async (data: any) => {
    if (!isSub) {
      if (mode === 'create') {
        await createWmsMission(data)
      } else {
        await updateWmsMission(data)
      }
    } else {
      if (mode === 'create') {
        await createWmsSubMission(data)
      } else {
        await updateWmsSubMission(data)
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
            onClick={() => {
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

export default observer(WmsMission)
