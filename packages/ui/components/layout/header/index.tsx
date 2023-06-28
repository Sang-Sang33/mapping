import { memo, FC } from 'react'
import { Breadcrumb } from 'antd'
import useLayoutStore from '../store'
import { getRouteById } from '../utils'
import Locale from './locale'
import Setting from './setting'
import User from './user'
import { IHeaderNavProps } from '../typings'

const HeaderNav: FC<IHeaderNavProps> = (props) => {
  const { systemName, headerToolBarRender } = props
  const { routeIdPath, permissionRoutes } = useLayoutStore((state) => ({
    routeIdPath: state.routeIdPath,
    permissionRoutes: state.permissionRoutes
  }))

  const headerToolBarDefaultRender = () => (
    <>
      {/* 多语言 */}
      <Locale />
      {/* <FullScreen></FullScreen> */}
      {/* 设置 */}
      <Setting />
      {/* 用户信息  */}
      <User />
    </>
  )

  return (
    <div className="flex justify-between items-center relative w-full text-black text-opacity-60 shadow-box z-10">
      <div className="flex flex-col text-left">
        <p className="text-lg font-bold m-0" style={{ color: '#001529' }}>
          {systemName}
        </p>
        {/* 面包屑导航 */}
        <Breadcrumb>
          {routeIdPath.map((id) => {
            const { name } = getRouteById(permissionRoutes, id)!
            return <Breadcrumb.Item key={id}>{name}</Breadcrumb.Item>
          })}
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        {headerToolBarRender
          ? headerToolBarRender({ locale: <Locale />, setting: <Setting />, user: <User /> })
          : headerToolBarDefaultRender()}
      </div>
    </div>
  )
}

export default memo(HeaderNav)
