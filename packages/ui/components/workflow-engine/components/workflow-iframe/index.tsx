import React, { memo, useContext } from 'react'
import type { FC } from 'react'
import { MWAxiosRequestConfig } from '@packages/services'
import { WorkflowConfigContext } from '../../context'
import WorkflowIframeBase, { TMessageEffectItem } from './WorkflowIframeBase'

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

  const messageEffectList: TMessageEffectItem[] = [
    {
      type: 'before-initialized',
      callback: (iframeEl) => {
        const contentWindow = iframeEl?.contentWindow
        contentWindow?.postMessage(
          {
            type: 'api',
            data: workflowApi
          },
          '*'
        )
      }
    }
  ]

  return (
    <div className="flex-1 bg-[#fbfbfb]">
      <WorkflowIframeBase
        workflowEngineUrl={workflowEngineUrl || ''}
        mode="edit"
        culture={locale || 'zh-CN'}
        workflowDefinitionId={workflowDefinitionId}
        messageEffectList={messageEffectList}
      ></WorkflowIframeBase>
    </div>
  )
}

export default memo(WorkflowIframe)
