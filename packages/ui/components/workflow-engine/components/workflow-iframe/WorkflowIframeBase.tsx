import { ReactNode, memo, useEffect, useRef, useState } from 'react'
import { Loading } from '../../../loading'

export type TMessageEffectItem = { type: string; callback: (iframeEl: HTMLIFrameElement | null) => any }

interface IWorkflowIframeBaseProps {
  workflowEngineUrl: string
  mode: 'view' | 'edit'
  culture: string
  workflowInstanceId?: string
  workflowDefinitionId?: string
  useX6Graphs?: boolean
  Loading?: ReactNode
  messageEffectList?: TMessageEffectItem[]
}

type TOptionsKey = Exclude<keyof IWorkflowIframeBaseProps, 'workflowEngineUrl' | 'Loading' | 'messageEffectList'>
const OptionsKeyMap: Record<TOptionsKey, string> = {
  mode: 'mode',
  culture: 'culture',
  workflowInstanceId: 'workflow-instance-id',
  workflowDefinitionId: 'workflow-definition-id',
  useX6Graphs: 'use-x6-graphs'
}

// 与WorkflowIframe之间的消息通信策略
const MessageStrategy: Record<string, (iframeEl: HTMLIFrameElement | null) => any> = {}

/**
 * @description: 订阅消息
 * @param {string} type 消息类型
 * @param {function} callback 接收到消息执行的回调
 * @return {*}
 */
const subscribeMessage = (type: string, callback: (iframeEl: HTMLIFrameElement | null) => any) => {
  MessageStrategy[type] = callback
}

const WorkflowIframeBase = (props: IWorkflowIframeBaseProps) => {
  console.log('re-render')
  const {
    workflowEngineUrl = '',
    mode = 'edit',
    culture = 'zh-CN',
    useX6Graphs = true,
    workflowDefinitionId = '',
    workflowInstanceId = '',
    messageEffectList = []
  } = props
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const options: Record<TOptionsKey, any> = {
    mode,
    culture,
    useX6Graphs,
    workflowDefinitionId,
    workflowInstanceId
  }
  const queryString = (Object.keys(options) as TOptionsKey[])
    .map((key) => `${encodeURIComponent(OptionsKeyMap[key])}=${encodeURIComponent(options[key])}`)
    .join('&')

  subscribeMessage('initialized', () => setIsLoading(false))
  messageEffectList.forEach((m) => subscribeMessage(m.type, m.callback))

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'life-circle') {
        const { data } = e.data
        MessageStrategy[data as keyof typeof MessageStrategy](iframeRef.current)
      }
    }
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  useEffect(() => {
    if (mode === 'edit' && workflowDefinitionId) {
      setIsLoading(true)
    }
  }, [workflowDefinitionId])
  useEffect(() => {
    if (mode === 'view' && workflowInstanceId) {
      setIsLoading(true)
    }
  }, [workflowInstanceId])
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        ref={iframeRef}
        width="100%"
        height="100%"
        src={`${workflowEngineUrl}?${queryString}`}
        style={{ display: 'block' }}
      ></iframe>
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <Loading></Loading>
        </div>
      )}
    </div>
  )
}

export default memo(WorkflowIframeBase)
