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
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'

let isInitial = true
const Layout: FC<Pick<ILayoutProps, 'routes' | 'permission'>> = (props) => {
  const { routes, permission } = props
  const { getTenantList, getWarehouseList } = useMappingRequest()
  const uiLayoutRef = useRef<ElementRef<typeof UILayout>>(null)
  const [tenantId, setTenantId] = useState(getTenantIdIC())
  const [warehouseId, setWarehouseId] = useState(getWarehouseIdIC())
  const [warehouseOptions, setWarehouseOptions] = useState<SelectProps['options']>([])
  const [tenantOptions, setTenantOptions] = useState<SelectProps['options']>([])

  const getTenantOptions = async () => {
    const tenantList = await getTenantList()
    return tenantList.map((x) => ({
      label: x.displayName,
      value: x.id
    }))
  }
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
    const updateTenantOptions = async () => {
      const tenantOptions = await getTenantOptions()
      setTenantOptions(tenantOptions)
      if (!tenantId && tenantOptions.length) {
        const tenantId = tenantOptions[0].value
        updateTenantId(tenantId)
      }
    }
    updateTenantOptions()
  }, [])

  useEffect(() => {
    const updateWarehouseOptions = async () => {
      const warehouseOptions = await getWarehouseOptions()
      setWarehouseOptions(warehouseOptions)
      if (isInitial) {
        if (!warehouseId && warehouseOptions.length) {
          const warehouseId = warehouseOptions[0].value as string
          updateWarehouseId(warehouseId)
        }
        isInitial = false
      } else {
        const warehouseId = warehouseOptions[0].value as string
        updateWarehouseId(warehouseId)
      }
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
    tenantOptions?.length ? (
      <Select
        key="select-tenant"
        dropdownMatchSelectWidth={false}
        options={tenantOptions}
        value={tenantId}
        onChange={handleSelectTenant}
      ></Select>
    ) : (
      ''
    ),
    warehouseOptions?.length ? (
      <Select
        key="select-warehouse"
        dropdownMatchSelectWidth={false}
        options={warehouseOptions}
        value={warehouseId}
        onChange={handleSelectWarehouse}
      ></Select>
    ) : (
      ''
    )
  ]

  // 没有token,跳转到单点登录
  useEffect(() => {
    if (!getTokenIC()) redirectToSSO(import.meta.env.VITE_SSO_URL)
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <UILayout
        ref={uiLayoutRef}
        systemName={i18n.t('system')}
        routes={routes}
        permission={permission}
        headerToolBarRender={(defaultDom) => [...renderSelect(), ...Object.values(defaultDom)]}
        ssoUrl={import.meta.env.VITE_SSO_URL}
        customLogoUrl={import.meta.env.DEV ? '/logo_origin.png' : '/wcs-web/logo_origin.png'}
        customMiniLogoUrl={import.meta.env.DEV ? '/logo_mini.png' : '/wcs-web/logo_mini.png'}
        appList={window.__APP_LIST__}
      />
    </I18nextProvider>
  )
}

export default memo(Layout)
