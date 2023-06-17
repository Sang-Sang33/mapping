import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'

const NotFound: FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation(['notFound'])
  const backHome = () => {
    navigate('/', { replace: true })
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('subTitle')}
      extra={
        <Button type="primary" onClick={backHome}>
          {t('backHome')}
        </Button>
      }
    />
  )
}
export default NotFound
