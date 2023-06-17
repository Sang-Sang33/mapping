import services from '@/services/configure';
import {
  ICreateFcuTenantData,
  TDeleteFcuTenantIds,
} from '@/services/configure/TenantController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Form, Space } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import useCrud from './hooks/useCrud';

const fetchTenantData = (isFcuTenant = true) =>
  new Promise<ConfigureApi.ITenantItem[]>((resolve, reject) => {
    const { getFcuTenantIdList, getTenantList } = services.TenantController;
    Promise.all([getFcuTenantIdList(), getTenantList()])
      .then(([fcuTenantIdList, tenantList]) => {
        resolve(
          tenantList.filter((x) =>
            isFcuTenant
              ? fcuTenantIdList.includes(x.id)
              : !fcuTenantIdList.includes(x.id),
          ),
        );
      })
      .catch(reject);
  });
const TableList: React.FC<unknown> = () => {
  const [form] = Form.useForm<ICreateFcuTenantData>();
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [editTenantId, setEditTenantId] = useState('');
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<ConfigureApi.ITenantItem>();
  const [selectedRowsState, setSelectedRows] = useState<
    ConfigureApi.ITenantItem[]
  >([]);
  const { createFcuTenant, deleteFcuTenant } = services.TenantController;
  const { handleCreate, handleDelete } = useCrud<
    ICreateFcuTenantData,
    any,
    any,
    TDeleteFcuTenantIds
  >({
    create: createFcuTenant,
    delete: deleteFcuTenant,
  });

  const handleRemove = async (selectedRows: ConfigureApi.IWarehouseItem[]) => {
    await handleDelete(selectedRows.map((x) => x.id));
  };
  const columns: ProDescriptionsItemProps<ConfigureApi.ITenantItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: 'id是唯一的 key',
      copyable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
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
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setEditTenantId(record.id);
            }}
          >
            配置仓库
          </a>
          <Divider type="vertical" />
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
    <PageContainer
      header={{
        title: '配置',
      }}
    >
      <ProTable<ConfigureApi.ITenantItem>
        headerTitle="租户列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <ModalForm<ICreateFcuTenantData>
            key={1}
            title="添加"
            form={form}
            autoFocusFirstInput
            width={320}
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
              await handleCreate(values);
              actionRef.current?.reloadAndRest?.();
              return true;
            }}
          >
            <ProFormSelect
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: '租户为必填项',
                  },
                ],
              }}
              request={async () => {
                const data = await fetchTenantData(false);
                return data.map((x) => ({ label: x.displayName, value: x.id }));
              }}
              name="tenantId"
              label="租户"
            />
          </ModalForm>,
        ]}
        request={async () => {
          const data = await fetchTenantData();
          console.log(
            '🚀 ~ file: index.tsx ~ line 178 ~ request={ ~ data',
            data,
          );
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

      {editTenantId && (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setEditTenantId('');
          }}
          updateModalVisible={updateModalVisible}
          tenantId={editTenantId}
        />
      )}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<ConfigureApi.ITenantItem>
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
    </PageContainer>
  );
};

export default TableList;
