import { useEffect, useState } from 'react'

import {
  formatDate,
  getCultureIC,
  getLocalLibLocale,
  getTenantIdIC,
  getTokenIC,
  getWarehouseIdIC,
  redirectToSSO
} from '@packages/utils'
import { useNavigate } from 'react-router-dom'
import { Loading } from '@packages/ui'
import { Button } from 'antd'
import './style.css'

function Home() {
  const [count, setCount] = useState(0)
  const [date, setDate] = useState(Date.now())
  useEffect(() => {
    setInterval(() => {
      setDate(Date.now())
    }, 1000)
  }, [])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="home">
      <p>
        <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
      </p>
      <p>
        <Button onClick={() => redirectToSSO('http://sso.multiway-cloud.com')}>单点登录</Button>
      </p>
      <p
        style={{
          width: '50%',
          overflow: 'hidden',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      >
        当前Cookie Token: {getTokenIC()}
      </p>
      <p>当前租户ID: {getTenantIdIC()}</p>
      <p>当前仓库ID: {getWarehouseIdIC()}</p>
      <p>当前文化: {getCultureIC()}</p>
      <p>当前第三方库语言环境: multiway: {getLocalLibLocale('multiway') as string}</p>
      <p>当前时间: {formatDate(date)}</p>
      <p>
        <Button onClick={() => navigate('/404')}>go to 404</Button>
      </p>
      <p>
        <Button onClick={() => setIsLoading(!isLoading)}>{isLoading ? '隐藏' : '显示'}loading</Button>
      </p>
      <div style={{ position: 'relative', width: '100px', height: '20px' }}>{isLoading && <Loading />}</div>
      <p>
        <Button onClick={() => navigate('/wcs')}>go to wcs</Button>
      </p>
    </div>
  )
}

export default Home
