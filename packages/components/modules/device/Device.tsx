import { Outlet } from 'react-router-dom'
import { I18nextPackagesProvider } from '@packages/i18n'

const Device = () => (
  <I18nextPackagesProvider>
    <Outlet />
  </I18nextPackagesProvider>
)

export default Device
