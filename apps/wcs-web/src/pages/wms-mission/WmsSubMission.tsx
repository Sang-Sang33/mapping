import React, { ElementRef, memo, useRef } from 'react'
import type { FC } from 'react'
import { MwButton, MwSearchTable, MwTableCtrlField } from 'multiway'
import { List, Tooltip } from 'antd'
import { IMwTableRef } from '@packages/multiway-config'
import { type IWmsItem, useWcsRequest } from '@packages/services'
import useTableAutoRefresh from '@/hooks/useTableAutoRefresh'
import useTableFocusRow from '@/hooks/useTableFocusRow'
import i18n from '@/i18n'
import { ColorBox, wmsSubMissionFields } from './fields'

const t = (key: string) => i18n.t(key)
interface IProps {
  wmsMissionId: string
  isDebugging: boolean
  onUpdate?: (data: Record<string, any>) => void
  onCancel?: (id: string) => void
  onView?: (data: Record<string, any>) => void
}

const itemHeight = 113
const WmsSubMission: FC<IProps> = (props) => {
  const { wmsMissionId, isDebugging = false, onUpdate, onCancel, onView } = props
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
          t('empty')
        )
      }
    }
  })
  const ctrl: MwTableCtrlField = {
    width: 180,
    title: t('wmsMission.action'),
    render: (_, record) => (
      <div className="flex gap-2">
        <MwButton
          className="!px-1"
          type="link"
          onClick={() => {
            onUpdate?.(record)
          }}
          disabled={!record.isUpdatable}
        >
          {t('wmsMission.edit')}
        </MwButton>
        <MwButton
          className="!px-1"
          type="link"
          onClick={() => {
            onView?.(record)
          }}
        >
          {t('wmsMission.detail')}
        </MwButton>
        <MwButton
          danger
          className="!px-1"
          type="link"
          onClick={() => {
            onCancel?.(record.id)
          }}
          disabled={!record.isCancelable}
        >
          {t('wmsMission.cancel')}
        </MwButton>
      </div>
    ),
    fixed: 'right'
  }

  return (
    <div className="py-2">
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
        ctrl={isDebugging ? ctrl : undefined}
        height={itemHeight * 4}
      ></MwSearchTable>
    </div>
  )
}

export default memo(WmsSubMission)
