import React, { memo } from 'react'
import type { FC } from 'react'
import { Event as EventComponent } from '@packages/components'

const Event: FC = () => {
  return (
    <EventComponent
      workflowEngineUrl={import.meta.env.VITE_WORKFLOW_ENGINE_URL || 'http://120.79.85.168:6034'}
    ></EventComponent>
  )
}

export default memo(Event)
