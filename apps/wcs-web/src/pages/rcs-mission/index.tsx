import React, { ElementRef, useRef, useState } from 'react'
import type { FC } from 'react'
import { Badge, Descriptions, List, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { AnyKeyProps, MwSearchTableField, MwSearchTable } from 'multiway'
import { IMwTableRef } from '@/multiway'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@packages/utils'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import { type IRcsItem, type IListParams, useWcsRequest } from '@packages/services'
import RcsSubMission from './RcsSubMission'
import { RCS_MISSION_STATUS_ENUM } from './interface.d'
import './index.less'

const ColorBox = ['green', 'red', 'blue', 'cyan', 'gold', 'red']

const RcsMissionColorStrategy = {
  [RCS_MISSION_STATUS_ENUM.Sent]: '#2196F3',
  [RCS_MISSION_STATUS_ENUM.Rejected]: '#e74c3c',
  [RCS_MISSION_STATUS_ENUM.Accepted]: '#2ecc71',
  [RCS_MISSION_STATUS_ENUM.Running]: '#FF9800',
  [RCS_MISSION_STATUS_ENUM.Completed]: '#2ecc71',
  [RCS_MISSION_STATUS_ENUM.Aborted]: '#e74c3c',
  [RCS_MISSION_STATUS_ENUM.Canceled]: '#34495e'
}

const RcsMission: FC = () => {
  const { getRcsMissionList, getRcsMissionPage } = useWcsRequest()
  const [missionId, setMissionId] = useState<string>('')
  const rcsMissionTableRef = useRef<ElementRef<typeof MwSearchTable> & IMwTableRef<IRcsItem>>(null)

  useTableAutoRefresh(rcsMissionTableRef)
  const { t } = useTranslation()
  const fields: Array<MwSearchTableField> = [
    {
      title: t('rcsMission.status'),
      width: 150,
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Badge color={RcsMissionColorStrategy[record.status as RCS_MISSION_STATUS_ENUM]}></Badge>
            <span className="pl-2" style={{ color: RcsMissionColorStrategy[record.status as RCS_MISSION_STATUS_ENUM] }}>
              {record.status}
            </span>
          </>
        )
      }
    },
    {
      title: t('rcsMission.id'),
      key: 'id',
      width: 270,
      ellipsis: true
      // search: true
    },
    {
      title: t('rcsMission.predecessorIds'),
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
      }
    },
    {
      title: t('rcsMission.priority'),
      width: 150,
      key: 'priority',
      align: 'center',
      // search: true,
      render: (_, record) => {
        return <Badge size="small" color={ColorBox[record.priority]} showZero count={record.priority}></Badge>
      },
      sort: true
    },
    {
      title: t('rcsMission.vehicles'),
      width: 150,
      key: 'vehicles',
      align: 'center',
      render: (_, record) =>
        record.vehicles.length > 0 ? record.vehicles.map((v: any) => <p className="block">{v.tag}</p>) : '无'
    },
    {
      title: t('rcsMission.creationTime'),
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
      title: t('rcsMission.lastModificationTime'),
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
      title: t('rcsMission.extraProperties'),
      width: 150,
      key: 'extraProperties',
      align: 'center',
      render: (extraProperties: any) => {
        const keys = Object.keys(extraProperties)
        return keys.length > 0 ? keys.map((label) => <p key={label}>{label}</p>) : '无'
      }
    }
  ]

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
      // TODO 不在当前页,调接口查数据,跳转至对应页并聚焦
      const params = getApiParams() as IListParams
      const res = await getRcsMissionPage({ ...params, Id: rcsMissionId })
      setPaginitionValue({ current: res, pageSize: params.PageSize })
      // 存储当前点击的mission id, 等到后面数据请求完之后再聚焦展开对应的行
      setPreRcsMissionId(rcsMissionId)
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
      expandedRowRender: (record: AnyKeyProps) => <RcsSubMission rcsSubMissionId={record.id}></RcsSubMission>,
      onExpand: handleExpand,
      expandedRowKeys: [missionId]
    },
    ref: antTableRef
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

  return (
    <div>
      <MwSearchTable
        ref={rcsMissionTableRef}
        rowKey="id"
        fields={fields}
        api={getRcsMissionList}
        tableExtend={tableExtend}
        pagination={{
          onChange: () => {
            setMissionId('')
          }
        }}
        onLoad={handleLoad}
      ></MwSearchTable>
    </div>
  )
}

export default observer(RcsMission)
