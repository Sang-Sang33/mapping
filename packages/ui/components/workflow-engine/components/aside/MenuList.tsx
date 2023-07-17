import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Dropdown, MenuProps, Popconfirm, Checkbox, Tooltip } from 'antd'
import { DeleteOutlined, SnippetsOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import VirtualList from 'rc-virtual-list'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useDrop } from 'ahooks'
import { i18n } from '@packages/i18n'
import type { IMenuItem } from '.'
import MenuItem from './MenuItem'
import ActionArea from './ActionArea'
import { showMessage } from '../../common'
import './animate.less'
import './menu-list.less'

const t = (key: string) => i18n.t(key, { ns: 'workflowEngine' })

interface IMenuListProps {
  renderData: IMenuItem[]
  selectedNodeFields: IMenuItem['field'][]
  actionAreaVisible?: boolean
  draggable?: boolean
  height?: number
  itemHeight?: number
  onMenuItemClick?: (menuItem: IMenuItem, menuPath: IMenuItem[]) => void
  onScrollToBottom?: () => void
  onDelete?: (menuItem: IMenuItem) => void
  onCreate?: () => void
  onEdit?: (menuItem: IMenuItem) => void
  onCopy?: (menuItem: IMenuItem) => void
  onPaste?: () => void
  onExport?: (data: IMenuItem[]) => void
  onImport?: (to: IMenuItem[]) => void
  onCopyMulitiple?: (data: IMenuItem[]) => void
  onMenuItemMouseEnter?: (menuItem: IMenuItem) => void
  onMenuItemMouseLeave?: (menuItem: IMenuItem) => void
}

export interface IMenuListRef {
  isOpenPopConfirm: boolean
}

enum ActionEnum {
  DEFAULT,
  DELETE,
  EXPORT,
  COPY_MULTIPLE
}

const MenuList = forwardRef<IMenuListRef, IMenuListProps>((props, ref) => {
  const {
    renderData,
    actionAreaVisible = true,
    selectedNodeFields,
    draggable = true,
    height = 886,
    itemHeight = 50,
    onMenuItemClick,
    onScrollToBottom,
    onDelete,
    onEdit,
    onCopy,
    onPaste,
    onExport,
    onImport,
    onCopyMulitiple,
    onMenuItemMouseEnter,
    onMenuItemMouseLeave
  } = props
  useImperativeHandle(ref, () => ({
    isOpenPopConfirm
  }))
  const { t } = useTranslation('workflowEngine')
  const [action, setAction] = useState<ActionEnum>(ActionEnum.DEFAULT)
  /** 删除 */
  const dropRef = useRef<HTMLDivElement>(null)
  useDrop(dropRef, {
    onDom: (content, e) => {
      setMenuItemWillDelete(content)
      setPopConfirmTitle(`${t('action.deletePopConfirmTitle')} "${content.label}"`)
      setIsOpenPopConfirm(true)
    },
    onDragEnter: () => dropRef.current?.classList.add('bg-red-500', 'text-white'),
    onDragLeave: () => dropRef.current?.classList.remove('bg-red-500', 'text-white')
  })
  const [isOpenPopConfirm, setIsOpenPopConfirm] = useState(false)
  const [popConfirmTitle, setPopConfirmTitle] = useState<string>('')
  const [menuItemWillDelete, setMenuItemWillDelete] = useState<IMenuItem>()

  const handleConfirmDelete = async (menuItem?: IMenuItem) => {
    if (menuItem || menuItemWillDelete) {
      await deleteFunc(menuItem ?? menuItemWillDelete!)
      setIsOpenPopConfirm(false)
      setAction(ActionEnum.DEFAULT)
      setMenuItemWillDelete(undefined)
    } else {
      return console.warn('no menu item checkedList to delete')
    }
  }
  const handleCancelDelete = () => {
    setIsOpenPopConfirm(false)
    // message.warn('取消')
    showMessage('delete_cancel')()
    setAction(ActionEnum.DEFAULT)
    dropRef.current?.classList.remove('bg-red-500', 'text-white')
  }
  const deleteFunc = async (deleteNode: IMenuItem) => {
    onDelete?.(deleteNode)
  }

  const handleDragStart = () => {
    setAction(ActionEnum.DELETE)
  }
  const handleDragEnd = () => {
    if (isOpenPopConfirm) return
    setAction(ActionEnum.DEFAULT)
  }

  const handleRightClickDelete = (menuItem: IMenuItem) => {
    setMenuItemWillDelete(menuItem)
    handleConfirmDelete(menuItem)
  }

  /** 滚动 */
  const menuListContainerRef = useRef<HTMLDivElement>(null)
  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === menuListContainerRef.current?.clientHeight) {
      onScrollToBottom?.()
    }
  }
  const handleMenuItemClick = async (menuItem: IMenuItem, menuPath: IMenuItem[]) => {
    onMenuItemClick?.(menuItem, menuPath)
  }

  const items: MenuProps['items'] = [
    {
      label: <a onClick={() => onPaste?.()}>{t('action.paste')}</a>,
      key: 'paste',
      icon: <SnippetsOutlined />
    }
  ]

  /** 导入 */
  const handleImportClick = () => {
    onImport?.(renderData)
  }

  /** 导出 */
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([])
  const [indeterminate, setIndeterminate] = useState(false) // 控制是否是半选中
  const [checkAll, setCheckAll] = useState(false)
  const checkedData = useMemo(() => renderData.filter((x) => checkedList.includes(x.label)), [checkedList, renderData])

  const resetCheck = () => {
    setCheckedList([])
    setIndeterminate(false)
    setCheckAll(false)
  }

  const handleExportClick = () => {
    setAction(ActionEnum.EXPORT)
  }
  const handleCheckChange = (checkedValues: CheckboxValueType[]) => {
    if (!checkedValues) return
    setCheckedList(checkedValues)
    setIndeterminate(!!checkedValues.length && checkedValues.length < renderData.length)
    setCheckAll(checkedValues.length === renderData.length)
  }
  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    const options = renderData.map((x) => x.label)
    setCheckedList(e.target.checked ? options : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }
  const handleConfirmExport = () => {
    console.log('confirm export', checkedList)
    onExport?.(checkedData)
    setAction(ActionEnum.DEFAULT)
    resetCheck()
  }

  /** 复制多个 */
  const handleCopyMulitiple = () => {
    setAction(ActionEnum.COPY_MULTIPLE)
  }
  const handleConfirmCopyMultiple = () => {
    onCopyMulitiple?.(checkedData)
    setCheckedList([])
    setAction(ActionEnum.DEFAULT)
    resetCheck()
  }

  /** 渲染用户操作区域 */
  const renderDefaulActionArea = () => (
    <ActionArea
      onImport={handleImportClick}
      onExport={handleExportClick}
      onCopyMulitiple={handleCopyMulitiple}
      onPaste={onPaste}
    ></ActionArea>
  )
  const rednerDeleteActionArea = () => (
    <Popconfirm
      placement={'top'}
      title={popConfirmTitle}
      onConfirm={() => handleConfirmDelete(menuItemWillDelete)}
      onCancel={handleCancelDelete}
      open={isOpenPopConfirm}
    >
      <DeleteOutlined className="m-auto p-3 slide-in-bottom" style={{ fontSize: '18px' }} />
    </Popconfirm>
  )
  const renderSelectActionArea = (onClick: () => void) => {
    return (
      <div className="flex-1 flex items-center p-2 justify-start gap-1">
        <Checkbox onChange={handleCheckAllChange} indeterminate={indeterminate} checked={checkAll}>
          <span className="text-[12px] whitespace-nowrap">{t('menuList.selectAll')}</span>
        </Checkbox>
        <Tooltip title="确认">
          <CheckOutlined
            onClick={() => {
              if (!checkedList.length) return showMessage('select_null')()
              onClick()
            }}
          />
        </Tooltip>
        <Tooltip title="取消">
          <CloseOutlined onClick={() => setAction(ActionEnum.DEFAULT)} />
        </Tooltip>
      </div>
    )
  }
  const renderActionAreaStrategy = {
    [ActionEnum.DEFAULT]: renderDefaulActionArea(),
    [ActionEnum.DELETE]: rednerDeleteActionArea(),
    [ActionEnum.EXPORT]: renderSelectActionArea(handleConfirmExport),
    [ActionEnum.COPY_MULTIPLE]: renderSelectActionArea(handleConfirmCopyMultiple)
  }

  const isSelectMode = useMemo(() => !![ActionEnum.EXPORT, ActionEnum.COPY_MULTIPLE].includes(action), [action])
  const leftIcon = useCallback(
    (menuItem: IMenuItem) =>
      isSelectMode ? <Checkbox value={menuItem.label} onClick={(e) => e.stopPropagation()}></Checkbox> : menuItem.icon,
    [checkedList, isSelectMode]
  )

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <div>
        <div className={`relative flex-1`} ref={menuListContainerRef}>
          {/* menu virtual list */}
          {height && (
            <Checkbox.Group className="w-full !block" onChange={handleCheckChange} value={checkedList}>
              <VirtualList
                data={renderData}
                height={height}
                itemHeight={itemHeight}
                itemKey="field"
                onScroll={onScroll}
              >
                {(menuItem: IMenuItem) => (
                  <MenuItem
                    key={menuItem.field}
                    menuItem={menuItem}
                    draggable={draggable && !isSelectMode}
                    leftIcon={leftIcon}
                    selectedNodeFields={selectedNodeFields}
                    onMenuItemClick={handleMenuItemClick}
                    onDelete={handleRightClickDelete}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onEdit={onEdit}
                    onCopy={onCopy}
                    onMenuItemMouseEnter={onMenuItemMouseEnter}
                    onMenuItemMouseLeave={onMenuItemMouseLeave}
                  ></MenuItem>
                )}
              </VirtualList>
            </Checkbox.Group>
          )}
        </div>
        {/* action area */}
        {actionAreaVisible && (
          <div
            ref={dropRef}
            className={`flex justify-center items-center border-t-2 border-gray-200 border-solid  cursor-pointer select-none bg-[#fbfbfb]`}
          >
            {renderActionAreaStrategy[action]}
          </div>
        )}
      </div>
    </Dropdown>
  )
})

export default memo(MenuList)
