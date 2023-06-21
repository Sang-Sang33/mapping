import { useState, memo, FC } from 'react'
import { Breadcrumb, Dropdown, Tooltip, Drawer, Avatar, MenuProps } from 'antd'
import { GlobalOutlined, SettingOutlined, CheckOutlined, ImportOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { TCulture, getCultureIC, redirectToSSO, setCultureIc } from '@packages/utils'
import useLayoutStore, { TTheme } from '../store'
import { getRouteById } from '../utils'
import dark from '../assets/icons/dark.svg'
import light from '../assets/icons/light.svg'
import user from '../assets/icons/user.svg'

const HeaderNav: FC = () => {
  const { t } = useTranslation() // 国际化
  const { theme, primaryColor, routeIdPath, permissionRoutes, updateTheme, updatePrimaryColor } = useLayoutStore(
    (state) => ({
      theme: state.theme,
      primaryColor: state.primaryColor,
      routeIdPath: state.routeIdPath,
      permissionRoutes: state.permissionRoutes,
      updatePrimaryColor: state.updatePrimaryColor,
      updateTheme: state.updateTheme
    })
  )
  const [drawerVisible, setDrawerVisible] = useState(false) // 设置面板显示状态

  // 主题风格
  const themeList: {
    zh_CN_name: string
    en_US_name: string
    style: TTheme
    icon: string
  }[] = [
    {
      zh_CN_name: '暗色菜单风格',
      en_US_name: 'Dark style',
      style: 'dark',
      icon: dark
    },
    {
      zh_CN_name: '亮色菜单风格',
      en_US_name: 'Light style',
      style: 'light',
      icon: light
    }
  ]

  // 主题色
  const colorList = [
    {
      zh_CN_name: '薄暮',
      en_US_name: 'Dust Red',
      color: '#F5222D'
    },
    {
      zh_CN_name: '火山',
      en_US_name: 'Volcano',
      color: '#FA541C'
    },
    {
      zh_CN_name: '日暮',
      en_US_name: 'Sunset Orange',
      color: '#FAAD14'
    },
    {
      zh_CN_name: '明青',
      en_US_name: 'Cyan',
      color: '#13C2C2'
    },
    {
      zh_CN_name: '极光绿',
      en_US_name: 'Polar Green',
      color: '#52C41A'
    },
    {
      zh_CN_name: '拂晓蓝（默认）',
      en_US_name: 'Daybreak Blue (default)',
      color: '#1890FF'
    },
    {
      zh_CN_name: '极客蓝',
      en_US_name: 'Geek Glue',
      color: '#2F54EB'
    },
    {
      zh_CN_name: '酱紫',
      en_US_name: 'Golden Purple',
      color: '#722ED1'
    }
  ]

  // 国际化菜单
  const localeMenuItems = [
    { label: '🇨🇳 简体中文', key: 'zh' },
    { label: '🇬🇧 English', key: 'en' },
    { label: '🇯🇵 日本', key: 'ja' },
    { label: '🇰🇷 韩国', key: 'ko' }
  ]
  // 语言切换
  const handleLocaleSelect: MenuProps['onClick'] = (item) => {
    setCultureIc(item.key as TCulture)
    window.location.reload()
  }

  // 用户下拉设置
  const userMenuItems = [{ label: t('header.logout'), key: 'logout', icon: <ImportOutlined /> }]
  // 退出登录
  const handleUserClick: MenuProps['onClick'] = (item) => {
    if (item.key === 'logout') {
      redirectToSSO()
    }
  }

  return (
    <div className="flex justify-between items-center relative w-full text-black text-opacity-60 shadow-box z-10">
      <div className="flex flex-col text-left">
        <p className="text-lg font-bold m-0" style={{ color: '#001529' }}>
          {t('system')}
        </p>
        {/* 面包屑导航 */}
        <Breadcrumb>
          {routeIdPath.map((id) => {
            const { name } = getRouteById(permissionRoutes, id)!
            return <Breadcrumb.Item key={id}>{name}</Breadcrumb.Item>
          })}
        </Breadcrumb>
      </div>
      <div className="flex gap-2">
        {/* 国际化 */}
        <Dropdown
          menu={{ items: localeMenuItems, onClick: handleLocaleSelect, selectedKeys: [getCultureIC()] }}
          placement="bottomRight"
        >
          <div className="w-10 text-center cursor-pointer hover:bg-gray-100">
            <GlobalOutlined className="text-base" />
          </div>
        </Dropdown>
        {/* <FullScreen></FullScreen> */}
        {/* 设置 */}
        <div className="w-10 text-center cursor-pointer hover:bg-gray-100" onClick={() => setDrawerVisible(true)}>
          <SettingOutlined className="text-base" />
        </div>
        {/* 用户信息  */}
        <Dropdown menu={{ items: userMenuItems, onClick: handleUserClick }} placement="bottomRight">
          <div className="w-14 text-center cursor-pointer hover:bg-gray-100">
            <Avatar src={user} />
          </div>
        </Dropdown>
      </div>

      {/* 设置面板 */}
      <Drawer
        width={280}
        placement="right"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        closable={false}
      >
        {/* 主题style */}
        <div>
          <h3 className="text-gray-700 mb-2.5 font-semibold">{t('header.page_style')}</h3>
          <div className="flex">
            {themeList.map(({ zh_CN_name, style, icon }) => (
              <span
                className="relative w-12 h-10 mr-4 rounded cursor-pointer"
                key={style}
                onClick={() => updateTheme(style)}
              >
                <Tooltip title={zh_CN_name} color={primaryColor} key={style}>
                  <img className="w-full h-full" src={icon} alt="" />
                </Tooltip>
                {theme === style && (
                  <CheckOutlined className="absolute right-2.5 bottom-2.5" style={{ color: primaryColor }} />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 主题色 */}
        <div>
          <h3 className="font-semibold text-gray-700 mx-0 mt-4 mb-2.5">{t('header.theme_color')}</h3>
          <div className="flex">
            {colorList.map(({ zh_CN_name, color }) => (
              <Tooltip title={zh_CN_name} color={color} key={color}>
                <span
                  className="w-5 h-5 leading-5 text-center rounded-sm text-white mr-2 cursor-pointer flex items-center justify-center"
                  style={{ background: color }}
                  onClick={() => updatePrimaryColor(color)}
                >
                  {primaryColor === color && <CheckOutlined />}
                </span>
              </Tooltip>
            ))}
          </div>
        </div>
        {/* <div>
          <h3 className="font-semibold text-gray-700 mx-0 mt-4 mb-2.5">{'开启多页'}</h3>
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={configStore.multyTab}
            onChange={(val) => configStore.switchTab(val)}
          />
        </div> */}
      </Drawer>
    </div>
  )
}

export default memo(HeaderNav)
