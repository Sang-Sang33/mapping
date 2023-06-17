import { createContext } from 'react'

interface IWorkflowConfig {
  locale: string
  canInteract: boolean
  setCanInteract: React.Dispatch<React.SetStateAction<boolean>>
  menuListDesignHeight: number
  menuItemHeight: number
}

const WorkflowConfigContext = createContext<Partial<IWorkflowConfig>>({
  locale: 'zh-CN',
  canInteract: true,
  menuListDesignHeight: 886,
  menuItemHeight: 50
})

export { WorkflowConfigContext }
