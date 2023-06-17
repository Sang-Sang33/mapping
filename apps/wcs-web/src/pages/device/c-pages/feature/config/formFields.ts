import { MwDialogFormField } from 'multiway'
import i18n from '@/i18n'
const { t } = i18n as { t: (key: string) => string }

const fields: Array<MwDialogFormField> = [
  {
    title: t('device.addDialog.deviceName'),
    key: 'deviceName',
    required: true,
    rules: [
      {
        pattern: /^[^.]*$/,
        message: `${t('device.addDialog.deviceName') + t('device.addDialog.cannotContainDecimalPoint')}`
      }
    ]
  },
  {
    title: t('device.addDialog.functionName'),
    key: 'functionName',
    required: true,
    rules: [
      {
        pattern: /^[^.]*$/,
        message: `${t('device.addDialog.functionName') + t('device.addDialog.cannotContainDecimalPoint')}`
      }
    ]
  },
  {
    title: t('device.addDialog.behaviour'),
    type: 'switch-custom-children',
    key: 'behaviour',
    checkedChildren: t('device.addDialog.behaviourSwitchChecked'),
    unCheckedChildren: t('device.addDialog.behaviourSwitchUnChecked')
  }
]

export default fields
