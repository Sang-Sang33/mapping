import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Table, InputNumber, Form, Button } from 'antd';

const EditHeightTable = (props: { layer: number, defaultValues?: Record<string, any> }, ref) => {
    const { layer } = props
    useEffect(() => {
        const list = []
        for (let i = 0; i < layer; i++) {
            list.push({ index: i + 1, high: undefined, low: undefined })
        }
        setData(list)
    }, [layer])
    const [data, setData] = useState<Record<string, any>>([]);

    const [form] = Form.useForm();

    const getValues = () => {
        return form.getFieldsValue(); // 获取所有字段的值
    };

    const setValues = (data: any) => {
        form.setFieldsValue(data)
    }

    const reset = () => {
        form.resetFields()
        setData([])
    }

    useImperativeHandle(ref, () => ({
        getValues,
        reset,
        setValues
    }));

    const columns = [
        {
            title: '层',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: '叉臂举升高度',
            dataIndex: 'high',
            key: 'high',
            editable: true, // 可编辑列
            render: (text, record) => (
                <Form.Item
                    name={['high', record.index]}
                    initialValue={text}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
            ),
        },
        {
            title: '叉臂下降高度',
            dataIndex: 'low',
            key: 'low',
            editable: true, // 可编辑列
            render: (text, record) => (
                <Form.Item
                    name={['low', record.index]}
                    initialValue={text}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
            ),
        }
    ];

    return (
        <>
            <Form component={false} form={form}>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="index"
                    pagination={false}
                    bordered
                />
            </Form>
            <div style={{ height: '20px' }}></div>
        </>
    );
};

export default forwardRef(EditHeightTable)