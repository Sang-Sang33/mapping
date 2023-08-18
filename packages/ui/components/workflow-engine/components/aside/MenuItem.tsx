import React, { forwardRef, memo, useContext, useImperativeHandle, useRef, useState } from 'react'
import type { RefObject, ReactNode } from 'react'
import { Dropdown, List, MenuProps, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, CopyOutlined, RightOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import MenuList, { type IMenuListRef } from './MenuList'
import Drag from './Drag'
import { showMessage } from '../../common'
import type { IMenuItem } from '.'
import { WorkflowConfigContext } from '../../context'
import useMenuListHeight from '../../hooks/useMenuListHeight'
import './menu-item.less'

interface IDragItemProps {
  menuItem: IMenuItem
  selectedNodeFields: IMenuItem['field'][]
  draggable?: boolean
  leftIcon?: ReactNode | ((menuItem: IMenuItem) => ReactNode)
  onMenuItemClick: (menuItem: IMenuItem, menuPath: IMenuItem[]) => void
  onDragStart?: (event: React.DragEvent<Element>) => void
  onDragEnd?: (event: React.DragEvent<Element>) => void
  onDelete?: (menuItem: IMenuItem) => void
  onEdit?: (menuItem: IMenuItem) => void
  onCopy?: (menuItem: IMenuItem) => void
  onMenuItemMouseEnter?: (menuItem: IMenuItem) => void
  onMenuItemMouseLeave?: (menuItem: IMenuItem) => void
}

export interface IMenuItemComponentRef {
  menuItemContentRef: RefObject<HTMLDivElement>
}

const MenuItem = forwardRef<IMenuItemComponentRef, IDragItemProps>((props, ref) => {
  const {
    menuItem,
    selectedNodeFields,
    onMenuItemClick,
    onDelete,
    onDragStart,
    onDragEnd,
    draggable,
    onEdit,
    onCopy,
    leftIcon,
    onMenuItemMouseEnter,
    onMenuItemMouseLeave
  } = props
  useImperativeHandle(ref, () => ({ menuItemContentRef }))
  const { t } = useTranslation('workflowEngine')
  const menuItemContainerRef = useRef<HTMLDivElement>(null)
  const menuItemContentRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const { canInteract, setCanInteract, menuListDesignHeight, menuItemHeight, editable } =
    useContext(WorkflowConfigContext)
  const [isOpenPopConfirm, setIsOpenPopConfirm] = useState(false)
  const menuListHeight = useMenuListHeight(menuItem.children?.length || 0, menuListDesignHeight, menuItemHeight, true)

  const handleConfirmCancel = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e?.stopPropagation()
    setIsOpenPopConfirm(false)
    setCanInteract?.(true)
    // message.warn('取消')
    showMessage('delete_cancel')()
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <a
          onClick={() => {
            setIsOpenPopConfirm(true)
            setCanInteract?.(false)
          }}
        >
          {t('action.delete')}
        </a>
      ),
      key: 'delete',
      danger: true,
      icon: <DeleteOutlined />
    },
    {
      label: <a onClick={() => onCopy?.(menuItem)}>{t('action.copy')}</a>,
      key: 'copy',
      icon: <CopyOutlined />
    }
  ]

  const editMenu = {
    label: <a onClick={() => onEdit?.(menuItem)}>{t('action.edit')}</a>,
    key: 'edit',
    icon: <EditOutlined />
  }
  editable && items.unshift(editMenu)

  const isSelected = (menuItem: IMenuItem) => selectedNodeFields.includes(menuItem.field)
  const getSelectedItemClass = (menuItem: IMenuItem) => (isSelected(menuItem) ? '' : '')
  const getSelectedItemTitleClass = (menuItem: IMenuItem) =>
    isSelected(menuItem) ? 'text-[#13c2c2] hover:text-[#13c2c2]' : 'text-gray-600'

  const renderListItemTitle = () => {
    const leftIconInternal = typeof leftIcon === 'function' ? leftIcon(menuItem) : leftIcon
    return (
      <span
        className={`flex items-center w-full truncate cursor-pointer block px-2 font-bold min-w-[80px] align-middle ${getSelectedItemTitleClass(
          menuItem
        )}`}
        style={{ userSelect: 'none' }}
        onClick={() => onMenuItemClick(menuItem, [menuItem])}
      >
        <span className="flex items-center w-min-[16px]">{leftIconInternal ?? menuItem.icon}</span>
        <Popconfirm
          placement={'right'}
          title={`${t('action.deletePopConfirmTitle')}"${menuItem.label}"`}
          onConfirm={(e) => {
            e?.stopPropagation()
            onDelete?.(menuItem)
            setIsOpenPopConfirm(false)
            setCanInteract?.(true)
          }}
          onCancel={handleConfirmCancel}
          open={isOpenPopConfirm}
        >
          <span className="pl-2 text-ellipsis overflow-hidden">{menuItem.label}</span>
        </Popconfirm>

        {menuItem.children && <RightOutlined className="ml-auto" />}
      </span>
    )
  }

  // 暂时不考虑多级菜单 只考虑两级
  const menuListRef = useRef<IMenuListRef>(null)
  const [menuItemChildren, setMenuItemChildren] = useState<IMenuItem[]>([])
  const [menuListTop, setMenuItemTop] = useState(0)
  const handleMenuItemMouseEnter = () => {
    if (!menuItem.children?.length || !canInteract) return
    const menuItemContainerEl = menuItemContainerRef.current!
    const { y, height } = menuItemContainerEl.getBoundingClientRect()!
    const pxToClientBottom = window.innerHeight - y - height
    const remainDistance = pxToClientBottom + height - menuListHeight

    if (remainDistance > 0) {
      setMenuItemTop(menuItemContainerEl.offsetTop)
    } else {
      setMenuItemTop(menuItemContainerEl.offsetTop - Math.ceil(Math.abs(remainDistance) / height) * height)
    }
    setMenuItemChildren(menuItem.children)
    onMenuItemMouseEnter?.(menuItem)
  }
  const handleMenuItemMouseLeave = () => {
    if (!canInteract) return
    setMenuItemChildren([])
    onMenuItemMouseLeave?.(menuItem)
  }
  const handleSubMenuItemClick = async (subMenuItem: IMenuItem, subMenuPath: IMenuItem[]) => {
    onMenuItemClick?.(subMenuItem, [menuItem, ...subMenuPath])
  }

  const renderContent = () => (
    <div
      className="hover:bg-gray-100 rounded-md"
      ref={menuItemContentRef}
      onContextMenu={(e) => {
        e.stopPropagation() // 阻止context-menu事件的冒泡,防止右键MenuItem, MenuList的DropDown会显示问题
      }}
    >
      <Dropdown
        menu={{
          items,
          onClick: () => menuItemContentRef.current?.classList.remove('bg-gray-100')
        }}
        trigger={['contextMenu']}
        onOpenChange={() => {
          menuItemContentRef.current?.classList.toggle('bg-gray-100')
        }}
      >
        <List.Item key={menuItem.field} className={getSelectedItemClass(menuItem)}>
          <List.Item.Meta title={renderListItemTitle()} />
        </List.Item>
      </Dropdown>
    </div>
  )

  return (
    <div onMouseEnter={handleMenuItemMouseEnter} onMouseLeave={handleMenuItemMouseLeave} ref={menuItemContainerRef}>
      {draggable ? (
        <Drag data={menuItem} targetRef={menuItemContentRef} options={{ onDragStart, onDragEnd }}>
          {renderContent()}
        </Drag>
      ) : (
        renderContent()
      )}
      <CSSTransition nodeRef={nodeRef} in={!!menuItemChildren?.length} timeout={200} classNames="sub-menu-list">
        <div ref={nodeRef} className="absolute left-[100%] z-11 origin-top-left" style={{ top: menuListTop + 'px' }}>
          {!!menuItemChildren.length && (
            <div
              className="h-fit min-w-[150px] rounded-lg bg-[#fbfbfb]"
              style={{
                boxShadow:
                  '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <MenuList
                ref={menuListRef}
                renderData={menuItemChildren}
                actionAreaVisible={false}
                draggable={false}
                height={menuListHeight}
                itemHeight={menuItemHeight}
                selectedNodeFields={selectedNodeFields}
                onMenuItemClick={handleSubMenuItemClick}
                onDelete={onDelete}
                onEdit={onEdit}
                onCopy={onCopy}
              ></MenuList>
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  )
})

export default memo(MenuItem)
