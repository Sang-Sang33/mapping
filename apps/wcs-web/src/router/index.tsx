import { type FC, lazy, Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { type TLayoutRoutes } from '@packages/types'
import { Loading } from '@packages/ui'
import { IconFont } from '@/components/Icon'
import i18n from '@/i18n'

const { t } = i18n

const Layout = lazy(() => import('@/components/layout'))
const NotFound = lazy(() => import('@packages/ui/components/404/NotFound'))
const WMSMission = lazy(() => import('@/pages/wmsMission'))
const RCSMission = lazy(() => import('@/pages/rcsMission'))
const MissionProcess = lazy(() => import('@/pages/missionProcess'))
const Device = lazy(() => import('@/pages/device'))
const Feature = lazy(() => import('@/pages/device/c-pages/feature'))
const Status = lazy(() => import('@/pages/device/c-pages/status'))
const Event = lazy(() => import('@/pages/event'))

const defineRoutes: TLayoutRoutes = [
  {
    path: 'wms-mission',
    element: <WMSMission />,
    name: t('aside.wmsMission.nav'),
    id: 'wms-mission',
    icon: <IconFont type="icon-WMSrizhi"></IconFont>
  },
  {
    path: 'rcs-mission',
    element: <RCSMission />,
    name: t('aside.rcsMission.nav'),
    id: 'rcs-mission',
    icon: <IconFont type="icon-RCS"></IconFont>
  },
  {
    path: 'mission-process',
    element: <MissionProcess />,
    name: t('aside.missionProcess.nav'),
    id: 'mission-process',
    icon: <IconFont type="icon-renwuchuli"></IconFont>
  },
  {
    path: 'device',
    element: <Device />,
    name: t('aside.device.nav'),
    id: 'device',
    icon: <IconFont type="icon-device"></IconFont>,
    children: [
      {
        path: 'feature',
        element: <Feature />,
        name: t('aside.device.feature.nav'),
        id: 'feature',
        icon: <IconFont type="icon-shebeigongnengguanli"></IconFont>
      },
      {
        path: 'status',
        element: <Status />,
        name: t('aside.device.status.nav'),
        id: 'status',
        icon: <IconFont type="icon-shebeizhuangtai"></IconFont>
      }
    ]
  },
  {
    path: 'event',
    element: <Event />,
    name: t('aside.event.nav'),
    id: 'event',
    icon: <IconFont type="icon-shijian"></IconFont>
  },
  {
    name: t('aside.logs.nav'),
    id: 'log',
    icon: <IconFont type="icon-rizhi"></IconFont>,
    url: 'http://dev.multiway-cloud.com:25009/#/'
  }
]

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
