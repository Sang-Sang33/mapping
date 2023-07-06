import React, { memo } from 'react'
import type { FC } from 'react'
import { Avatar, Dropdown, type MenuProps } from 'antd'
import { ImportOutlined } from '@ant-design/icons'
import { i18n } from '@packages/i18n'
import { redirectToSSO } from '@packages/utils'
import user from '../../assets/icons/user.svg'
import { IHeaderNavProps } from '../../typings'

const User: FC<Pick<IHeaderNavProps, 'ssoUrl'>> = (props) => {
  // 用户下拉菜单
  const userMenuItems = [{ label: i18n.t('header.logout', { ns: 'layout' }), key: 'logout', icon: <ImportOutlined /> }]
  // 退出登录
  const handleUserClick: MenuProps['onClick'] = (item) => {
    if (item.key === 'logout') {
      redirectToSSO(props.ssoUrl)
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
