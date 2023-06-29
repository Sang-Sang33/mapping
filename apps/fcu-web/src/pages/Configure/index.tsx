import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { MwSearchTable, MwDialogForm, MwFields, MwField, type MwSearchTableField } from 'multiway'
import { Alert, Button, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  useFcuRequest,
  useMappingRequest,
  type ITenantItem,
  type ICreateFcuTenantData,
  type TDeleteFcuTenantIds
} from '@packages/services'
import { useCrud } from '@packages/hooks'
import UpdateModal from './UpdateModal'

const ROW_KEY = 'id'
const Configure: FC = () => {
  const { getFcuTenantIdList, createFcuTenant, deleteFcuTenant } = useFcuRequest()
  const { getTenantList } = useMappingRequest()
  /* eslint-disable */
  const { handleCreate, handleDelete } = useCrud<ICreateFcuTenantData, any, any, TDeleteFcuTenantIds>({
    create: createFcuTenant,
    delete: deleteFcuTenant
  })
  /* eslint-disable */
  const tableRef = useRef<any>(null)
  const [tenantList, setTenantList] = useState<ITenantItem[]>([])
  const tenantOptions = useMemo(() => tenantList.map((x) => ({ label: x.displayName, value: x.id })), [tenantList])
  const [addFormDialogVisible, setAddFormDialogVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<ITenantItem['id'][]>([])
  const [editTenantId, setEditTenantId] = useState('')
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)

  const tableFields: Array<MwSearchTableField> = [
    {
      title: 'ID',
      key: 'id',
      width: 400,
      align: 'center',
      tooltip: 'id是唯一的 key'
    },
    {
      title: '名称',
      key: 'name',
      align: 'center',
      width: 180
    },
    {
      title: '昵称',
      key: 'displayName',
      valueType: 'text',
      align: 'center',
      width: 180
    },

    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 180,
      align: 'center',

      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setEditTenantId(record.id)
              setUpdateModalVisible(true)
            }}
          >
            配置仓库
          </a>

          <Divider type="vertical" />
          <a
            onClick={async () => {
              await handleDelete([record[ROW_KEY]])
              tableRef.current?.refresh()
            }}
          >
            删除
          </a>
        </>
      )
    }
  ]

  const fetchTenantData = (isFcuTenant = true) =>
    new Promise<ITenantItem[]>((resolve, reject) => {
      Promise.all([getFcuTenantIdList(), getTenantList()])
        .then(([fcuTenantIdList, tenantList]) => {
          resolve(
            tenantList.filter((x) => (isFcuTenant ? fcuTenantIdList.includes(x.id) : !fcuTenantIdList.includes(x.id)))
          )
        })
        .catch(reject)
    })

  useEffect(() => {
    // 获取租户下拉列表
    const updateTenantList = async () => {
      setTenantList(await fetchTenantData(false))
    }
    addFormDialogVisible && updateTenantList()
  }, [addFormDialogVisible])

  const TableHeader = selectedRowKeys.length ? (
    <Alert
      message={`已选择 ${selectedRowKeys.length} 项`}
      action={
        <>
          <Button
            size="small"
            type="link"
            onClick={async () => {
              await handleDelete(selectedRowKeys)
              setSelectedRowKeys([])
              tableRef.current.refresh()
            }}
          >
            批量删除
          </Button>
          <Button size="small" type="link" onClick={() => setSelectedRowKeys([])}>
            取消选择
          </Button>
        </>
      }
    />
  ) : null

  return (
    <>
      <MwSearchTable
        ref={tableRef}
        title="租户列表"
        api={async () => {
          const content = await fetchTenantData()
          return {
            content,
            totalCount: content.length
          }
        }}
        fields={tableFields}
        rowKey={ROW_KEY}
        tableExtend={{
          rowSelection: {
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }
        }}
        tableHeader={TableHeader}
      >
        <Button type="primary" onClick={() => setAddFormDialogVisible(true)}>
          <PlusOutlined />
          添加
        </Button>
      </MwSearchTable>
      <MwDialogForm
        visible={addFormDialogVisible}
        addApi={async (params: ICreateFcuTenantData) => await handleCreate(params)}
        onClose={() => setAddFormDialogVisible(false)}
        onSuccess={() => {
          tableRef.current.refresh()
        }}
      >
        <MwFields>
          <MwField
            title="租户"
            key="tenantId"
            type="select"
            options={tenantOptions}
            rules={[
              {
                required: true,
                message: '租户为必填项'
              }
            ]}
          />
        </MwFields>
      </MwDialogForm>
      {editTenantId && (
        <UpdateModal
          onCancel={() => {
            setEditTenantId('')
            setUpdateModalVisible(false)
          }}
          updateModalVisible={updateModalVisible}
          tenantId={editTenantId}
        />
      )}
    </>
  )
}

export default memo(Configure)
