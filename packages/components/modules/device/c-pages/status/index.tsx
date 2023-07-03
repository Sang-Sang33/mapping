import React, { memo, useRef, useState } from 'react'
import type { ElementRef, FC } from 'react'
import { MwSearchTable, type MwSearchTableField } from 'multiway'
import { Badge } from 'antd'
import { useTableAutoRefresh } from '@packages/hooks'
import { type TDeviceStatusLevel, useWcsRequest } from '@packages/services'
import { formatDate } from '@packages/utils'
import './index.less'

interface IStatusProps {
  baseUrl?: string
  setDefaultDataFilter?: (data: { items: any[]; totalCount: number }) => Record<string, any>
}

const fields: Array<MwSearchTableField> = [
  {
    title: '设备',
    key: 'name',
    width: 120
  },
  {
    title: '连接状态',
    key: 'connection',
    align: 'center',
    render: (_, record) => (
      <>
        <Badge color={colorMap[record.connection.level as TDeviceStatusLevel]} />
        <span className="pl-2" style={{ color: colorMap[record.connection.level as TDeviceStatusLevel] }}>
          {record.connection.value}
        </span>
      </>
    )
  },
  {
    title: '更新时间',
    key: 'update_time',
    align: 'center',
    render: (_, record) => <span>{formatDate(record.update_time.value)}</span>
  }
]

const rowKey = 'name'
const colorMap: Record<TDeviceStatusLevel, string> = {
  Normal: '#2ecc71',
  Abnormal: '#FF9800',
  Fault: '#e74c3c',
  Unknown: '#34495e'
}
const Status: FC<IStatusProps> = (props) => {
  const { baseUrl, setDefaultDataFilter } = props
  const { fetchDeviceStatus } = useWcsRequest(baseUrl)
  const tableRef = useRef<ElementRef<typeof MwSearchTable>>(null)
  useTableAutoRefresh(tableRef)
  const [expandedRowKey, setExpandedRowKey] = useState('')
  const [expandedRowData, setExpandedRowData] = useState<any>()
  const handleExpand = (expanded: boolean, record: any) => {
    setExpandedRowKey(expanded ? record[rowKey] : '')
    setExpandedRowData(record.data)
  }
  const getDeviceStatus = async () => {
    const res = await fetchDeviceStatus()
    const deviceFields = fields.slice(1)
    const deviceList = Object.entries(res).map(([k, v]) => ({
      name: k,
      ...Object.fromEntries(deviceFields.map((x) => [[x.key], v.find((sx) => sx.key === x.title)])),
      data: v.filter((x) => !deviceFields.map((sx) => sx.title).includes(x.key))
    }))

    return deviceList
  }

  const expandedRowRender = () => {
    const expandedTableFields: Array<MwSearchTableField> = [
      {
        title: '名称',
        key: 'key',
        align: 'center'
      },
      {
        title: '值',
        key: 'value',
        align: 'center',
        render: (_, record) => (
          <>
            <Badge color={colorMap[record.level as TDeviceStatusLevel]} />
            <span className="pl-2" style={{ color: colorMap[record.level as TDeviceStatusLevel] }}>
              {record.value}
            </span>
          </>
        )
      }
    ]
    return (
      <MwSearchTable
        rowKey="key"
        data={expandedRowData}
        fields={expandedTableFields}
        pagination={false}
        extraVisible={false}
      />
    )
  }

  return (
    <MwSearchTable
      ref={tableRef}
      rowKey={rowKey}
      api={async () => {
        const data = await getDeviceStatus()
        const result = {
          items: data,
          totalCount: data.length
        }
        return setDefaultDataFilter ? setDefaultDataFilter(result) : result
      }}
      pagination={{ pageSize: 12 }}
      fields={fields}
      tableExtend={{ expandable: { expandedRowRender, onExpand: handleExpand }, expandedRowKeys: [expandedRowKey] }}
    />
  )
}

export default memo(Status)
