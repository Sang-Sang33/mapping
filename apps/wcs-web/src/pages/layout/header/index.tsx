import { useState, useEffect, useRef, ElementRef } from 'react'
import { useStore } from '@/store/index'
import { observer } from 'mobx-react-lite'
import { Breadcrumb, Menu, Dropdown, Tooltip, Drawer, Avatar, Switch, Select } from 'antd'
import { GlobalOutlined, SettingOutlined, CheckOutlined, ImportOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import dark from '@/assets/icons/dark.svg'
import light from '@/assets/icons/light.svg'
import user from '@/assets/icons/user.svg'

import { getLanguage, getTenant, getWarehouseInCookie, setLanguage, setWarehouseToCookie } from '@/utils/token'

import { redirectToSso, setTenant } from '@/utils/token'
import { get } from '@/http/request/index'
import useOptions from '@/hooks/useOptions'

interface IHeaderProps {
  width: number
}

const MAPPING_API = window.__MAPPING_API__ || import.meta.env.VITE_APP_MAPPING_API
const url = {
  login: '/connect/token',
  customer: MAPPING_API + '/api/mapping/customer/whole-or-self',
  warehouse: MAPPING_API + '/api/mapping/warehouse'
}

function HeaderNav({ width }: IHeaderProps) {
  const [customer, setCustomer] = useState('')
  const { options: customerOpts } = useOptions(() => get(url.customer), {
    transform: {
      value: 'id',
      label: 'displayName'
    }
  })
  const { configStore, basicStore } = useStore()
  const { t } = useTranslation() // 国际化
  //   const [locales, setLocales] = useState<Array<any>>(["zh_CN"]); // 默认中文环境
  const [visible, setVisible] = useState(false) // 设置面板显示状态
  const [warehousetOptions, setWarehouseOptions] = useState<{ label: string; value: string }[]>()
  const [warehouse, setWarehouse] = useState('')
  const warehouseSelectRef = useRef<ElementRef<typeof Select>>(null)

  useEffect(() => {
    const initOptions = async () => {
      const tenantId = getTenant()
      const warehouseId = getWarehouseInCookie()
      if (customerOpts.length) {
        setCustomer(tenantId || customerOpts[0].value)
        if (!tenantId) setTenant(customerOpts[0].value)

        const warehouseOptions = await getWarehouseOptions(customerOpts[0].value)
        setWarehouseOptions(warehouseOptions)
        setWarehouse(warehouseId || warehouseOptions[0].value)
        if (!warehouseId) setWarehouseToCookie(warehouseOptions[0].value)
      }
    }
    initOptions()
  }, [customerOpts])

  const getWarehouseOptions = async (tenantId: string) => {
    const warehoustList = await get<{ id: string; name: string }[]>(url.warehouse, { tenantId })
    return warehoustList.map((x) => ({
      label: x.name,
      value: x.id
    }))
  }

  const handleSelectCustomer = async (customer: string) => {
    setWarehouse('')
    setWarehouseToCookie('')
    setCustomer(customer)
    setTenant(customer)
    const warehouseOptions = await getWarehouseOptions(customer)
    setWarehouseOptions(warehouseOptions)
    setWarehouse(warehouseOptions[0].value)
    setWarehouseToCookie(warehouseOptions[0].value)
    basicStore.updateRefreshKey() // 切换仓库刷新layout contennt组件
  }

  const handleSelectWarehouse = (warehouse: string) => {
    setWarehouse(warehouse)
    setWarehouseToCookie(warehouse)
    basicStore.updateRefreshKey() // 切换仓库刷新layout contennt组件
  }

  interface ILocale {
    key?: any
  }

  // 语言切换
  const handleSelect = ({ key }: ILocale) => {
    if (getLanguage() !== key) {
      setLanguage(key)
      window.location.reload()
    }
  }

  // 主题风格
  const themeList: Array<any> = [
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
  const colorList: Array<any> = [
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

  // 退出登录
  const handleUserLogout = ({ key }: ILocale) => {
    if (key === 'logout') {
      redirectToSso()
      // basicStore.logout();
      // // navigate("/login", { replace: true });
      // console.log(window.location)
      // const nowUrl = window.location.href;
      // window.location.href = import.meta.env.VITE_APP_BASIC_API + `?returnUrl=${nowUrl}`
    }
  }

  // 国际化菜单
  const languageMenu = (
    <Menu
      onClick={handleSelect}
      selectedKeys={getLanguage()}
      items={[
        { label: '🇨🇳 简体中文', key: 'zh' },
        { label: '🇬🇧 English', key: 'en' },
        { label: '🇯🇵 日本', key: 'ja' },
        { label: '🇰🇷 韩国', key: 'ko' }
      ]}
    ></Menu>
  )

  // 用户下拉设置
  const userMenu = (
    <Menu
      onClick={handleUserLogout}
      items={[{ label: t('header.logout'), key: 'logout', icon: <ImportOutlined /> }]}
    ></Menu>
  )
  return (
    <div className="flex justify-between items-center relative w-full text-black text-opacity-60 shadow-box z-10">
      <div className="flex flex-col text-left">
        <p className=" text-lg font-bold m-0" style={{ color: '#001529' }}>
          {t('system')}
        </p>
        {/* 面包屑导航 */}
        <Breadcrumb>
          {configStore.parentItem?.label && !configStore.activeItem?.isParent && width > 500 ? (
            <>
              <Breadcrumb.Item>{t(`aside.${configStore.parentItem.key}.nav`)}</Breadcrumb.Item>
              <Breadcrumb.Item>
                {t(`aside.${configStore.parentItem.key}.${configStore.activeItem.key}.nav`)}
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item>{t(`aside.${configStore.activeItem.key}.nav`)}</Breadcrumb.Item>
          )}
        </Breadcrumb>
      </div>
      <div className="flex gap-2">
        {
          <div>
            <Select
              dropdownMatchSelectWidth={false}
              options={customerOpts}
              value={customer}
              onChange={handleSelectCustomer}
            ></Select>
          </div>
        }
        {
          <div>
            <Select
              ref={warehouseSelectRef}
              dropdownMatchSelectWidth={false}
              options={warehousetOptions}
              value={warehouse}
              onChange={handleSelectWarehouse}
            ></Select>
          </div>
        }

        {/* 国际化 */}
        <Dropdown overlay={languageMenu} placement="bottomRight">
          <div className="w-10 text-center cursor-pointer hover:bg-gray-100">
            <GlobalOutlined className="text-base" />
          </div>
        </Dropdown>
        {/* <FullScreen></FullScreen> */}

        {/* github */}
        {/* <div className="w-10 text-center cursor-pointer hover:bg-gray-100" title="react-admin-vite" onClick={handleLinkGit}> */}
        {/* <BellOutlined className="text-base" /> */}
        {/* <HeaderNoticeComponent /> */}
        {/* </div> */}

        {/* 设置 */}
        <div className="w-10 text-center cursor-pointer hover:bg-gray-100" onClick={() => setVisible(true)}>
          <SettingOutlined className="text-base" />
        </div>
        {/* 用户信息  */}
        <Dropdown overlay={userMenu} placement="bottomRight">
          <div className="w-14 text-center cursor-pointer hover:bg-gray-100">
            <Avatar src={user} />
          </div>
        </Dropdown>
      </div>

      {/* 设置面板 */}
      <Drawer width="280" placement="right" open={visible} onClose={() => setVisible(false)} closable={false}>
        {/* 主题style */}
        <div>
          <h3 className="text-gray-700 mb-2.5 font-semibold">{t('header.page_style')}</h3>
          <div className="flex">
            {themeList.map((item) => (
              <span
                className="relative w-12 h-10 mr-4 rounded cursor-pointer"
                key={item.style}
                onClick={() => configStore.switchStyle(item.style)}
              >
                <Tooltip
                  title={item[configStore.locale + '_name']}
                  color={configStore.theme.primaryColor + 'B3'}
                  key={configStore.theme.primaryColor}
                >
                  <img className="w-full h-full" src={item.icon} alt="" />
                </Tooltip>
                {configStore.themeStyle === item.style ? (
                  <CheckOutlined
                    className="absolute right-2.5 bottom-2.5"
                    style={{ color: configStore.theme.primaryColor }}
                  />
                ) : (
                  ''
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 主题色 */}
        <div>
          <h3 className="font-semibold text-gray-700 mx-0 mt-4 mb-2.5">{t('header.theme_color')}</h3>
          <div className="flex">
            {colorList.map((item) => (
              <Tooltip title={item[configStore.locale + '_name']} color={item.color + 'B3'} key={item.color}>
                <span
                  className="w-5 h-5 leading-5 text-center rounded-sm text-white mr-2 cursor-pointer flex items-center justify-center"
                  style={{ background: item.color }}
                  onClick={() => configStore.switchColor(item.color)}
                >
                  {configStore.theme.primaryColor === item.color ? <CheckOutlined /> : ''}
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

export default observer(HeaderNav)
