import React, { ElementRef, useRef, useState } from 'react'
import type { FC } from 'react'
import { Badge, List, Switch, Tooltip } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { AnyKeyProps, MwSearchTableField, MwSearchTable, MwButton, MwAction } from 'multiway'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@packages/utils'
import { IMwTableRef } from '@packages/multiway-config'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import { type IListParams, type IWmsItem, useWcsRequest } from '@packages/services'
import WmsSubMission from './WmsSubMission'
import { WMS_MISSION_STATUS_ENUM } from './interface.d'
import './index.less'

const ColorBox = ['green', 'red', 'blue', 'cyan', 'gold', 'red']

const WmsMissionColorStrategy = {
  [WMS_MISSION_STATUS_ENUM.Received]: '#2196F3',
  [WMS_MISSION_STATUS_ENUM.Rejected]: '#e74c3c',
  [WMS_MISSION_STATUS_ENUM.Accepted]: '#2ecc71',
  [WMS_MISSION_STATUS_ENUM.Running]: '#FF9800',
  [WMS_MISSION_STATUS_ENUM.Completed]: '#2ecc71',
  [WMS_MISSION_STATUS_ENUM.Aborted]: '#e74c3c',
  [WMS_MISSION_STATUS_ENUM.Canceled]: '#34495e'
}

const WmsMission: FC = () => {
  const [missionId, setMissionId] = useState<string>('')
  const wmsMissionTableRef = useRef<ElementRef<typeof MwSearchTable> & IMwTableRef<IWmsItem>>(null)
  const { getWmsMissionList, getWmsMissionPage } = useWcsRequest()

  useTableAutoRefresh(wmsMissionTableRef)
  const { t } = useTranslation()
  const fields: Array<MwSearchTableField> = [
    {
      title: t('wmsMission.status'),
      width: 150,
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Badge color={WmsMissionColorStrategy[record.status as WMS_MISSION_STATUS_ENUM]}></Badge>
            <span className="pl-2" style={{ color: WmsMissionColorStrategy[record.status as WMS_MISSION_STATUS_ENUM] }}>
              {record.status}
            </span>
          </>
        )
      }
    },
    {
      title: t('wmsMission.id'),
      key: 'id',
      width: 270,
      ellipsis: true
      // search: true
    },
    {
      title: t('wmsMission.predecessorIds'),
      width: 150,
      key: 'predecessorIds',
      align: 'center',
      render: (values: string[]) => {
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
      },
      // dialog: true,
      type: 'select',
      dialog: {
        showSearch: true,
        mode: 'multiple'
      },
      options: wmsMissionTableRef.current?.getTableData().map((d) => ({ label: d.id, value: d.id }))
    },
    {
      title: t('wmsMission.priority'),
      width: 150,
      key: 'priority',
      align: 'center',
      // search: true,
      render: (_, record) => {
        return <Badge size="small" color={ColorBox[record.priority]} showZero count={record.priority}></Badge>
      },
      sort: true,
      dialog: {
        defaultValue: 1
      },
      type: 'number'
    },
    {
      title: t('wmsMission.from'),
      width: 150,
      key: 'from',
      align: 'center',
      render: (values: string[]) => {
        return values.length > 0 ? (
          <List
            size="small"
            dataSource={values}
            renderItem={(item, index) => (
              <List.Item>
                <Tooltip title={item}>
                  <div className="flex items-center overflow-hidden cursor-pointer">
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
      },
      dialog: true
    },
    {
      title: t('wmsMission.to'),
      width: 150,
      key: 'to',
      align: 'center',
      render: (values: string[]) => {
        return values.length > 0 ? (
          <List
            size="small"
            dataSource={values}
            renderItem={(item, index) => (
              <List.Item>
                <Tooltip title={item}>
                  <div className="flex items-center overflow-hidden cursor-pointer">
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
      },
      dialog: true
    },
    {
      title: t('wmsMission.autoRun'),
      width: 120,
      key: 'autoRun',
      align: 'center',
      render: (_, record) => (
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={record.autoRun} />
      ),
      type: 'custom',
      dialog: {
        renderContent: (_: any, record: any) => (
          <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={record.autoRun} />
        )
      }
    },
    {
      title: t('wmsMission.autoAbort'),
      width: 120,
      key: 'autoAbort',
      align: 'center',
      render: (_, record) => (
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={record.autoAbort} />
      ),
      type: 'custom',
      dialog: {
        renderContent: (_: any, record: any) => (
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={record.autoAbort}
          />
        )
      }
    },
    {
      title: t('wmsMission.creationTime'),
      width: 180,
      key: 'creationTime',
      align: 'center',
      render: (text) => {
        const formatString = formatDate(text as string)
        return <Tooltip title={formatString}>{formatString}</Tooltip>
      },
      ellipsis: true,
      sort: true
    },
    {
      title: t('wmsMission.lastModificationTime'),
      width: 180,
      key: 'lastModificationTime',
      align: 'center',
      render: (text) => {
        const formatString = formatDate(text as string)
        return text ? <Tooltip title={formatString}>{formatString}</Tooltip> : '无'
      },
      ellipsis: true,
      sort: true
    },

    {
      title: t('wmsMission.extraProperties'),
      width: 150,
      key: 'extraProperties',
      align: 'center',
      render: (extraProperties: any) => {
        const keys = Object.keys(extraProperties)
        return keys.length > 0 ? keys.map((label) => <p key={label}>{label}</p>) : '无'
      },
      dialog: true
    }
  ]

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

  const handleExpand = (expanded: boolean, record: AnyKeyProps) => {
    const newMissionId = expanded ? record.id : ''
    setMissionId(newMissionId)
    setTimeout(() => {
      focusToRow(newMissionId)
    })
  }

  const tableExtend = {
    expandable: {
      expandedRowRender: (record: AnyKeyProps) => <WmsSubMission wmsMissionId={record.id}></WmsSubMission>,
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

  const [isDebugging, setIsDebugging] = useState(false)
  isDebugging &&
    fields.push({
      title: '操作',
      width: 150,
      key: 'action',
      render: () => <MwButton type="link">添加子任务</MwButton>
    })

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
        fields={fields}
        api={getWmsMissionList}
        tableExtend={tableExtend}
        pagination={{
          onChange: () => {
            setMissionId('')
          }
        }}
        onLoad={handleLoad}
        dialogFormExtend={{
          fields
        }}
      >
        {isDebugging && <MwAction action="add">添加WMS任务</MwAction>}
      </MwSearchTable>
    </div>
  )
}

export default observer(WmsMission)
