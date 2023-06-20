import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react'
import { Stage, Layer, Circle, Rect, Text } from 'react-konva'
import Konva from 'konva'
import './style.less'
import EditHeader from '@/components/editHeader'
import EditDrawer from '@/components/editDrawer'
import { useStore } from '@/store/index'
import { observer } from 'mobx-react-lite'
import RectMenu from '@/components/rectMenu'
import { isPointInRect, isRectOverlap } from '@/utils'
import EditWarehouse from '@/components/editWarehouse'
import Legend from '@/components/legend'
import { debounce } from 'lodash'

let previewLayer: any

const Station = () => {
  const { EditorStore } = useStore()
  const {
    drawerOpen,
    selectRect,
    selectedRectList,
    checkedMenu,
    shapesList,
    stageWidth,
    stageHeight,
    headerHeight,
    currentMenu
  } = EditorStore
  const [isPaint, setIsPaint] = useState(false)
  const containerLayerRef = useRef(null)
  const stageRef = useRef(null)
  const previewStageRef = useRef(null)
  const [tooltipVisible, setTooltipVisible] = useState(true)

  const [selectingShapeColor, setSelectingShapeColor] = useState<Record<string, any>>({})
  useEffect(() => {
    if (!drawerOpen && selectRect.width) initSelectRect()
  }, [drawerOpen])

  useEffect(() => {
    const handleResize = debounce(() => {
      EditorStore.setStageSize(window.innerWidth, window.innerHeight - headerHeight)
    }, 200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClick = () => {
      EditorStore.initRectMenuParams()
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    updatePreview()
  }, [checkedMenu, selectRect, shapesList])

  const tooltipList = useMemo(() => shapesList.map((item) => <Text x={item.canvasPosition.x - 70} y={item.canvasPosition.y + 15} text={`id: ${item.id}, X: ${item.CADPosition.x}, Y: ${item.CADPosition.y}`} fill='red'></Text>), [shapesList])

  const curTypeCanHasCollision = useMemo(() => checkedMenu === 'transferZones', [checkedMenu])
  const showSelectedRectList = useMemo(
    () => selectedRectList.filter((item) => checkedMenu === 'all' || checkedMenu === item.type),
    [selectedRectList, checkedMenu]
  )
  const showSelectedShapeColor = useMemo(() => {
    const res: Record<string, any> = {}
    selectedRectList.forEach((rect) => {
      if (checkedMenu === 'all' || checkedMenu === rect.type) {
        ; (containerLayerRef.current as any).children.forEach(function (item: any) {
          if (item.attrs.name.includes('shape')) {
            if (isPointInRect(rect, item.position())) res[item.attrs.name] = 'green'
          }
        })
      }
    })
    return res
  }, [selectedRectList, checkedMenu])

  const scaleBy = 1.2

  const handleZoom = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage: any = stageRef.current!
    e.evt.preventDefault()
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    }

    let direction = e.evt.deltaY > 0 ? 1 : -1

    if ((oldScale > 2 && direction > 0) || (oldScale < 0.15 && direction < 0)) return
    if (e.evt.ctrlKey) {
      direction = -direction
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

    stage.scale({ x: newScale, y: newScale })

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    }
    stage.position(newPos)
    setTooltipVisible(stage.scaleX() >= 1)
  }

  function getPos() {
    const stage: any = stageRef.current!
    const pointer = stage.getPointerPosition()
    const scaleX = stage.scaleX()
    const pos = {
      x: parseFloat(((pointer.x - stage.x()) / scaleX).toFixed(2)),
      y: parseFloat(((pointer.y - stage.y()) / scaleX).toFixed(2))
    }
    return pos
  }

  function handleMouseDown() {
    if (!shapesList.length || checkedMenu === 'all' || (!curTypeCanHasCollision && isPointInSelectedRect(getPos())))
      return
    setIsPaint(true)
    initSelectRect()
  }

  function initSelectRect() {
    EditorStore.changeSelectRect({ ...getPos(), width: 0, height: 0 })
    setSelectingShapeColor({})
  }

  function handleMouseMove(e) {
    if (isPaint) {
      const pos = getPos()
      const newRect = { ...selectRect, width: pos.x - selectRect.x, height: pos.y - selectRect.y }
      if (!curTypeCanHasCollision && hasCollisionWithSelectedRect(newRect)) return
      EditorStore.changeSelectRect(newRect)
      const res: Record<string, any> = {}
        ; (containerLayerRef.current as any).children.forEach(function (item: any) {
          if (item.attrs.name.includes('shape')) {
            if (isPointInRect(selectRect, item.position())) {
              res[item.attrs.name] = 'red'
            }
          }
        })
      setSelectingShapeColor(res)
    }
  }

  function updatePreview() {
    previewLayer?.destroy()
    previewLayer = (containerLayerRef.current as any).clone({ listening: false })
      ; (previewStageRef.current as any).add(previewLayer)
  }

  function handleMouseUp() {
    setIsPaint(false)
    if (!selectRect.width || !selectRect.height) return
    let isEmpty = true
      ; (containerLayerRef.current as any).children.forEach(function (item: any) {
        if (item.attrs.name.includes('shape')) {
          if (isPointInRect(selectRect, item.position())) {
            isEmpty = false
          }
        }
      })
    if (isEmpty && currentMenu.meta.pointsInsideRect) {
      initSelectRect()
    } else {
      EditorStore.setDrawerOpen(true)
    }
  }

  function isPointInSelectedRect(point: IPoints) {
    let res = false
    showSelectedRectList.forEach((rect) => {
      if (isPointInRect(rect, point)) {
        res = true
        return
      }
    })
    return res
  }

  function hasCollisionWithSelectedRect(selectRect: IRect) {
    let res = false
    showSelectedRectList.forEach((rect) => {
      if (isRectOverlap(rect, selectRect)) {
        res = true
        return
      }
    })
    return res
  }

  function handleContextMenu(e: Konva.KonvaEventObject<PointerEvent>) {
    e.evt.preventDefault()
    if (e.target?.attrs?.name?.includes('selected-rect')) {
      EditorStore.setRectMenuParams({ x: e.evt.clientX, y: e.evt.clientY, show: true, rectName: e.target.attrs.name })
    }
  }

  function handleShapeClick(e) {
    console.log(e)
  }

  return (
    <div>
      {checkedMenu === 'all' && <Legend></Legend>}
      <div id="preview">
        <Stage
          ref={previewStageRef}
          width={stageWidth / 6}
          height={stageHeight / 6}
          scaleX={1 / 6}
          scaleY={1 / 6}
        ></Stage>
      </div>
      <EditHeader></EditHeader>
      <EditDrawer></EditDrawer>
      <RectMenu></RectMenu>
      <Stage
        draggable={checkedMenu === 'all'}
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        onWheel={handleZoom}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        <Layer ref={containerLayerRef}>
          <Rect name="select-rect" stroke="black" {...selectRect}></Rect>
          {shapesList.map((item: shapeItem) => (
            <Circle
              name={'shape-' + item.id}
              onClick={handleShapeClick}
              fill="black"
              {...item.canvasPosition}
              width={12}
              height={12}
              fill={showSelectedShapeColor['shape-' + item.id] || selectingShapeColor['shape-' + item.id] || 'black'}
            />
          ))}
          {showSelectedRectList.map((item) => (
            <Rect {...item} stroke={item.strokeColor || 'blue'} dash={[8, 4]}></Rect>
          ))}
        </Layer>
        <Layer>
          {
            tooltipVisible && tooltipList
          }
        </Layer>
      </Stage>
      <EditWarehouse></EditWarehouse>
    </div>
  )
}
export default observer(Station)
