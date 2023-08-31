import { memo } from 'react'
import type { ReactNode, FC } from 'react'
import { AppstoreOutlined } from '@ant-design/icons'
import { MenuProps, Dropdown } from 'antd'

interface IProps {
  children?: ReactNode
}

const appList = [
  {
    label: 'WCS',
    link: 'http://www.dev.multiway-cloud.com:25022/wcs-web/'
  },
  {
    label: 'FCU',
    link: 'http://www.dev.multiway-cloud.com:25022/fcu-web/'
  },
  {
    label: 'Mapping',
    link: 'http://www.dev.multiway-cloud.com:25022/mapping-web/'
  }
]

const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
  const link = appList.find((app) => app.label === key)?.link
  link && location.assign(link)
}

const AppList: FC<IProps> = () => {
  return (
    <Dropdown
      menu={{
        items: appList.map((app) => ({
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
