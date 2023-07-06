import { Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'
import lazyLoad from '@/router/utils/lazyLoad'
import { redirectToSSO, getTokenIC } from '@packages/utils'
function RouterConfig() {
  if (!getTokenIC()) redirectToSSO(import.meta.env.DEV ? 'http://sso.multiway-cloud.com' : '/sso')
  return (
    <Router>
      <Suspense>
        <Routes>
          {routes?.map((item) => {
            return (
              <Route path={item.path} element={lazyLoad(item.component)} key={item.name}>
                {item.children?.map((child) => {
                  return <Route path={child.path} element={lazyLoad(child.component)} key={child.name} />
                })}
              </Route>
            )
          })}
        </Routes>
      </Suspense>
    </Router>
  )
}

export default RouterConfig
