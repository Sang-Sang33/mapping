import { Children, useEffect, useState } from 'react'
import { useStore } from '@/store/index'
import { observer } from 'mobx-react-lite'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation, useMatch } from 'react-router-dom'
// import { menus } from "@/components/menus/index";
import { menus as preDefinedRoutes } from '@/components/menus'
import logoMini from '@/assets/imgs/logo.png'
import logoOrigin from '@/assets/imgs/frame/logo_origin.png'
import { IconFont } from '@/components/Icon'
import './index.less'
import { getRoute } from '@/assets/js/publicFunc'

interface IHeaderProps {
  collapsed?: boolean
  setVisible?: any
  originPermission?: any[]
}
function SiderMenu({ collapsed, setVisible, originPermission }: IHeaderProps) {
  const { configStore, permissionStore } = useStore()
  const { t } = useTranslation()
  const navigate = useNavigate() // 路由跳转
  const location = useLocation()

  // 菜单列表
  const [menuList, setMenuList]: Array<any> = useState([])

  useEffect(() => {}, [])

  function getMenu(menus) {
    return menus.map((ele) => {
      return {
        key: ele.key,
        icon: ele.icon && <IconFont type={ele.icon}></IconFont>,
        label: t(ele.label),
        path: ele.path,
        permission: ele.permission,
        onClick: () => ele.path,
        children: ele.children && getMenu(ele.children)
      }
    })
  }
  // 解决刷新页面面包屑导航消失的问题
  useEffect(() => {
    let activeNode = JSON.parse(localStorage.getItem('activeItem') || '{}')
    let parentNode = JSON.parse(localStorage.getItem('parentItem') || '{}')

    if (activeNode?.label !== undefined && activeNode?.label !== null) {
      configStore.switchMenuItem(activeNode)
      configStore.operateCrumbMenu(parentNode)
    }
  }, [configStore, location.pathname, menuList])

  useEffect(() => {
    // const [findMenu] = menuList.filter((menu: any) => menu.path === location.pathname);
    // console.log("permissionStore.getPermission()", permissionStore.getPermission(), permissionStore.permission);
    // console.log("originPermission", originPermission, getMenu(preDefinedRoutes));
    const ary = permissionStore.getPermissionMenu(originPermission, getMenu(preDefinedRoutes))
    const omenu = ary.filter((item: any) => item.children === undefined || item.children.length != 0)
    const isExit = permissionStore.checkPathnameInMenu(omenu, location.pathname)
    setMenuList(omenu)
    const [findMenu] = isExit ? getFindMenu(omenu, location.pathname) : [null]
    if (!findMenu) {
      return
    }
    configStore.switchMenuItem({ key: findMenu.key, label: findMenu.label })
    // 初始化的时候设置菜单展开的key
    const initOpenKey = findOpenKeys(menuList, location.pathname)
    const keys = initOpenKey?.map((it: any) => it.key)
    configStore.setOpenKeys(keys)
  }, [location, originPermission])

  // 递归找到当前路由的父节点
  const findOpenKeys = (list: any, id: string) => {
    for (let i in list) {
      if (list[i].path === id) {
        return [list[i]]
      }
      if (list[i].children) {
        let node: any = findOpenKeys(list[i].children, id)
        if (node !== undefined) {
          return node.concat(list[i])
        }
      }
    }
  }

  const getFindMenu = (ary: any[], key: string) => {
    for (let i in ary) {
      if (ary[i].path == key) {
        return [ary[i]]
      }
      if (ary[i].children) {
        let node: any = getFindMenu(ary[i].children, key)
        if (node !== undefined) {
          return node
        }
      }
    }
  }

  // 返回首页
  const backHome = () => {
    configStore.crumbItem()
    navigate('/', { replace: true })
  }

  // 点击菜单
  const handleClickItem: MenuProps['onClick'] = (item) => {
    let parentNode = item.keyPath[1]
    let result = getRoute(item.key)
    const { key, title, path, url } = result
    if (url) return window.open(url)
    if (!parentNode) {
      configStore.switchMenuItem({ key, label: t(title), path, isParent: true })
      configStore.operateCrumbMenu({
        label: '',
        key: ''
      })
      localStorage.removeItem('parentItem')
      navigate(path)
      return
    }
    let { title: pTitle, key: pKey } = getRoute(item.keyPath[1])
    configStore.operateCrumbMenu({
      label: t(pTitle),
      key: pKey
    })
    configStore.switchMenuItem({ key, label: t(title) })
    navigate(path)

    if (setVisible !== undefined) setVisible(false) // 收起drawer菜单
  }

  // 点击菜单展开的
  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const openKeys = configStore.openKeys || []
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    const rootSubmenuKeys = menuList?.map((it: any) => it.key)
    if (rootSubmenuKeys?.indexOf(latestOpenKey!) === -1) {
      configStore.setOpenKeys(keys)
    } else {
      configStore.setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
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
        theme={configStore.themeStyle}
        mode="inline"
        selectedKeys={[configStore.activeItem.key]}
        onClick={handleClickItem}
        items={menuList}
        onOpenChange={handleOpenChange}
        openKeys={configStore.openKeys}
      ></Menu>
    </>
  )
}

export default observer(SiderMenu)
