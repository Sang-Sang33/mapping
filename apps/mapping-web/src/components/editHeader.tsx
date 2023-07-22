import { Layout, Menu, Col, Row, Button, Space, Select, message, Dropdown, Avatar } from 'antd'
import { useStore } from '../store/index'
import { observer } from 'mobx-react-lite'
import type { MenuProps } from 'antd'
import { isPointInRect } from '../utils'
import UploadJson from './uploadJson'
import { useEffect, useState } from 'react'
import { getCustomerList, getWarehouseList } from '../services'
import { useRequest } from 'ahooks'
import { saveSlot, saveTransferPosition, saveTempSlot, getTempSlot, getRcspoint } from '@/services'
import type { IEditedShapeItem, ISelectedRect, menuType, shapeItem } from '@/types'
import { getTenant } from '@/utils/auth'
import { PoweroffOutlined, ImportOutlined } from '@ant-design/icons';
import { redirectToSso } from '@/utils/auth'
import { clearAccessToken, getCookieByName, setCookie, removeCookieByName } from '@/utils/auth'
import user from "@/assets/icons/user.svg";
import UploadBackground from '@/components/uploadBackground'

const { Header } = Layout
const TANENT_COOKIE = 'tanentId'
const WAREHOUSE_COOKIE = 'warehouseId'

function EditHeader() {
  const [userList, setUserList] = useState<Record<string, string>[]>([])
  const [warehouseList, setWarehouseList] = useState<Record<string, string>[]>([])
  const { EditorStore } = useStore()
  const {
    checkedMenu,
    menuConfig,
    shapesList,
    selectedRectList,
    tenantId,
    warehouseId,
    isHost,
    editWarehouseShow,
    rcsData,
    stageWidth,
    stageHeight,
    rectListInRcs,
    headerHeight
  } = EditorStore
  const onClick: MenuProps['onClick'] = (e) => {
    EditorStore.changeMenu(e.key as menuType)
  }

  useRequest(getCustomerList, {
    onSuccess(res) {
      const list = res.map((item: Record<string, string>) => ({ label: item.displayName, value: item.id }))
      setUserList(list)
      const tanent = getTenant()
      const user = res.find((item) => item.name === tanent)
      if (user) {
        EditorStore.setTenantId(user.id)
      } else {
        const val = getCookieByName(TANENT_COOKIE) || list[0].value
        list.length && EditorStore.setTenantId(val)
      }
    }
  })

  useEffect(() => {
    if (tenantId && !editWarehouseShow) {
      initWarehosueList()
    }
  }, [tenantId, editWarehouseShow])

  useEffect(() => {
    if (warehouseId) loadInitData()
  }, [warehouseId])

  useEffect(() => {
    if (warehouseId && shapesList.length) saveSelectedRectData()
  }, [selectedRectList])

  useEffect(() => {
    // EditorStore.setShapesList([])
    EditorStore.setRcsData({})
    EditorStore.replaceSelectRect([])
  }, [tenantId])

  function loadInitData() {
    Promise.all<any>([getTempSlot(), getRcspoint()])
      .then(([rectList, rcsPoint]) => {
        const { rcsData } = rcsPoint
        EditorStore.setRcsData(rcsData || {})
        setTimeout(() => {
          EditorStore.replaceSelectRect(rectList || [])
        }, 0)
      })
      .catch((e) => {
        EditorStore.replaceSelectRect([])
      })
  }

  async function initWarehosueList() {
    const res = await getWarehouseList({ tenantId })
    const list = res.map((item: Record<string, string>) => ({ label: item.name, value: item.id }))
    setWarehouseList(list)
    const val = getCookieByName(WAREHOUSE_COOKIE) || (list.length && list[0].value) || undefined
    EditorStore.setWarehouseId(val)
  }

  function handleWarehouseChange(val: any) {
    EditorStore.setWarehouseId(val)
    setCookie(WAREHOUSE_COOKIE, val)
  }

  function handleUserChange(val: string) {
    EditorStore.setWarehouseId(undefined)
    EditorStore.setTenantId(val)
    setCookie(TANENT_COOKIE, val)
    removeCookieByName(WAREHOUSE_COOKIE)
  }

  function saveSelectedRectData() {
    saveTempSlot({ items: JSON.stringify(selectedRectList) })
  }

  function genSaveData() {
    const shapesMap: Record<string, IEditedShapeItem> = {}
    const locationRectShapes: Record<string, Record<'rect' | 'shapes', ISelectedRect | shapeItem[]>> = {}
    rectListInRcs.forEach((rect) => {
      shapesList.forEach((shape) => {
        if (!isPointInRect(rect, shape.canvasPosition)) return
        if (rect.type === 'location') {
          !locationRectShapes[rect.name] &&
            (locationRectShapes[rect.name] = {
              rect,
              shapes: []
            })
          locationRectShapes[rect.name].shapes.push(shape)
        }
        const temp = shapesMap[shape.id] || shape
        if (rect.type === 'area') {
          shapesMap[shape.id] = { ...temp, areaNumber: rect.areaNumber }
        } else if (rect.type === 'tunnel') {
          shapesMap[shape.id] = { ...temp, tunnelNumber: rect.tunnelNumber }
        } else if (rect.type === 'tier') {
          shapesMap[shape.id] = { ...temp, tierNumber: rect.tierNumber, highList: rect.highList, lowList: rect.lowList }
        } else if (rect.type === 'transferZones') {
          if (!temp.transferZones) temp.transferZones = []
          shapesMap[shape.id] = { ...temp, transferZones: [...temp.transferZones, rect.transferZonesNumber] }
        } else if (rect.type === 'stagingPoints') {
          shapesMap[shape.id] = { ...temp, stagingPoints: rect.stagingPointsList }
        } else if (rect.type === 'location') {
          shapesMap[shape.id] = { ...temp, vehicleTypes: rect.vehicleTypes }
        } else if (rect.type === 'transferLocation') {
          shapesMap[shape.id] = { ...temp, vehicleTypePairs: rect.vehicleTypePairs }
        }
      })
    })
    Object.values(locationRectShapes).forEach(({ rect, shapes }) => {
      const { rowNumber, start, direction } = rect as ISelectedRect
      const list: Record<number, shapeItem[]> = {}
      shapes.forEach((shape: shapeItem) => {
        !list[shape.CADPosition.y] && (list[shape.CADPosition.y] = [])
        list[shape.CADPosition.y].push(shape)
      })
      Object.values(list).forEach((arr) => {
        arr.sort((a: shapeItem, b: shapeItem) => {
          if (start === 'rightTop' || start === 'rightBottom') {
            return b.CADPosition.x - a.CADPosition.x
          } else {
            return a.CADPosition.x - b.CADPosition.x
          }
        })
      })
      const arr = Object.entries(list)
      if (start === 'leftBottom' || start === 'rightBottom') arr.sort((a, b) => +b[0] - +a[0])
      // colIndex 列索引，deepIndex 深索引
      let colIndex = 1,
        deepIndex = 1
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i][1].length; j++) {
          shapesMap[arr[i][1][j].id] = {
            ...shapesMap[arr[i][1][j].id],
            colNumber: colIndex,
            deepNumber: deepIndex,
            rowNumber
          }
          direction === 'row' ? deepIndex++ : colIndex++
        }
        if (direction === 'row') {
          colIndex++
          deepIndex = 1
        } else {
          deepIndex++
          colIndex = 1
        }
      }
    })
    const positions: any[] = []
    const slots: any[] = []
    Object.values(shapesMap).forEach((shape) => {
      const {
        id,
        areaNumber,
        tunnelNumber,
        tierNumber = 1,
        colNumber,
        deepNumber,
        rowNumber,
        highList = [],
        lowList = [],
        transferZones,
        stagingPoints,
        vehicleTypes = [],
        vehicleTypePairs
      } = shape
      const vehicleTypesList = [...vehicleTypes].map((item) => item)
      for (let i = 1; i <= tierNumber; i++) {
        const name = `${areaNumber}-${tunnelNumber}-${rowNumber}-${colNumber}-${i}-${deepNumber}`
        const item = {
          name,
          puDoPoint: id + '',
          forkArm: {
            liftHeight: +highList[i - 1] || 0,
            declineHeight: +lowList[i - 1] || 0
          },
          stagingPoints,
          transferZones,
          vehicleTypes: vehicleTypesList
        }
        slots.push(item)
        if (vehicleTypePairs) {
          const pos = {
            point: name,
            transferZones,
            vehicleTypes: vehicleTypePairs.map((item) => item.split(/-/))
          }
          positions.push(pos)
        }
      }
    })

    return { positions, slots }
  }

  const handleSave = async () => {
    const { slots, positions } = genSaveData()
    try {
      await Promise.all([saveSlot({ slots }), saveTransferPosition({ positions })])
      message.success('保存成功！')
    } catch (e) {
      message.error('保存失败！')
    }
  }

  const handleExport = () => {
    const { slots, positions } = genSaveData()
    let partitionData: Partial<Record<menuType, any>> = {}
    rectListInRcs.forEach((x: any) => {
      const data = partitionData[x.type as menuType]
      if (data) {
        data.push(x)
      } else {
        partitionData[x.type as menuType] = [x]
      }
    })

    const json = {
      rectList: rectListInRcs,
      slots,
      positions,
      rcsData,
      partitionData
    }
    let link = document.createElement('a')
    link.download = 'data.json'
    link.href = 'data:text/plain,' + JSON.stringify(json)
    link.click()
  }

  const handleLogout = () => {
    clearAccessToken()
    removeCookieByName(WAREHOUSE_COOKIE)
    removeCookieByName(TANENT_COOKIE)
    redirectToSso()
  }

  const userMenu = (
    <Menu onClick={handleLogout} items={[{ label: "退出登录", key: "logout", icon: <ImportOutlined /> }]}></Menu>
  );

  return (
    <Header className="header">
      <Row>
        <Col span={7}>
          <Space>
            <Select value={tenantId} options={userList} onChange={handleUserChange} />
            <Select
              value={warehouseId}
              style={{ width: 130 }}
              options={warehouseList}
              onChange={(val) => handleWarehouseChange(val)}
            />
            {tenantId && <Button onClick={() => EditorStore.setEditWarehouseShow(true)}>仓库操作</Button>}
          </Space>
        </Col>
        <Col span={11}>
          <Menu theme="dark" mode="horizontal" selectedKeys={[checkedMenu]} items={menuConfig} onClick={onClick} />
        </Col>
        <Col span={6}>
          <Space>
            {warehouseId && (
              <>
                <UploadJson></UploadJson>
                {rcsData && <UploadBackground></UploadBackground>}
                <Button type="primary" onClick={handleSave}>
                  保存
                </Button>
                <Button type="primary" onClick={handleExport}>
                  导出
                </Button>
              </>

            )}
            {/* 用户信息  */}
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="w-14 text-center cursor-pointer hover:bg-gray-100">
                <Avatar src={user} />
              </div>
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </Header>
  )
}

export default observer(EditHeader)
