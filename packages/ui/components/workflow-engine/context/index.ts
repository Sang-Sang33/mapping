import { createContext } from 'react'

interface IWorkflowConfig {
  locale: string
  canInteract: boolean
  setCanInteract: React.Dispatch<React.SetStateAction<boolean>>
  menuListDesignHeight: number
  menuItemHeight: number
  workflowEngineUrl: string
}

const WorkflowConfigContext = createContext<Partial<IWorkflowConfig>>({
  locale: 'zh-CN',
  canInteract: true,
  menuListDesignHeight: 886,
  menuItemHeight: 50,
  workflowEngineUrl: 'http://120.79.85.168:6034'
})

export { WorkflowConfigContext }
