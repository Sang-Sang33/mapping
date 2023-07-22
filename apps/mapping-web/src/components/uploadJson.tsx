import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, message, Upload, Popover } from 'antd'
import { useStore } from '../store/index'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { saveRcspoint } from '@/services'
import { isJsonString } from '@/utils'

function UploadJson() {
  const { EditorStore } = useStore()
  const { stageWidth, stageHeight, shapesList } = EditorStore

  const props = useMemo(
    (): UploadProps => ({
      accept: '.json',
      showUploadList: false,
      beforeUpload: async (file) => {
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = function (e) {
          if (!isJsonString(e.target?.result)) return message.error('文件格式不正确！')
          const res = JSON.parse(e.target?.result as string)
          EditorStore.setRcsData(res)
          EditorStore.clearSelectRect()
          saveRcspoint({
            points: JSON.stringify({
              rcsData: res
            })
          })
        }
        return false
      }
    }),
    [stageWidth, stageHeight]
  )

  return (
    <Upload {...props}>
      {shapesList.length ? (
        <Popover placement="bottom" content="重新导入会丢失原有的数据" title="提示">
          <Button icon={<UploadOutlined />}>导入</Button>
        </Popover>
      ) : (
        <Button icon={<UploadOutlined />}>导入</Button>
      )}
    </Upload>
  )
}

export default observer(UploadJson)
