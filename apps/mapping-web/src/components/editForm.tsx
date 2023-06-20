import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { useStore } from "../store/index";
import { observer } from "mobx-react-lite";
import { getUniqueId } from '../utils'
import { useEffect, useRef, useState } from 'react';
import CustomSelect from './customSelect';

const { Option } = Select;

function EditForm() {
    const [form] = Form.useForm();
    const { EditorStore } = useStore()
    const { selectRect, checkedMenu, editColor, editingRectName, selectedRectList } = EditorStore
    const vehicleTypesRef = useRef()
    const highListRef = useRef()
    const lowListRef = useRef()
    const stagingPointsRef = useRef()
    const transferLocationRef = useRef()
    const [initialValues, setInitialValues] = useState<Record<string, any>>({
        areaNumber: undefined,
        tunnelNumber: undefined,
        rowNumber: undefined,
        start: undefined,
        direction: undefined,
        vehicleTypes: undefined,
        tierNumber: undefined,
        highList: undefined,
        lowList: undefined,
        transferZonesNumber: undefined,
        stagingPointsList: undefined,
        vehicleTypePairs: undefined
    })

    useEffect(() => {
        if (!editingRectName) {
            setInitialValues({})
        } else {
            const editingRect = selectedRectList.find((item) => item.name === editingRectName)
            setInitialValues({ ...editingRect })
        }
        setTimeout(() => {
            form.resetFields();
        }, 0);
    }, [editingRectName])

    const handleConfirm = (values: any) => {
        const data: Record<string, any> = { ...values }
        if (checkedMenu === 'location') {
            data.vehicleTypes = vehicleTypesRef.current.state.value
        } else if (checkedMenu === 'tier') {
            const highList = highListRef.current.state.value
            const lowList = lowListRef.current.state.value
            if (highList.length !== data.tierNumber) return message.error('每层最高高度数量应与层数保持一致！')
            if (lowList.length !== data.tierNumber) return message.error('每层最低高度数量应与层数保持一致！')
            data.highList = highList
            data.lowList = lowList
        } else if (checkedMenu === 'stagingPoints') {
            data.stagingPointsList = stagingPointsRef.current.state.value
        } else if (checkedMenu === 'transferLocation') {
            data.vehicleTypePairs = transferLocationRef.current.state.value
        }
        if (editingRectName) {
            let cur = selectedRectList.find((item) => item.name === editingRectName)
            cur = { ...cur, ...data }
            const list = selectedRectList.filter((item) => item.name !== editingRectName).concat(cur)
            EditorStore.replaceSelectRect(list)
        } else {
            EditorStore.pushSelectedRect({ ...selectRect, name: getUniqueId(), type: checkedMenu, strokeColor: editColor[checkedMenu], ...data })
        }

        EditorStore.setDrawerOpen(false)
        form.resetFields();
    }
    return <Form
        form={form}
        labelCol={{ flex: '110px' }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        colon={false}
        style={{ maxWidth: 600 }}
        onFinish={handleConfirm}
        initialValues={initialValues}
    >
        {
            checkedMenu === 'area' && <Form.Item label="区域编号" name="areaNumber" rules={[{ required: true, message: '区域编号必填' }]}>
                <Input />
            </Form.Item>
        }
        {
            checkedMenu === 'tunnel' && <Form.Item label="巷道编号" name="tunnelNumber" rules={[{ required: true, message: '巷道编号必填' }]}>
                <Input />
            </Form.Item>
        }
        {
            checkedMenu === 'location' && <>
                <Form.Item label="排编号" name="rowNumber" rules={[{ required: true, message: '排编号必填' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="起始点" name="start" rules={[{ required: true, message: '起始点必填' }]}>
                    <Select>
                        <Option value="leftTop">左上</Option>
                        <Option value="rightTop">右上</Option>
                        <Option value="leftBottom">左下</Option>
                        <Option value="rightBottom">右下</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="列方向" name="direction" rules={[{ required: true, message: '列方向必填' }]}>
                    <Select>
                        <Option value="row">横向</Option>
                        <Option value="col">纵向</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="车型" name="vehicleTypes">
                    <CustomSelect ref={vehicleTypesRef} defaultValues={initialValues.vehicleTypes}></CustomSelect>
                </Form.Item>
            </>
        }
        {
            checkedMenu === 'tier' && <>
                <Form.Item label="层数" name="tierNumber" rules={[{ required: true, message: '层数必填' }]}>
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="每层最高高度" name="highList">
                    <CustomSelect ref={highListRef} defaultValues={initialValues.highList}></CustomSelect>
                </Form.Item>
                <Form.Item label="每层最低高度" name="lowList">
                    <CustomSelect ref={lowListRef} defaultValues={initialValues.lowList}></CustomSelect>
                </Form.Item>
            </>
        }
        {
            checkedMenu === 'transferZones' && <>
                <Form.Item label="接驳区编号" name="transferZonesNumber" rules={[{ required: true, message: '接驳区编号必填' }]}>
                    <Input />
                </Form.Item>
            </>
        }
        {
            checkedMenu === 'stagingPoints' && <>
                <Form.Item label="待命点编号" name="stagingPointsList">
                    <CustomSelect ref={stagingPointsRef} defaultValues={initialValues.stagingPointsList}></CustomSelect>
                </Form.Item>
            </>
        }
        {
            checkedMenu === 'transferLocation' && <>
                <Form.Item label="车型" name="vehicleTypePairs">
                    <CustomSelect ref={transferLocationRef} inputLen={2} defaultValues={initialValues.vehicleTypePairs}></CustomSelect>
                </Form.Item>
            </>
        }
        <Form.Item wrapperCol={{ offset: 8 }}>
            <Button type="primary" htmlType="submit">
                确定
            </Button>
        </Form.Item>
    </Form>
}

export default observer(EditForm)