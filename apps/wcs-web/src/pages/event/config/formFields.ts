import { MwDialogFormField } from 'multiway'
import i18n from '@/i18n'
const { t } = i18n as { t: (key: string) => string }

const fields: Array<MwDialogFormField> = [
  {
    title: t('event.addDialog.name'),
    key: 'name',
    required: true,
    rules: [
      { pattern: /^[^.]*$/, message: `${t('event.addDialog.name') + t('event.addDialog.cannotContainDecimalPoint')}` }
    ]
  }
]

export default fields
