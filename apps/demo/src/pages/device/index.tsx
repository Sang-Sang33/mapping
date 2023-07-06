import React, { memo } from 'react'
import type { FC } from 'react'
import { Device as DeviceComponent } from '@packages/components'

const Device: FC = () => {
  return <DeviceComponent></DeviceComponent>
}

export default memo(Device)
