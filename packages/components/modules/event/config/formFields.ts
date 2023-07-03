import { MwDialogFormField } from 'multiway'
import { i18n } from '@packages/i18n'
const { t } = i18n
const tNs = (arg: string) =>
  t(arg, {
    ns: 'event'
  })

const fields: Array<MwDialogFormField> = [
  {
    title: tNs('addDialog.name'),
    key: 'name',
    required: true,
    rules: [{ pattern: /^[^.]*$/, message: `${tNs('addDialog.name') + tNs('addDialog.cannotContainDecimalPoint')}` }]
  }
]

export default fields
