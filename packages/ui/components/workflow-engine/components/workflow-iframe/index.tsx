import React, { memo, useContext } from 'react'
import type { FC } from 'react'
import { MWAxiosRequestConfig } from '@packages/services'
import { WorkflowConfigContext } from '../../context'
import { Loading } from '../../../loading'
import useWorkflowIframe from '../../hooks/useWorkflowIframe'

interface IProps {
  workflowDefinitionId: string
  workflowApi: {
    [key: string]: {
      [key: string]: MWAxiosRequestConfig
    } // workflow api的request config, 用来控制elsa-designer发起请求
  }
}

const WorkflowIframe: FC<IProps> = (props) => {
  const { workflowDefinitionId, workflowApi } = props
  const { locale, workflowEngineUrl } = useContext(WorkflowConfigContext)
  const { subscribeMessage, WorkflowIframe } = useWorkflowIframe(workflowEngineUrl || '', <Loading></Loading>)

  subscribeMessage('before-initialized', (iframeEl) => {
    const contentWindow = iframeEl?.contentWindow
    contentWindow?.postMessage(
      {
        type: 'api',
        data: workflowApi
      },
      '*'
    )
  })

  return (
    <div className="flex-1 bg-[#fbfbfb]">
      <WorkflowIframe
        mode="edit"
        culture={locale || 'zh-CN'}
        workflowDefinitionId={workflowDefinitionId}
      ></WorkflowIframe>
    </div>
  )
}

export default memo(WorkflowIframe)
