import { type FC, memo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { shallow } from 'zustand/shallow'
import useLayoutStore from '../store'
import logoMini from '../assets/logo.png'
import logoOrigin from '../assets/logo_origin.png'
import './index.less'

interface ISiderMenu {
  menus: MenuProps['items']
  collapsed?: boolean
  onMenuItemClick?: (info: any) => void
  onOpenChange?: (openKeys: string[]) => void
}
const SiderMenu: FC<ISiderMenu> = (props) => {
  const { collapsed, menus, onMenuItemClick } = props
  const { theme, routeIdPath } = useLayoutStore(
    (state) => ({
      theme: state.theme,
      routeIdPath: state.routeIdPath
    }),
    shallow
  )
  const navigate = useNavigate()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  useEffect(() => {
    setSelectedKeys([routeIdPath[routeIdPath.length - 1]])
    setOpenKeys([...new Set([...openKeys, ...routeIdPath.slice(0, -1)])])
  }, [routeIdPath])

  // 返回首页
  const backHome = () => {
    navigate('/', { replace: true })
  }

  // 点击菜单
  const handleClickItem: MenuProps['onClick'] = (item) => {
    onMenuItemClick?.(item)
  }

  return (
    <>
      <div
        className="h-16 text-center cursor-pointer overflow-hidden px-12 py-2 sm:px-6 flex items-center"
        onClick={backHome}
      >
        <div className="ilogo">
          <img className={collapsed ? 'w-full' : 'w-full m-auto'} src={collapsed ? logoMini : logoOrigin} alt="" />
        </div>
      </div>
      <Menu
        inlineIndent={16}
        theme={theme}
        mode="inline"
        items={menus}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onClick={handleClickItem}
        onOpenChange={(openKeys) => setOpenKeys(openKeys)}
      ></Menu>
    </>
  )
}

export default memo(SiderMenu)
