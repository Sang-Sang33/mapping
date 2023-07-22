import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, message, Upload, Popover } from 'antd'
import { useStore } from '../store/index'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

function uploadBackground() {
    const { EditorStore } = useStore()

    const props = useMemo(
        (): UploadProps => ({
            accept: '.bmp,.jpg,.png',
            showUploadList: false,
            beforeUpload: async (file) => {
                const reader = new FileReader()
                reader.addEventListener(
                    "load",
                    () => {
                        EditorStore.setBackgroundImage(reader.result)
                    },
                    false,
                );
                reader.readAsDataURL(file);
                return false
            }
        }),
        []
    )

    return (
        <Upload {...props}>
            <Button icon={<UploadOutlined />}>背景图</Button>
        </Upload>
    )
}

export default observer(uploadBackground)
