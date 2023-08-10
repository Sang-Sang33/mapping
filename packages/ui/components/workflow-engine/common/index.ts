import { i18n } from '@packages/i18n'
import { message } from 'antd'
import { TOptions } from 'i18next'
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
const t = (key: string, options: TOptions = { ns: 'workflowEngine' }) => i18n.t(key, options)

class MessageManager {
  messageMap = {
    delete_success: () => success(t('action.deleteSuccess')),
    add_success: () => success(t('action.addSuccess')),
    update_success: () => success(t('action.updateSuccess')),
    copy_success: (message: string) => success(t('action.copySuccess') + `"${message}"`),
    paste_null: () => warn(t('action.pasteNull')),
    paste_invalid: (from: string, to: string) =>
      warn(`"${t('title', { ns: from })}"${t('action.pasteInvalid')}"${t('title', { ns: to })}"`),
    import_invalid: (from: string, to: string) =>
      warn(`"${t('title', { ns: from })}"${t('action.importInvalid')}"${t('title', { ns: to })}"`),
    delete_cancel: () => warn(t('action.deleteCancel')),
    file_invalid: () => error(t('action.fileInvalid')),
    paste_success: () => success(t('action.pasteSuccess')),
    import_success: () => success(t('action.importSuccess')),
    select_null: () => warn(t('action.selectNull'))
  }

  showMessage: <T extends keyof MessageManager['messageMap']>(key: T) => MessageManager['messageMap'][T] = (key) =>
    this.messageMap[key]
}

export const { showMessage } = new MessageManager()
