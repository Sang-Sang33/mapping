import React, { ElementRef, memo, useRef } from 'react'
import type { FC } from 'react'
import { MwSearchTable, MwSearchTableField } from 'multiway'
import { Badge, List, Tooltip } from 'antd'
import { WMS_SUB_MISSION_STATUS_ENUM } from './interface.d'
import { formatDate } from '@packages/utils'
import { IMwTableRef } from '@/multiway'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import { type IWmsItem, useWcsRequest } from '@packages/services'

const WmsSubMissionColorStrategy = {
  [WMS_SUB_MISSION_STATUS_ENUM.Received]: '#2196F3',
  [WMS_SUB_MISSION_STATUS_ENUM.Rejected]: '#e74c3c',
  [WMS_SUB_MISSION_STATUS_ENUM.Accepted]: '#2ecc71',
  [WMS_SUB_MISSION_STATUS_ENUM.Running]: '#FF9800',
  [WMS_SUB_MISSION_STATUS_ENUM.Succeeded]: '#2ecc71',
  [WMS_SUB_MISSION_STATUS_ENUM.Failed]: '#e74c3c',
  [WMS_SUB_MISSION_STATUS_ENUM.Canceled]: '#34495e'
}

const ColorBox = ['green', 'red', 'blue', 'cyan', 'gold', 'red']

const itemHeight = 113
const WmsSubMission: FC<{ wmsMissionId: string }> = (props) => {
  const { wmsMissionId } = props
  const { getWmsSubMissionList } = useWcsRequest()
  const wmsSubMissionTableRef = useRef<ElementRef<typeof MwSearchTable> & IMwTableRef<IWmsItem>>(null)
  useTableAutoRefresh(wmsSubMissionTableRef)
  const fields: Array<MwSearchTableField> = [
    {
      title: '状态',
      width: 150,
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Badge color={WmsSubMissionColorStrategy[record.status as WMS_SUB_MISSION_STATUS_ENUM]}></Badge>
            <span
              className="pl-2"
              style={{ color: WmsSubMissionColorStrategy[record.status as WMS_SUB_MISSION_STATUS_ENUM] }}
            >
              {record.status}
            </span>
          </>
        )
      }
    },
    {
      title: 'ID',
      key: 'id',
      width: 270,
      ellipsis: true
    },
    {
      title: '前置任务',
      width: 250,
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
                  <div className="flex items-center overflow-hidden cursor-pointer" onClick={() => focusToRow(item)}>
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
    },
    {
      title: '优先级',
      width: 150,
      key: 'priority',
      align: 'center',
      render: (_, record) => {
        return <Badge size="small" color={ColorBox[record.priority]} showZero count={record.priority}></Badge>
      }
    },
    {
      title: '到',
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
      }
    },
    {
      title: '动作',
      width: 80,
      key: 'action',
      align: 'center'
    },
    {
      title: '创建时间',
      width: 150,
      key: 'creationTime',
      align: 'center',
      render: (text) => {
        const formatString = formatDate(text as string)
        return <Tooltip title={formatString}>{formatString}</Tooltip>
      },
      ellipsis: true
    },
    {
      title: '更新时间',
      width: 150,
      key: 'lastModificationTime',
      align: 'center',
      render: (text) => {
        const formatString = formatDate(text as string)
        return text ? <Tooltip title={formatString}>{formatString}</Tooltip> : '无'
      },
      ellipsis: true
    },

    {
      title: '额外信息',
      width: 250,
      key: 'extraProperties',
      align: 'center',
      render: (extraProperties: any) => {
        const keys = Object.keys(extraProperties)
        return keys.length > 0 ? keys.map((label) => <p key={label}>{label}</p>) : '无'
      }
    }
  ]

  const { antTableRef, focusToRow } = useTableFocusRow()
  const tableExtend = {
    ref: antTableRef
  }

  return (
    <div className="p-2">
      <MwSearchTable
        ref={wmsSubMissionTableRef}
        compact
        extraVisible={false}
        api={() =>
          getWmsSubMissionList(wmsMissionId).then((res) => {
            const items = res.map((x) => ({ ...x, highlight: false }))
            return {
              items,
              totalCount: res.length
            }
          })
        }
        fields={fields}
        rowKey="id"
        pagination={false}
        tableExtend={tableExtend}
        height={itemHeight * 4}
      />
    </div>
  )
}

export default memo(WmsSubMission)
