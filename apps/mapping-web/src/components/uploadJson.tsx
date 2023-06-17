import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, message, Upload, Popover } from 'antd'
import { useStore } from '../store/index'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { saveRcspoint } from '@/services'

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
          const res = JSON.parse(e.target?.result as string)
          // const {
          //   Border: { DownLeft, UpRight },
          //   Points
          // } = res
          // const CADWidth = Math.abs(UpRight.X - DownLeft.X)
          // const CADHeight = Math.abs(DownLeft.Y - UpRight.Y)
          // const resPoints: shapeItem[] = Points.map((item: any) => ({
          //   id: item.Id || item.ID,
          //   CADPosition: {
          //     x: Math.abs(item.Position.X - DownLeft.X),
          //     y: Math.abs(item.Position.Y - UpRight.Y)
          //   },
          //   canvasPosition: {
          //     x: Math.abs(item.Position.X - Math.min(DownLeft.X, UpRight.X)) * (stageWidth / CADWidth),
          //     y: Math.abs(item.Position.Y - Math.min(UpRight.Y, DownLeft.x)) * (stageHeight / CADHeight)
          //   }
          // }))
          // EditorStore.setShapesList(resPoints)
          EditorStore.setRcsData(res)
          EditorStore.clearSelectRect()
          // saveRcspoint({
          //   points: JSON.stringify({
          //     rcsData: res,
          //     shapesList: resPoints
          //   })
          // })
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
