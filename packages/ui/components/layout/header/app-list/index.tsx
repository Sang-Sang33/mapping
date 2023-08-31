import { memo } from 'react'
import type { FC } from 'react'
import { AppstoreOutlined } from '@ant-design/icons'
import { MenuProps, Dropdown } from 'antd'
import { ILayoutProps } from '../../typings'

const AppList: FC<Pick<ILayoutProps, 'appList'>> = ({ appList }) => {
  const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    const link = appList?.find((app) => app.label === key)?.link
    link && location.assign(link)
  }

  return (
    <Dropdown
      menu={{
        items: appList?.map((app) => ({
          label: app.label,
          key: app.label
        })),
        onClick: handleMenuItemClick
      }}
    >
      <div className="w-10 text-center cursor-pointer hover:bg-gray-100">
        <AppstoreOutlined className="text-base" />
      </div>
    </Dropdown>
  )
}

export default memo(AppList)
