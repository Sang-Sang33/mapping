import React, { memo } from 'react'
import type { FC } from 'react'
import { Avatar, Dropdown, type MenuProps } from 'antd'
import { ImportOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { redirectToSSO } from '@packages/utils'
import user from '../../assets/icons/user.svg'

const User: FC = () => {
  const { t } = useTranslation() // 国际化
  // 用户下拉菜单
  const userMenuItems = [{ label: t('header.logout'), key: 'logout', icon: <ImportOutlined /> }]
  // 退出登录
  const handleUserClick: MenuProps['onClick'] = (item) => {
    if (item.key === 'logout') {
      redirectToSSO()
    }
  }

  return (
    <Dropdown menu={{ items: userMenuItems, onClick: handleUserClick }} placement="bottomRight">
      <div className="w-14 text-center cursor-pointer hover:bg-gray-100">
        <Avatar src={user} />
      </div>
    </Dropdown>
  )
}

export default memo(User)
