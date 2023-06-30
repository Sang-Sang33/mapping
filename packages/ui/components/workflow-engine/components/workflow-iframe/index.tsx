import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import { MWAxiosRequestConfig } from '@packages/services'
import { WorkflowConfigContext } from '../../context'
import { Loading } from '../../../loading'

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
  const [isLoading, setIsLoading] = useState(false)
  const { locale, baseUrl } = useContext(WorkflowConfigContext)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const MessageStrategy = {
    // 工作流引擎did-load之前,发送自定义的getWorkflowDefinitionApi供使用
    'before-initialized': () => {
      const contentWindow = iframeRef.current?.contentWindow
      contentWindow?.postMessage(
        {
          type: 'api',
          data: workflowApi
        },
        '*'
      )
    },
    initialized: () => setIsLoading(false)
  }

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // if (e.origin !== workflowEngineBaseUrl) return
      if (e.data.type === 'life-circle') {
        const { data } = e.data
        MessageStrategy[data as keyof typeof MessageStrategy]()
      }
    }
    workflowDefinitionId && setIsLoading(true)
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [workflowDefinitionId])

  return (
    <div className="flex-1 bg-[#fbfbfb]">
      <div className={`relative w-full h-full`}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`${baseUrl}?workflow-definition-id=${workflowDefinitionId}&culture=${locale}&use-x6-graphs=true`}
          className="block"
        ></iframe>
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <Loading></Loading>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(WorkflowIframe)
