import services from '@/services/configure';

import {
  ICreateFcuWarehouseData,
  IDeleteFcuWarehouseParams,
} from '@/services/configure/WarehouseController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Form, Modal, Space } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import useCrud from '../hooks/useCrud';

export interface UpdateFormProps {
  tenantId: string;
  updateModalVisible: boolean;
  onCancel: () => void;
}

interface IAddForm {
  warehouseId: string;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { tenantId, updateModalVisible, onCancel } = props;
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<IAddForm>();
  const [row, setRow] = useState<ConfigureApi.IWarehouseItem>();
  const [selectedRowsState, setSelectedRows] = useState<
    ConfigureApi.IWarehouseItem[]
  >([]);
  const { createFcuWarehouse, deleteFcuWarehouse } =
    services.WarehouseController;
  const { handleCreate, handleDelete } = useCrud<
    ICreateFcuWarehouseData,
    any,
    any,
    IDeleteFcuWarehouseParams
  >({
    create: createFcuWarehouse,
    delete: deleteFcuWarehouse,
  });

  const fetchWarehouseData = useCallback(
    (isFcuWarehouse = true) =>
      new Promise<ConfigureApi.IWarehouseItem[]>((resolve, reject) => {
        const { getFcuWarehouseIdList, getWarehouseList } =
          services.WarehouseController;
        Promise.all([
          getFcuWarehouseIdList(tenantId),
          getWarehouseList(tenantId),
        ])
          .then(([fcuWarehouseIdList, warehouseList]) => {
            resolve(
              warehouseList.filter((x) =>
                isFcuWarehouse
                  ? fcuWarehouseIdList.includes(x.id)
                  : !fcuWarehouseIdList.includes(x.id),
              ),
            );
          })
          .catch(reject);
      }),
    [tenantId],
  );

  const handleRemove = async (selectedRows: ConfigureApi.IWarehouseItem[]) => {
    await handleDelete({
      tenantId,
      warehouseIds: selectedRows.map((x) => x.id),
    });
  };

  const columns: ProDescriptionsItemProps<ConfigureApi.IWarehouseItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: 'id是唯一的 key',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '昵称',
      dataIndex: 'displayName',
      valueType: 'text',
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => setRow(record)}>查看</a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              await handleRemove([record]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  return (
    <Modal
      width={800}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="仓库配置"
      open={updateModalVisible}
      onCancel={onCancel}
    >
      <ProTable<ConfigureApi.IWarehouseItem>
        headerTitle="仓库列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <ModalForm<IAddForm>
            key={1}
            title="添加"
            form={form}
            width={320}
            autoFocusFirstInput
            trigger={
              <Button type="primary">
                <PlusOutlined />
                添加
              </Button>
            }
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run'),
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
              await handleCreate({
                tenantId,
                warehouseId: values.warehouseId,
              });
              actionRef.current?.reloadAndRest?.();
              return true;
            }}
          >
            <ProFormSelect
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: '仓库为必填项',
                  },
                ],
              }}
              request={async () => {
                const data = await fetchWarehouseData(false);
                return data.map((x) => ({ label: x.name, value: x.id }));
              }}
              name="warehouseId"
              label="仓库"
            />
          </ModalForm>,
        ]}
        request={async () => {
          const data = await fetchWarehouseData();

          return {
            data,
            success: true,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a
                onClick={async () => {
                  await handleRemove(selectedRowsState);
                  actionRef.current?.clearSelected?.();
                }}
              >
                批量删除
              </a>
              <a onClick={() => actionRef.current?.clearSelected?.()}>
                取消选择
              </a>
            </Space>
          );
        }}
      />
      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<ConfigureApi.IWarehouseItem>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </Modal>
  );
};

export default UpdateForm;
