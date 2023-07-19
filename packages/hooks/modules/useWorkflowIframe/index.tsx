import { useEffect, useMemo, useRef, useState } from 'react'
import { Loading } from '@packages/ui'

export interface IOptions extends Record<string, any> {
  mode: 'view' | 'edit'
  culture: string
  workflowInstanceId?: string
  workflowDefinitionId?: string
  useX6Graphs?: boolean
}

const OptionsKeyMap: Record<keyof IOptions, string> = {
  mode: 'mode',
  culture: 'culture',
  workflowInstanceId: 'workflow-instance-id',
  workflowDefinitionId: 'workflow-definition-id',
  useX6Graphs: 'use-x6-graphs'
}

const defaultOptions = {
  mode: 'edit',
  culture: 'zh_CN',
  useX6Graphs: true,
  workflowDefinitionId: '',
  workflowInstanceId: ''
}

const useWorkflowIframe = (workflowEngineUrl: string, options: IOptions) => {
  const mergeOptions: IOptions = { ...defaultOptions, ...options }
  const { workflowDefinitionId, workflowInstanceId, mode } = mergeOptions
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const queryString = useMemo(
    () =>
      Object.keys(mergeOptions)
        .map((key) => `${encodeURIComponent(OptionsKeyMap[key])}=${encodeURIComponent(mergeOptions[key])}`)
        .join('&'),
    [mergeOptions]
  )

  const MessageStrategy: Record<string, (iframeEl: HTMLIFrameElement | null) => any> = {
    initialized: () => setIsLoading(false)
  }
  const registerMessage = (type: string, callback: (iframeEl: HTMLIFrameElement | null) => any) => {
    MessageStrategy[type] = callback
  }

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

  const WorkflowIframe = () => (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        ref={iframeRef}
        width="100%"
        height="100%"
        src={`${workflowEngineUrl}?${queryString}`}
        style={{ display: 'block' }}
      ></iframe>
      {isLoading && (
        <div
          // className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%'
          }}
        >
          <Loading></Loading>
        </div>
      )}
    </div>
  )

  return {
    WorkflowIframe,
    registerMessage
  }
}

export default useWorkflowIframe
