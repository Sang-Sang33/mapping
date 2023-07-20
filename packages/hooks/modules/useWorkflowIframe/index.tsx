import { useEffect, useMemo, useRef, useState } from 'react'

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
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: 'auto', background: 'transparent', display: 'block', shapeRendering: 'auto' }}
            width="200px"
            height="200px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <g transform="rotate(0 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.9166666666666666s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(30 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.8333333333333334s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(60 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.75s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(90 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.6666666666666666s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(120 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.5833333333333334s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(150 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.5s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(180 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.4166666666666667s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(210 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.3333333333333333s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(240 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.25s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(270 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.16666666666666666s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(300 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="-0.08333333333333333s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
            <g transform="rotate(330 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#0ababa">
                <animate
                  attributeName="opacity"
                  values="1;0"
                  keyTimes="0;1"
                  dur="1s"
                  begin="0s"
                  repeatCount="indefinite"
                ></animate>
              </rect>
            </g>
          </svg>
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
