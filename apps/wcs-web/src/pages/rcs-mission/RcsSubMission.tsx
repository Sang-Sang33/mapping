import React, { ElementRef, memo, useRef } from 'react'
import type { FC } from 'react'
import { MwButton, MwSearchTable, MwTableCtrlField } from 'multiway'
import { List, Tooltip } from 'antd'
import { IMwTableRef } from '@packages/multiway-config'
import { type IRcsSubItem, useWcsRequest } from '@packages/services'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import i18n from '@/i18n'
import { ColorBox, rcsSubMissionFields } from './fields'

const t = (key: string) => i18n.t(key)
interface IProps {
  rcsSubMissionId: string
  // isDebugging: boolean
  onUpdate?: (data: Record<string, any>) => void
  onCancel?: (id: string) => void
  onView?: (data: Record<string, any>) => void
}

const itemHeight = 113
const RcsSubMission: FC<IProps> = (props) => {
  const { rcsSubMissionId, onUpdate, onCancel, onView } = props
  const { getRcsSubMissionList } = useWcsRequest()
  const rcsSubMissionTableRef = useRef<ElementRef<typeof MwSearchTable> & IMwTableRef<IRcsSubItem>>(null)
  useTableAutoRefresh(rcsSubMissionTableRef)

  const { antTableRef, focusToRow } = useTableFocusRow()
  const tableExtend = {
    ref: antTableRef
  }

  // fields处理
  rcsSubMissionFields.forEach((field) => {
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
          t('empty')
        )
      }
    }
  })
  const ctrl: MwTableCtrlField = {
    width: 60,
    title: t('rcsMission.action'),
    render: (_, record) => (
      <div className="flex gap-2">
        {/* <MwButton
          className="!px-1"
          type="link"
          onClick={() => {
            onUpdate?.(record)
          }}
        >
          编辑
        </MwButton> */}
        <MwButton
          className="!px-1"
          type="link"
          onClick={() => {
            onView?.(record)
          }}
        >
          {t('rcsMission.detail')}
        </MwButton>
        {/* <MwButton
          danger
          className="!px-1"
          type="link"
          onClick={() => {
            onCancel?.(record.id)
          }}
        >
          取消
        </MwButton> */}
      </div>
    ),
    fixed: 'right'
  }

  return (
    <div className="p-2">
      <MwSearchTable
        ref={rcsSubMissionTableRef}
        compact
        extraVisible={false}
        api={() =>
          getRcsSubMissionList(rcsSubMissionId).then((res) => {
            const items = res.map((x) => ({ ...x, highlight: false }))
            return {
              items,
              totalCount: res.length
            }
          })
        }
        fields={rcsSubMissionFields}
        rowKey="id"
        pagination={false}
        tableExtend={tableExtend}
        ctrl={ctrl}
        height={itemHeight * 4}
      />
    </div>
  )
}

export default memo(RcsSubMission)
