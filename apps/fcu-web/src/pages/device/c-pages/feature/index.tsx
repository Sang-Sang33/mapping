import React, { memo } from 'react'
import type { FC } from 'react'
import { Feature as FeatureComponent } from '@packages/components'

const Feature: FC = () => {
  return (
    <FeatureComponent
      baseUrl="/api/fcu"
      workflowEngineUrl={import.meta.env.VITE_WORKFLOW_ENGINE_URL || 'http://120.79.85.168:6034'}
    ></FeatureComponent>
  )
}

export default memo(Feature)
