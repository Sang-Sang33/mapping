import { MwDialogFormField } from 'multiway'
import { i18n } from '@packages/i18n'
const { t } = i18n
const tNs = (arg: string) =>
  t(arg, {
    ns: 'device'
  })

const fields: Array<MwDialogFormField> = [
  {
    title: tNs('addDialog.deviceName'),
    key: 'deviceName',
    required: true,
    rules: [
      {
        pattern: /^[^.]*$/,
        message: `${tNs('addDialog.deviceName') + tNs('addDialog.cannotContainDecimalPoint')}`
      }
    ]
  },
  {
    title: tNs('addDialog.functionName'),
    key: 'functionName',
    required: true,
    rules: [
      {
        pattern: /^[^.]*$/,
        message: `${tNs('addDialog.functionName') + tNs('addDialog.cannotContainDecimalPoint')}`
      }
    ]
  },
  {
    title: tNs('addDialog.behaviour'),
    type: 'switch-custom-children',
    key: 'behaviour',
    checkedChildren: tNs('addDialog.behaviourSwitchChecked'),
    unCheckedChildren: tNs('addDialog.behaviourSwitchUnChecked')
  }
]

export default fields
