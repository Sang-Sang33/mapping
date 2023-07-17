import React, { memo, useState } from 'react'
import type { FC } from 'react'
import { Drawer, Tooltip } from 'antd'
import { CheckOutlined, SettingOutlined } from '@ant-design/icons'
import { i18n } from '@packages/i18n'
import type { TTheme } from '../../store'
import dark from '../../assets/icons/dark.svg'
import light from '../../assets/icons/light.svg'
import useLayoutStore from '../../store'

const t = (key: string) => i18n.t(key, { ns: 'layout' })

const Setting: FC = () => {
  const { theme, primaryColor, updateTheme, updatePrimaryColor } = useLayoutStore((state) => ({
    theme: state.theme,
    primaryColor: state.primaryColor,
    updatePrimaryColor: state.updatePrimaryColor,
    updateTheme: state.updateTheme
  }))
  const [drawerVisible, setDrawerVisible] = useState(false) // 设置面板显示状态

  // 主题风格
  const themeList = [
    {
      themeKey: 'dark',
      icon: dark
    },
    {
      themeKey: 'light',
      icon: light
    }
  ]

  // 主题色
  const colorList = [
    {
      colorKey: 'dustRed',
      color: '#F5222D'
    },
    {
      colorKey: 'volcano',
      color: '#FA541C'
    },
    {
      colorKey: 'sunsetOrange',
      color: '#FAAD14'
    },
    {
      colorKey: 'cyan',
      color: '#13C2C2'
    },
    {
      colorKey: 'polarGreen',
      color: '#52C41A'
    },
    {
      colorKey: 'daybreakBlue',
      color: '#1890FF'
    },
    {
      colorKey: 'geekBlue',
      color: '#2F54EB'
    },
    {
      colorKey: 'goldenPurple',
      color: '#722ED1'
    }
  ]

  return (
    <>
      <div className="w-10 text-center cursor-pointer hover:bg-gray-100" onClick={() => setDrawerVisible(true)}>
        <SettingOutlined className="text-base" />
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
          <h3 className="text-gray-700 mb-2.5 font-semibold">{t('header.setting.pageStyle')}</h3>
          <div className="flex">
            {themeList.map(({ themeKey, icon }) => (
              <span
                className="relative w-12 h-10 mr-4 rounded cursor-pointer"
                key={themeKey}
                onClick={() => updateTheme(themeKey as TTheme)}
              >
                <Tooltip title={t('header.setting.themes.' + themeKey)} color={primaryColor} key={themeKey}>
                  <img className="w-full h-full" src={icon} alt="" />
                </Tooltip>
                {theme === themeKey && (
                  <CheckOutlined className="absolute right-2.5 bottom-2.5" style={{ color: primaryColor }} />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 主题色 */}
        <div>
          <h3 className="font-semibold text-gray-700 mx-0 mt-4 mb-2.5">{t('header.setting.themeColor')}</h3>
          <div className="flex">
            {colorList.map(({ colorKey, color }) => (
              <Tooltip title={t('header.setting.colors.' + colorKey)} color={color} key={color}>
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
    </>
  )
}

export default memo(Setting)
