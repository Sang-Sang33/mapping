import React, { memo, useState } from 'react'
import type { FC } from 'react'
import { Drawer, Tooltip } from 'antd'
import { CheckOutlined, SettingOutlined } from '@ant-design/icons'
import type { TTheme } from '../../store'
import dark from '../../assets/icons/dark.svg'
import light from '../../assets/icons/light.svg'
import useLayoutStore from '../../store'
import { useTranslation } from 'react-i18next'

const Setting: FC = () => {
  const { theme, primaryColor, updateTheme, updatePrimaryColor } = useLayoutStore((state) => ({
    theme: state.theme,
    primaryColor: state.primaryColor,
    updatePrimaryColor: state.updatePrimaryColor,
    updateTheme: state.updateTheme
  }))
  const { t } = useTranslation(['layout']) // 国际化
  const [drawerVisible, setDrawerVisible] = useState(false) // 设置面板显示状态

  // 主题风格
  // TODO Layout header多语言
  const themeList = [
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
            {themeList.map(({ zh_CN_name, style, icon }) => (
              <span
                className="relative w-12 h-10 mr-4 rounded cursor-pointer"
                key={style}
                onClick={() => updateTheme(style as TTheme)}
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
          <h3 className="font-semibold text-gray-700 mx-0 mt-4 mb-2.5">{t('header.setting.themeColor')}</h3>
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
    </>
  )
}

export default memo(Setting)
