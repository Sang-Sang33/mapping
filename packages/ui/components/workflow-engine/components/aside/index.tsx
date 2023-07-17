import React, { forwardRef, memo, useState, useImperativeHandle, useRef, useContext } from 'react'
import type { ReactNode } from 'react'
import { PlusOutlined } from '@ant-design/icons'

import MenuList from './MenuList'
import './animate.less'
import useResize from '../../hooks/useResize'
import { WorkflowTypeEnum } from '../../common'
import useMenuListHeight from '../../hooks/useMenuListHeight'
import { WorkflowConfigContext } from '../../context'

interface IAsideProps {
  title: string
  menu: IMenuItem[]
  onSelectChange?: (menuItem: IMenuItem, menuPath: IMenuItem[]) => void
  onScrollToBottom?: () => void
  onDelete?: (menuItem: IMenuItem) => void
  onCreate?: () => void
  onEdit?: (menuItem: IMenuItem) => void
  onCopy?: (menuItem: IMenuItem) => void
  onPaste?: () => void
  onExport?: (data: IMenuItem[]) => void
  onImport?: (to: IMenuItem[]) => void
  onCopyMulitiple?: (data: IMenuItem[]) => void
}

export interface IMenuItem {
  label: string
  field: string
  definitionId: string | null
  type: WorkflowTypeEnum
  icon?: ReactNode
  children?: IMenuItem[] | null
  data?: any
  parentData?: any | null
}

export interface IAsideComponentRef {
  selectedNodeFields: IMenuItem['field'][]
}

const Aside = forwardRef<IAsideComponentRef, IAsideProps>((props, ref) => {
  const {
    title,
    menu,
    onSelectChange,
    onScrollToBottom,
    onDelete,
    onCreate,
    onEdit,
    onCopy,
    onPaste,
    onExport,
    onImport,
    onCopyMulitiple
  } = props
  useImperativeHandle(ref, () => ({
    selectedNodeFields
  }))
  const [selectedNodeFields, setSelectedNodeFields] = useState<IMenuItem['field'][]>([])

  const [listResizeTriggerVisible, setListResizeTriggerVisible] = useState(true)
  const listResizeWrapperRef = useRef<HTMLDivElement>(null)
  const listResizeTriggerRef = useRef<HTMLDivElement>(null)
  useResize(listResizeWrapperRef, listResizeTriggerRef)

  const { menuListDesignHeight, menuItemHeight } = useContext(WorkflowConfigContext)
  const menuListHeight = useMenuListHeight(menu.length || 0, menuListDesignHeight, menuItemHeight)

  const handleMenuItemClick = async (menuItem: IMenuItem, menuPath: IMenuItem[]) => {
    onSelectChange?.(menuItem, menuPath)
    setSelectedNodeFields(menuPath.map((x) => x.field))
  }

  return (
    <div className="relative flex items-center justify-center">
      {menu?.length ? (
        <>
          <div
            className="flex flex-col z-10 py-2 px-1 h-full border-r-2 border-gray-200 border-solid bg-[#fbfbfb] slide-in-left w-[150px] min-w-[150px]"
            ref={listResizeWrapperRef}
          >
            <div className="flex justify-between items-center pt-1 px-2 text-gray-500">
              <span>{title}</span>
              <PlusOutlined
                className="cursor-pointer hover:bg-gray-200 p-3"
                style={{ fontSize: '12px', color: '#000' }}
                onClick={() => onCreate?.()}
              />
            </div>
            <MenuList
              renderData={menu}
              height={menuListHeight}
              selectedNodeFields={selectedNodeFields}
              onMenuItemClick={handleMenuItemClick}
              onScrollToBottom={onScrollToBottom}
              onDelete={onDelete}
              onCreate={onCreate}
              onEdit={onEdit}
              onCopy={onCopy}
              onPaste={onPaste}
              onImport={onImport}
              onExport={onExport}
              onCopyMulitiple={onCopyMulitiple}
              onMenuItemMouseEnter={() => setListResizeTriggerVisible(false)}
              onMenuItemMouseLeave={() => setListResizeTriggerVisible(true)}
            ></MenuList>
            {/* trigger */}
          </div>
          {listResizeTriggerVisible && (
            <div
              ref={listResizeTriggerRef}
              className={`absolute right-0 top-0 bottom-0 z-10 translate-x-full w-[4px] hover:bg-gray-400 hover:bg-opacity-70 hover:cursor-col-resize`}
            ></div>
          )}
        </>
      ) : null}
    </div>
  )
})

export default memo(Aside)
