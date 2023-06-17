import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Modal, Space, message, Button } from 'antd';
import { useStore } from "@/store/index";
import { observer } from "mobx-react-lite";
import { getWarehouse, editWarehouse, delWarehouse, addWarehouse } from '@/services'
import { useRequest } from 'ahooks';

interface Item {
    name: string;
    id: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const EditWarehouse: React.FC = () => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const { EditorStore } = useStore()
    const { editWarehouseShow } = EditorStore
    const [data, setData] = useState<Item[]>([])

    const { run } = useRequest(getWarehouse, { manual: true, onSuccess: (res) => setData(res) })

    useEffect(() => {
        if (editWarehouseShow) run()
    }, [editWarehouseShow])

    const isEditing = (record: Item) => record.id === editingKey;

    const edit = (record: Item) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const handleDel = async (record: Item) => {
        try {
            await delWarehouse({ id: record.id })
            message.success('删除成功')
            run()
        } catch (e) {
            message.error(e)
        }
    }

    const handleAdd = () => {
        const id = 'add-' + new Date().getTime()
        setData([...data, { name: '', id }])
        form.setFieldsValue({ name: '', id })
        setEditingKey(id);
    }

    const cancel = (record: Item) => {
        setEditingKey('');
        if (record.id.includes('add')) {
            const newData = data.slice(0, data.length - 1)
            setData(newData)
        }
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Item;
            try {
                if (!/add/.test(key as string)) {
                    await editWarehouse({ ...row, id: key })
                    message.success('编辑成功')
                } else {
                    await addWarehouse({ name: row.name })
                    message.success('新增成功')
                }
                run()
                setEditingKey('');
            } catch (e) {
                message.error(e)
            }

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: '仓库名',
            dataIndex: 'name',
            width: '80%',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                            保存
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
                            <a>取消</a>
                        </Popconfirm>
                    </Space>
                ) : (
                    <Space>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            编辑
                        </Typography.Link>
                        <Popconfirm title="确定删除？" onConfirm={() => handleDel(record)}>
                            <a>删除</a>
                        </Popconfirm>
                    </Space>

                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleCancel = () => {
        EditorStore.setEditWarehouseShow(false);
    };

    return (
        <Modal title="仓库" open={editWarehouseShow} onCancel={handleCancel} width={700} footer={null}>
            <Button type="primary" style={{ marginBottom: '10px' }} onClick={handleAdd} disabled={!!editingKey}>新增</Button>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data || []}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                />
            </Form>
        </Modal >
    );
};

export default observer(EditWarehouse);