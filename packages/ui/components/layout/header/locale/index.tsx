import React, { memo } from 'react'
import type { FC } from 'react'
import { Dropdown, type MenuProps } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { TCulture, getCultureIC, setCultureIc } from '@packages/utils'

// 多语言菜单
const localeMenuItems = [
  { label: '🇨🇳 简体中文', key: 'zh' },
  { label: '🇬🇧 English', key: 'en' },
  { label: '🇯🇵 日本語', key: 'ja' },
  { label: '🇰🇷 한국인', key: 'ko' }
]
// 语言切换
const handleLocaleSelect: MenuProps['onClick'] = (item) => {
  setCultureIc(item.key as TCulture)
  window.location.reload()
}

const Locale: FC = () => {
  return (
    <Dropdown
      menu={{ items: localeMenuItems, onClick: handleLocaleSelect, selectedKeys: [getCultureIC()] }}
      placement="bottomRight"
    >
      <div className="w-10 text-center cursor-pointer hover:bg-gray-100">
        <GlobalOutlined className="text-base" />
      </div>
    </Dropdown>
  )
}

export default memo(Locale)
