import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
import { Event as EventComponent } from '@packages/components'

interface IProps {
  children?: ReactNode
}

const Event: FC<IProps> = (props) => {
  return <EventComponent workflowEngineUrl="http://120.79.85.168:6034" baseUrl="/api/fcu"></EventComponent>
}

export default memo(Event)
