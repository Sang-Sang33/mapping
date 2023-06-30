import React, { memo, useEffect, useRef, useState } from 'react'
import type { ElementRef, FC } from 'react'
import { Select, type SelectProps } from 'antd'
import { type ILayoutProps, Layout as UILayout } from '@packages/ui'
import { useMappingRequest } from '@packages/services'
import {
  getTenantIdIC,
  setTenantIdIC,
  getWarehouseIdIC,
  setWarehouseIdIC,
  getTokenIC,
  redirectToSSO
} from '@packages/utils'
import useOptions from '@/hooks/useOptions'
import { useTranslation } from 'react-i18next'

const Layout: FC<Pick<ILayoutProps, 'routes' | 'permission'>> = (props) => {
  const { routes, permission } = props
  const { getTenantList, getWarehouseList } = useMappingRequest()
  const { t } = useTranslation()
  const uiLayoutRef = useRef<ElementRef<typeof UILayout>>(null)
  const [tenantId, setTenantId] = useState(getTenantIdIC())
  const [warehouseId, setWarehouseId] = useState(getWarehouseIdIC())
  const { options: tenantOptions } = useOptions(getTenantList, {
    transform: {
      value: 'id',
      label: 'displayName'
    }
  })
  const [warehouseOptions, setWarehouseOptions] = useState<SelectProps['options']>([])

  const getWarehouseOptions = async () => {
    const warehoustList = await getWarehouseList()
    return warehoustList.map((x) => ({
      label: x.name,
      value: x.id
    }))
  }

  const updateTenantId = (tenantId: string) => {
    setTenantId(tenantId)
    setTenantIdIC(tenantId)
  }
  const updateWarehouseId = (warehouseId: string) => {
    setWarehouseId(warehouseId)
    setWarehouseIdIC(warehouseId)
    uiLayoutRef.current?.updateLayoutContentKey()
  }

  useEffect(() => {
    if (!tenantId && tenantOptions.length) {
      const tenantId = tenantOptions[0].value
      updateTenantId(tenantId)
    }
    const updateWarehouseOptions = async () => {
      const warehouseOptions = await getWarehouseOptions()
      setWarehouseOptions(warehouseOptions)
      const warehouseId = warehouseOptions[0].value as string
      updateWarehouseId(warehouseId)
    }
    updateWarehouseOptions()
  }, [tenantId])

  const handleSelectTenant: SelectProps['onChange'] = async (tenantId) => {
    updateTenantId(tenantId)
  }

  const handleSelectWarehouse = (warehouseId: string) => {
    updateWarehouseId(warehouseId)
  }

  const renderSelect = () => [
    <Select
      key="select-tenant"
      dropdownMatchSelectWidth={false}
      options={tenantOptions}
      value={tenantId}
      onChange={handleSelectTenant}
    ></Select>,
    <Select
      key="select-warehouse"
      dropdownMatchSelectWidth={false}
      options={warehouseOptions}
      value={warehouseId}
      onChange={handleSelectWarehouse}
    ></Select>
  ]

  // 没有token,跳转到单点登录
  useEffect(() => {
    if (!getTokenIC()) redirectToSSO(import.meta.env.VITE_SSO_URL)
  }, [])

  return (
    <UILayout
      ref={uiLayoutRef}
      systemName={t('system')}
      routes={routes}
      permission={permission}
      headerToolBarRender={(defaultDom) => [...renderSelect(), ...Object.values(defaultDom)]}
    />
  )
}

export default memo(Layout)
