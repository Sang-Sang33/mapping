import React, { memo } from 'react'
import type { FC } from 'react'
import { Status as StatusComponent } from '@packages/components'

const Status: FC = () => {
  return <StatusComponent baseUrl="/api/fcu"></StatusComponent>
}

export default memo(Status)