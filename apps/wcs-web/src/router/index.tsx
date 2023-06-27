import { Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'
import { Loading } from '@packages/ui'
import Auth from '@/components/auth'
import lazyLoad from '@/router/utils/lazyLoad'
import { getNewToken, redirectToSso } from '@/utils/token'

function RouterConfig() {
  function getRoute(routes: any[]) {
    if (!getNewToken()) redirectToSso() // 没token直接跳单点

    return (
      <>
        {routes?.map((item) => (
          <Route
            path={item.path}
            element={
              item.name === 'login' || item.name === '404' ? (
                <item.component />
              ) : (
                <Auth>{lazyLoad(item.component)}</Auth>
              )
            }
            key={item.name}
          >
            {item.children && getRoute(item.children)}
          </Route>
        ))}
      </>
    )
  }
  console.log(getRoute(routes))

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>{getRoute(routes)}</Routes>
      </Suspense>
    </Router>
  )
}

export default RouterConfig
