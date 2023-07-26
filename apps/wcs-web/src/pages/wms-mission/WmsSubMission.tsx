import React, { ElementRef, memo, useRef } from 'react'
import type { FC } from 'react'
import { MwButton, MwSearchTable, MwSearchTableField } from 'multiway'
import { List, Tooltip } from 'antd'
import { IMwTableRef } from '@packages/multiway-config'
import { type IWmsItem, useWcsRequest } from '@packages/services'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import { ColorBox, wmsSubMissionFields } from './fields'
import useToggleDebuggingField from '@/hooks/useToggleDebuggingField'

interface IProps {
  wmsMissionId: string
  isDebugging: boolean
  onUpdate?: (data: Record<string, any>) => void
  onCancel?: (id: string) => void
}

const itemHeight = 113
const WmsSubMission: FC<IProps> = (props) => {
  const { wmsMissionId, isDebugging = false, onUpdate, onCancel } = props
  const { getWmsSubMissionList } = useWcsRequest()
  const wmsSubMissionTableRef = useRef<ElementRef<typeof MwSearchTable> & IMwTableRef<IWmsItem>>(null)
  useTableAutoRefresh(wmsSubMissionTableRef)

  const { antTableRef, focusToRow } = useTableFocusRow()
  const tableExtend = {
    ref: antTableRef
  }

  // fields处理
  wmsSubMissionFields.forEach((field) => {
    if (field.key === 'predecessorIds') {
      field.render = (values: string[]) => {
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
    }
  })
  useToggleDebuggingField(wmsSubMissionFields, isDebugging, (_, record) => (
    <div className="flex gap-2">
      <MwButton
        className="!px-1"
        type="link"
        onClick={() => {
          onUpdate?.(record)
        }}
      >
        编辑
      </MwButton>
      <MwButton
        danger
        className="!px-1"
        type="link"
        onClick={() => {
          onCancel?.(record.id)
        }}
      >
        取消
      </MwButton>
    </div>
  ))

  return (
    <div className="p-2">
      <MwSearchTable
        key={wmsSubMissionFields.length}
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
        fields={wmsSubMissionFields}
        rowKey="id"
        pagination={false}
        tableExtend={tableExtend}
        height={itemHeight * 4}
      ></MwSearchTable>
    </div>
  )
}

export default memo(WmsSubMission)
