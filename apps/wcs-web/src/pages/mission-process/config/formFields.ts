import { MwDialogFormField } from 'multiway'
import i18n from '@/i18n'
const { t } = i18n as { t: (key: string) => string }

const fields: Array<MwDialogFormField> = [
  {
    title: t('missionProcess.addDialog.name'),
    type: 'select',
    key: 'name',
    required: true
  }
]

export default fields
