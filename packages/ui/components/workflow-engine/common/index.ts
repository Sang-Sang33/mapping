import { i18n } from '@packages/i18n'
import { message } from 'antd'
import { MwDialogFormField } from 'multiway'

export interface IDefaultDialogFormProps {
  visible: boolean
  initialValues: any
  mode: 'add' | 'update' | 'view'
  spinning: boolean
  title?: string
  fields?: MwDialogFormField[]
}

export const defaultDialogProps: IDefaultDialogFormProps = {
  // 是否可见
  visible: false,
  // 弹窗默认值
  initialValues: {},
  // 模式， view 模式下表格会只读
  mode: 'add',
  // 是否正在加载
  spinning: false
}

export enum WorkflowTypeEnum {
  MISSION_PROCESS = 'missionProcess',
  DEVICE = 'device',
  FUNCTION = 'function',
  EVENT = 'event'
}

const { error, success, warn } = message
const { t } = i18n

class MessageManager {
  messageMap = {
    delete_success: () => success(t('workflowEngine.action.deleteSuccess')),
    add_success: () => success(t('workflowEngine.action.addSuccess')),
    update_success: () => success(t('workflowEngine.action.updateSuccess')),
    copy_success: (message: string) => success(t('workflowEngine.action.copySuccess') + message),
    paste_null: () => warn(t('workflowEngine.action.pasteNull')),
    paste_invalid: (from: string, to: string) =>
      warn(`"${t(from + '.title')}"${t('workflowEngine.action.pasteInvalid')}"${t(to + '.title')}"`),
    import_invalid: (from: string, to: string) =>
      warn(`"${t(from + '.title')}"${t('workflowEngine.action.importInvalid')}"${t(to + '.title')}"`),
    delete_cancel: () => warn(t('workflowEngine.action.deleteCancel')),
    file_invalid: () => error(t('workflowEngine.action.fileInvalid')),
    paste_success: () => success(t('workflowEngine.action.pasteSuccess')),
    import_success: () => success(t('workflowEngine.action.importSuccess')),
    select_null: () => warn(t('workflowEngine.action.selectNull'))
  }

  showMessage: <T extends keyof MessageManager['messageMap']>(key: T) => MessageManager['messageMap'][T] = (key) =>
    this.messageMap[key]
}

export const { showMessage } = new MessageManager()
