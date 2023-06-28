import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Result, Button } from 'antd'
import { I18nextPackagesProvider } from '@packages/i18n'

const NotFound: FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation(['notFound'])
  const backHome = () => {
    navigate('/', { replace: true })
  }
  return (
    <I18nextPackagesProvider>
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
    </I18nextPackagesProvider>
  )
}
export default NotFound
