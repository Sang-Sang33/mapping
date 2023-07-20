import React, { memo } from 'react'
import type { FC } from 'react'
import { Instance as InstanceComponent } from '@packages/components'

const Instance: FC = () => {
  return (
    <InstanceComponent
      workflowEngineUrl={import.meta.env.VITE_WORKFLOW_ENGINE_URL || 'http://120.79.85.168:6034'}
    ></InstanceComponent>
  )
}

export default memo(Instance)
