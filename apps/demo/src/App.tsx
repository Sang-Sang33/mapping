import { Suspense, memo } from 'react'
import type { FC } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './router'
import { Loading } from 'ui'

const App: FC = () => {
  return <Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>
}

export default memo(App)
