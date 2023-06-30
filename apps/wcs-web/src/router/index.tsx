import { type FC, lazy, Suspense, ComponentType } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { ILayoutData, type TLayoutRoutes } from '@packages/types'
import { Loading } from '@packages/ui'
import { IconFont } from '@/components/Icon'
import i18n from '@/i18n'

const Layout = lazy(() => import('@/components/layout'))
const NotFound = lazy(() => import('@packages/ui/components/404/NotFound'))

/**
 * @description: 自动生成后台Layout下的routes 要求页面定义在src/pages目录下, 每个页面都有个page.ts定义路由元信息.如果存在嵌套路由, 需要按照src/pages/** /c-pages/** /index.tsx的方式定义
 * @return {*}
 */
const genaratePageRoutes = () => {
  const pageModule = import.meta.glob('../pages/**/page.{ts,tsx}', {
    eager: true,
    import: 'default'
  })
  const asyncComponentModule = import.meta.glob<boolean, string, { default: ComponentType<any> }>(
    '../pages/**/index.tsx'
  )
  const notPageNameStrings = ['..', '.', 'pages', 'page.ts', 'page.tsx', 'c-pages']

  const pageModuleEntries = Object.entries(pageModule)
  const routes: TLayoutRoutes = []
  const pagesInfo = pageModuleEntries
    .map(([pageModulePath, meta]) => {
      const pageNameStrings = pageModulePath.split('/').filter((x) => !notPageNameStrings.includes(x))
      return {
        path: pageNameStrings,
        pageModulePath,
        meta: meta as ILayoutData
      }
    })
    .sort((a, b) => {
      if (a.path.length === b.path.length && a.meta.order && b.meta.order) {
        return a.meta.order - b.meta.order
      }
      return a.path.length - b.path.length
    })
  pagesInfo.forEach((pageInfo) => {
    const parentRoute = routes.find((route) => route.path === pageInfo.path[0])
    const Component = lazy(asyncComponentModule[pageInfo.pageModulePath.replace(/page.ts[x]?/, 'index.tsx')])
    const route = {
      path: pageInfo.path.at(-1),
      element: <Component />,
      ...pageInfo.meta,
      children: []
    }
    if (parentRoute) {
      parentRoute.children!.push(route)
    } else {
      routes.push(route)
    }
  })

  return routes
}
const defineRoutes = [
  ...genaratePageRoutes(),
  {
    name: i18n.t('aside.logs.nav'),
    id: 'log',
    icon: <IconFont type="icon-rizhi"></IconFont>,
    url: 'http://dev.multiway-cloud.com:25009/#/'
  }
]

// const defineRoutes: TLayoutRoutes = [
//   {
//     path: 'wms-mission',
//     element: <WMSMission />,
//     name: t('aside.wmsMission.nav'),
//     id: 'wms-mission',
//     icon: <IconFont type="icon-WMSrizhi"></IconFont>
//   },
//   {
//     path: 'rcs-mission',
//     element: <RCSMission />,
//     name: t('aside.rcsMission.nav'),
//     id: 'rcs-mission',
//     icon: <IconFont type="icon-RCS"></IconFont>
//   },
//   {
//     path: 'mission-process',
//     element: <MissionProcess />,
//     name: t('aside.missionProcess.nav'),
//     id: 'mission-process',
//     icon: <IconFont type="icon-renwuchuli"></IconFont>
//   },
//   {
//     path: 'device',
//     element: <Device />,
//     name: t('aside.device.nav'),
//     id: 'device',
//     icon: <IconFont type="icon-device"></IconFont>,
//     children: [
//       {
//         path: 'feature',
//         element: <Feature />,
//         name: t('aside.device.feature.nav'),
//         id: 'feature',
//         icon: <IconFont type="icon-shebeigongnengguanli"></IconFont>
//       },
//       {
//         path: 'status',
//         element: <Status />,
//         name: t('aside.device.status.nav'),
//         id: 'status',
//         icon: <IconFont type="icon-shebeizhuangtai"></IconFont>
//       }
//     ]
//   },
//   {
//     path: 'event',
//     element: <Event />,
//     name: t('aside.event.nav'),
//     id: 'event',
//     icon: <IconFont type="icon-shijian"></IconFont>
//   },
//   {
//     name: t('aside.logs.nav'),
//     id: 'log',
//     icon: <IconFont type="icon-rizhi"></IconFont>,
//     url: 'http://dev.multiway-cloud.com:25009/#/'
//   }
// ]

const routes: TLayoutRoutes = [
  {
    path: '/',
    element: <Navigate to={'/wms-mission'} />,
    name: '重定向',
    id: 'redirect'
  },
  {
    element: <Layout routes={defineRoutes} />,
    id: 'layout',
    name: '布局',
    children: defineRoutes
  },

  {
    path: '*',
    element: <NotFound />,
    name: '404',
    id: 'notfound'
  }
]

const RouterConfig: FC = () => {
  return <Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>
}

export default RouterConfig
