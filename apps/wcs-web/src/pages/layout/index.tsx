import React, { useState, Suspense, useEffect, Component, useRef } from 'react'
import { Outlet, useNavigate, useLocation, useHistory } from 'react-router-dom'
import { useStore } from '@/store/index'
import { observer } from 'mobx-react-lite'
import { Layout, Drawer } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import SiderMenu from './sider/index'
import HeaderNav from './header/index'
import logoMini from '@/assets/imgs/logo.png'
import { useTranslation } from 'react-i18next'

import { get, post } from '@/http/request'
import { setToken, getToken } from '@/utils/token'

import { getKeyName, isAuthorized } from '@/assets/js/publicFunc'
import { menus as preDefinedRoutes } from '@/components/menus'
import { IconFont } from '@/components/Icon'

import '@/multiway/config.tsx'
import './index.module.less'

const { Header, Content, Sider } = Layout

import '@/multiway'
import TabPanes from '@/components/tabPanes'

const noNewTab = ['/login'] // 不需要新建 tab的页面
interface PanesItemProps {
  title: string
  content: Component
  key: string
  closable: boolean
  path: string
}

const url = {
  login: '/api/pricing/account/login'
}

function LayoutConfig() {
  const [show, setShow] = useState(true)
  const [originPermission, setOriginPermission] = useState<any>([])
  const { configStore, basicStore } = useStore()
  const token = getToken()
  const { pathname, search } = useLocation()
  const pathRef: RefType = useRef<string>('')
  const { t } = useTranslation() // 国际化
  const [panesItem, setPanesItem] = useState<PanesItemProps>({
    title: '',
    content: null,
    key: '',
    closable: false,
    path: ''
  })
  const [tabActiveKey, setTabActiveKey] = useState<string>('home')
  const navigate = useNavigate() // 路由跳转

  const [collapsed, setCollapsed] = useState(false) // 菜单栏收起状态
  const [visible, setVisible] = useState(false) // Drawer状态
  const [width, setWidth] = useState(window.innerWidth) // 窗口宽度
  const toggle = () => {
    if (width > 650) setCollapsed(!collapsed)
    configStore.setCollapsed(String(!collapsed))
    setVisible(true)
  }

  // 关闭drawer
  const onClose = () => {
    setVisible(false)
  }

  // 返回首页
  const backHome = () => {
    configStore.crumbItem()
    navigate('/', { replace: true })
  }

  // 获取窗口宽度
  window.onresize = () => {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    width < 650 ? setCollapsed(true) : setCollapsed(false)
  }, [width])

  useEffect(() => {
    getPermission()
  }, [])

  // 获取当前用户所有权限
  // 可以优化 sider 的左侧菜单的数据可以从这里来
  const getPermission = async () => {
    // suironghua tag 权限从layout层去拿，现在没有先注销
    return
  }

  //处理tab
  useEffect(() => {
    const { tabKey, title, component: Content } = getKeyName(pathname)
    // 新tab已存在或不需要新建tab，return
    if (pathname === pathRef.current || noNewTab.includes(pathname)) {
      setTabActiveKey(tabKey)
      return
    }

    // 记录新的路径，用于下次更新比较
    const newPath = search ? pathname + search : pathname
    pathRef.current = newPath
    setPanesItem({
      title: t(title),
      content: Content,
      key: tabKey,
      closable: tabKey !== 'home',
      path: newPath
    })
    setTabActiveKey(tabKey)
  }, [history, pathname, search, token, collapsed])

  return (
    <>
      {show && (
        <Layout className="h-full select-none">
          {/* 侧边栏适配移动端 */}
          {width < 650 ? (
            <Drawer
              placement="left"
              width="80%"
              open={visible}
              onClose={onClose}
              closable={false}
              bodyStyle={{ padding: 0 }}
            >
              <Sider
                collapsedWidth={0}
                theme={configStore.themeStyle}
                trigger={null}
                className="cs-aside !w-full h-full !max-w-none"
              >
                <SiderMenu setVisible={setVisible} />
              </Sider>
            </Drawer>
          ) : (
            <Sider
              width="230"
              theme={configStore.themeStyle}
              trigger={null}
              collapsible
              collapsed={collapsed}
              className="cs-aside"
              style={{ overflow: 'auto' }}
            >
              <SiderMenu collapsed={collapsed} originPermission={originPermission} />
            </Sider>
          )}
          <Layout>
            <Header className="flex items-center !bg-white shadow-box !p-0">
              {width < 650 ? (
                <span className="w-24 h-full text-center cursor-pointer px-5 py-2" onClick={backHome}>
                  <img className="w-full h-full" src={logoMini} alt="" />
                </span>
              ) : (
                ''
              )}
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className:
                  '!flex items-center h-full py-0 px-6 cursor-pointer transition-color duration-300 text-gray-500 mr-2.5 text-base hover:bg-gray-100',
                onClick: toggle
              })}
              <HeaderNav width={width} />
            </Header>
            {configStore.multyTab ? (
              <TabPanes defaultActiveKey="home" panesItem={panesItem} tabActiveKey={tabActiveKey} />
            ) : (
              ''
            )}
            <Content
              style={{
                margin: width < 650 ? 4 : 16,
                minHeight: 280,
                overflow: 'auto',
                position: 'relative'
              }}
              key={basicStore.refreshKey}
            >
              <Suspense>
                <Outlet />
              </Suspense>
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  )
}

export default observer(LayoutConfig)
