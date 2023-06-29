import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { MwSearchTable, MwDialogForm, MwFields, MwField, type MwSearchTableField } from 'multiway'
import { Alert, Button, Divider, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  type ICreateFcuWarehouseData,
  type IDeleteFcuWarehouseParams,
  type IFcuWarehouseItem,
  useFcuRequest,
  useMappingRequest,
  IWarehouseItem
} from '@packages/services'
import { useCrud } from '@packages/hooks'

export interface IUpdateModalProps {
  tenantId: string
  updateModalVisible: boolean
  onCancel: () => void
}

const ROW_KEY = 'id'
const UpdateModal: FC<IUpdateModalProps> = (props) => {
  const { tenantId, updateModalVisible, onCancel } = props
  const { getFcuWarehouseIdList, createFcuWarehouse, deleteFcuWarehouse } = useFcuRequest()
  const { getWarehouseListByTenantId } = useMappingRequest()
  /* eslint-disable */
  const { handleCreate, handleDelete } = useCrud<ICreateFcuWarehouseData, any, any, IDeleteFcuWarehouseParams>({
    create: createFcuWarehouse,
    delete: deleteFcuWarehouse
  })
  /* eslint-disable */
  const tableRef = useRef<any>(null)
  const [warehouseList, setWarehouseList] = useState<IWarehouseItem[]>([])
  const tenantOptions = useMemo(() => warehouseList.map((x) => ({ label: x.name, value: x.id })), [warehouseList])
  const [addFormDialogVisible, setAddFormDialogVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<IFcuWarehouseItem['id'][]>([])

  const handleRemove = async (selectedRowKeys: IFcuWarehouseItem['id'][]) => {
    await handleDelete({
      tenantId,
      warehouseIds: selectedRowKeys
    })
  }

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
          <Divider type="vertical" />
          <a
            onClick={async () => {
              await handleRemove([record[ROW_KEY]])
              tableRef.current?.refresh()
            }}
          >
            删除
          </a>
        </>
      )
    }
  ]

  const fetchWarehouseData = useCallback(
    (isFcuWarehouse = true) =>
      new Promise<IFcuWarehouseItem[]>((resolve, reject) => {
        Promise.all([getFcuWarehouseIdList(tenantId), getWarehouseListByTenantId(tenantId)])
          .then(([fcuWarehouseIdList, warehouseList]) => {
            resolve(
              warehouseList.filter((x) =>
                isFcuWarehouse ? fcuWarehouseIdList.includes(x.id) : !fcuWarehouseIdList.includes(x.id)
              )
            )
          })
          .catch(reject)
      }),
    [tenantId]
  )

  const TableHeader = selectedRowKeys.length ? (
    <Alert
      message={`已选择 ${selectedRowKeys.length} 项`}
      action={
        <>
          <Button
            size="small"
            type="link"
            onClick={async () => {
              await handleRemove(selectedRowKeys)
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

  useEffect(() => {
    const updateWarehouseList = async () => {
      setWarehouseList(await fetchWarehouseData(false))
    }
    addFormDialogVisible && updateWarehouseList()
  }, [addFormDialogVisible])

  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="仓库配置"
      open={updateModalVisible}
      onCancel={onCancel}
    >
      <MwSearchTable
        ref={tableRef}
        title="仓库列表"
        api={async () => {
          const content = await fetchWarehouseData()
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
        addApi={async (params) =>
          await handleCreate({
            tenantId,
            warehouseId: params?.warehouseId
          })
        }
        onClose={() => setAddFormDialogVisible(false)}
        onSuccess={() => {
          tableRef.current.refresh()
        }}
      >
        <MwFields>
          <MwField
            title="仓库"
            key="warehouseId"
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
    </Modal>
  )
}

export default memo(UpdateModal)
