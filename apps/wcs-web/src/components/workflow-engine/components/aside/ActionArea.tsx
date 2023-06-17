import React, { memo } from 'react'
import type { FC } from 'react'
import { Button, Popover } from 'antd'
import { CopyFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

interface IProps {
  onPaste?: () => void
  onExport?: () => void
  onImport?: () => void
  onCopyMulitiple?: () => void
}

const ActionArea: FC<IProps> = (props) => {
  const { onPaste, onExport, onImport, onCopyMulitiple } = props
  const { t } = useTranslation()
  const popoverContent = () => (
    <>
      <div className="flex items-center gap-3 my-2 cursor-pointer hover:text-[#13c2c2]" onClick={onImport}>
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4925"
          width="16"
          height="16"
        >
          <path
            d="M960 192H537.6c-17.066667 0-34.133333-6.4-44.8-19.2l-68.266667-68.266667c-12.8-12.8-27.733333-19.2-44.8-19.2H64C27.733333 85.333333 0 113.066667 0 149.333333v725.333334c0 36.266667 27.733333 64 64 64h896c36.266667 0 64-27.733333 64-64V256c0-36.266667-27.733333-64-64-64zM718.933333 582.4l-179.2 192c-8.533333 8.533333-19.2 12.8-32 12.8-10.666667 0-23.466667-4.266667-32-12.8l-179.2-192c-25.6-27.733333-6.4-70.4 32-70.4H426.666667v-128c0-23.466667 19.2-42.666667 42.666666-42.666667h85.333334c23.466667 0 42.666667 19.2 42.666666 42.666667v128h89.6c38.4 0 57.6 44.8 32 70.4z"
            fill="currentColor"
            p-id="4926"
          ></path>
        </svg>
        <span>{t('workflowEngine.action.import')}</span>
      </div>
      <div className="flex items-center gap-3 my-2 cursor-pointer hover:text-[#13c2c2]" onClick={onExport}>
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9630"
          width="16"
          height="16"
        >
          <path
            d="M960 938.667H64c-36.267 0-64-27.734-64-64V149.333c0-36.266 27.733-64 64-64h315.733c17.067 0 34.134 6.4 44.8 19.2L492.8 172.8c12.8 12.8 27.733 19.2 44.8 19.2H960c36.267 0 64 27.733 64 64v618.667c0 36.266-27.733 64-64 64zM539.733 354.133c-8.533-8.533-19.2-12.8-32-12.8-10.666 0-23.466 4.267-32 12.8l-179.2 192c-25.6 27.734-6.4 70.4 32 70.4h98.134v128c0 23.467 19.2 42.667 42.666 42.667h85.334c23.466 0 42.666-19.2 42.666-42.667v-128h89.6c36.267 0 55.467-44.8 32-70.4l-179.2-192z"
            p-id="9631"
            fill="currentColor"
          ></path>
        </svg>
        <span>{t('workflowEngine.action.export')}</span>
      </div>
      <div className="flex items-center gap-3 my-2 cursor-pointer hover:text-[#13c2c2]" onClick={onCopyMulitiple}>
        <CopyFilled />
        <span>{t('workflowEngine.action.copy')}</span>
      </div>
      <div className="flex items-center gap-3 my-2 cursor-pointer hover:text-[#13c2c2]" onClick={onPaste}>
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="12704"
          width="16"
          height="16"
        >
          <path
            d="M868.6592 0H392.3456A155.648 155.648 0 0 0 237.056 155.648v81.408H132.352A132.5056 132.5056 0 0 0 0 369.408v522.24A132.5056 132.5056 0 0 0 132.352 1024h522.24a132.5056 132.5056 0 0 0 132.352-132.352V786.944h79.4624c86.8864 0 157.5936-69.632 157.5936-155.2896V155.392A155.4944 155.4944 0 0 0 868.6592 0z m79.5136 631.6544c0 44.544-35.9424 79.4624-81.7664 79.4624H786.944V369.408a132.5056 132.5056 0 0 0-132.352-132.352H312.8832V155.648c0-44.032 35.6352-79.8208 79.4624-79.8208h476.3136c43.1104 0 79.5136 36.4544 79.5136 79.5648v476.2624z"
            fill="currentColor"
            p-id="12705"
          ></path>
        </svg>
        <span>{t('workflowEngine.action.paste')}</span>
      </div>
    </>
  )

  return (
    <Popover placement="top" content={popoverContent}>
      <Button type="link">{t('workflowEngine.action.title')}</Button>
    </Popover>
  )
}

export default memo(ActionArea)
