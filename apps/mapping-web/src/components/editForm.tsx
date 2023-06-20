import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { useStore } from "../store/index";
import { observer } from "mobx-react-lite";
import { getUniqueId } from '../utils'
import { useEffect, useRef, useState } from 'react';
import CustomSelect from './customSelect';
import EditHeightTable from './editHeightTable';

const { Option } = Select;

function EditForm() {
    const [form] = Form.useForm();
    const { EditorStore } = useStore()
    const { selectRect, checkedMenu, editColor, editingRectName, selectedRectList, drawerOpen } = EditorStore
    const vehicleTypesRef = useRef()
    const stagingPointsRef = useRef()
    const transferLocationRef = useRef()
    const editHeightTableRef = useRef()
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
            form.setFieldsValue({})
        } else {
            const editingRect = selectedRectList.find((item) => item.name === editingRectName)
            setInitialValues({ ...editingRect })
            form.setFieldsValue({ ...editingRect })
            if (checkedMenu === 'tier') {
                editHeightTableRef.current.setValues({ high: [undefined, ...editingRect.highList], low: [undefined, ...editingRect.lowList] })
            }
        }
    }, [editingRectName, drawerOpen])

    useEffect(() => {
        if (!drawerOpen) {
            form.resetFields();
            setTierNumber(0)
            editHeightTableRef?.current?.reset()
        }
    }, [drawerOpen])

    const handleConfirm = (values: any) => {
        const data: Record<string, any> = { ...values }
        if (checkedMenu === 'location') {
            data.vehicleTypes = vehicleTypesRef.current.state.value
        } else if (checkedMenu === 'tier') {
            const height = editHeightTableRef.current.getValues()
            data.highList = height.high.slice(1)
            data.lowList = height.low.slice(1)
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
    }
    const [tierNumber, setTierNumber] = useState(0)
    const handleLayerChange = (e) => {
        setTierNumber(e.target.value)
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
                    <InputNumber min={1} onBlur={(e) => handleLayerChange(e)} />
                </Form.Item>
                <EditHeightTable layer={tierNumber || initialValues.tierNumber} ref={editHeightTableRef} />
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