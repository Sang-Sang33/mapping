import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'
import Loading from '@/components/loading'
import Auth from '@/components/auth'
import lazyLoad from '@/router/utils/lazyLoad'

function RouterConfig() {
  function getRoute(routes: any[]) {
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
    <Router basename={import.meta.env.DEV ? '/' : '/sso'}>
      <Suspense fallback={<Loading />}>
        <Routes>{getRoute(routes)}</Routes>
      </Suspense>
    </Router>
  )
}

export default RouterConfig
