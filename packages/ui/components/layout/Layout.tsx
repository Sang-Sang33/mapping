import React, { useState, Suspense, useEffect, memo, FC, useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout as AntdLayout, ConfigProvider, Drawer, type MenuProps } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { useRoute } from '@packages/hooks'
import { getRouteById, getRouteIdPath, mapPermissionToRoutes, mapRoutesToMenu } from './utils'
import type { TLayoutRoutes, TLayoutPermission } from './typings'
import useLayoutStore from './store'
import SiderMenu from './sider/index'
import HeaderNav from './header/index'
import './style.less'
import logoMini from './assets/logo.png'

const { Header: AntdHeader, Content: AntdContent, Sider: AntdSider } = AntdLayout

interface ILayoutProps {
  routes: TLayoutRoutes
  permission: TLayoutPermission
}

const Layout: FC<ILayoutProps> = (props) => {
  const { routes, permission } = props
  const {
    collapsed,
    theme,
    primaryColor,
    layoutContentKey,
    updateCollapsed,
    updateRouteIdPath,
    updatePermissionRoutes
  } = useLayoutStore((state) => ({
    collapsed: state.collapsed,
    theme: state.theme,
    primaryColor: state.primaryColor,
    layoutContentKey: state.layoutContentKey,
    updateCollapsed: state.updateCollapsed,
    updateRouteIdPath: state.updateRouteIdPath,
    updatePermissionRoutes: state.updatePermissionRoutes
  }))
  const permissionRoutes = useMemo(() => {
    const permissionRoutes = mapPermissionToRoutes(permission, routes)
    updatePermissionRoutes(permissionRoutes)
    return permissionRoutes
  }, [routes, permission])
  const menus = useMemo(() => mapRoutesToMenu(permissionRoutes), [permissionRoutes])
  const route = useRoute(routes)
  useEffect(() => {
    if (route?.id) {
      const routeIdPath = getRouteIdPath(routes, route?.id)
      updateRouteIdPath(routeIdPath)
    }
  }, [route])
  const navigate = useNavigate()
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)
  let isInitial = true
  const isMobile = useMemo(() => {
    const isMobile = width < 650
    if (!isInitial) {
      // 首次渲染不响应式修改, 因为需要记录显示缓存的collapsed
      updateCollapsed(isMobile)
    }
    if (isInitial) isInitial = false
    return isMobile
  }, [width])

  // 关闭drawer
  const onClose = () => {
    setDrawerVisible(false)
  }

  // 返回首页
  const backHome = () => {
    navigate('/', { replace: true })
  }

  // 获取窗口宽度
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const handleMenuClick: MenuProps['onClick'] = (item) => {
    const { key } = item
    const route = getRouteById(routes, key)
    if (route?.path) {
      navigate(route.path)
    }
    isMobile && setDrawerVisible(false)
  }

  ConfigProvider.config({
    theme: {
      primaryColor,
      errorColor: '#ff4d4f',
      warningColor: '#faad14',
      successColor: '#52c41a',
      infoColor: '#1890ff'
    }
  })

  return (
    <ConfigProvider>
      <AntdLayout className="h-full select-none">
        {/* 侧边栏适配移动端 */}
        {isMobile ? (
          <Drawer
            placement="left"
            width="80%"
            open={drawerVisible}
            onClose={onClose}
            closable={false}
            bodyStyle={{ padding: 0 }}
          >
            <AntdSider collapsedWidth={0} theme={theme} trigger={null} className="cs-aside !w-full h-full !max-w-none">
              <SiderMenu menus={menus} onMenuItemClick={onClose} />
            </AntdSider>
          </Drawer>
        ) : (
          <AntdSider
            width="230"
            theme={theme}
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="cs-aside"
            style={{ overflow: 'auto' }}
          >
            <SiderMenu menus={menus} collapsed={collapsed} onMenuItemClick={handleMenuClick} />
          </AntdSider>
        )}
        <AntdLayout>
          <AntdHeader className="flex items-center !bg-white shadow-box !p-0">
            {isMobile && (
              <span className="w-24 h-full text-center cursor-pointer px-5 py-2" onClick={backHome}>
                <img className="w-full h-full" src={logoMini} alt="" />
              </span>
            )}
            {React.createElement(isMobile ? MenuUnfoldOutlined : collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className:
                '!flex items-center h-full py-0 px-6 cursor-pointer transition-color duration-300 text-gray-500 mr-2.5 text-base hover:bg-gray-100',
              onClick: () => (isMobile ? setDrawerVisible(!drawerVisible) : updateCollapsed(!collapsed))
            })}
            <HeaderNav />
          </AntdHeader>
          {/* {configStore.multyTab ? (
          <TabPanes defaultActiveKey="home" panesItem={panesItem} tabActiveKey={tabActiveKey} />
        ) : (
          ''
        )} */}
          <AntdContent
            style={{
              margin: isMobile ? 4 : 16,
              minHeight: 280,
              overflow: 'auto',
              position: 'relative'
            }}
            key={layoutContentKey}
          >
            <Suspense>
              <Outlet />
            </Suspense>
          </AntdContent>
        </AntdLayout>
      </AntdLayout>
    </ConfigProvider>
  )
}

export default memo(Layout)
