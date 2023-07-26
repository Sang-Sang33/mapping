import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react'
import { Stage, Layer, Circle, Rect, Text, Image as KonvaImage } from 'react-konva'
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
    rectListInRcs: selectedRectList,
    checkedMenu,
    shapesList,
    stageWidth,
    stageHeight,
    headerHeight,
    currentMenu,
    backgroundImage,
    layoutData,
    genSaveData
  } = EditorStore
  const [isPaint, setIsPaint] = useState(false)
  const containerLayerRef = useRef(null)
  const stageRef = useRef(null)
  const previewStageRef = useRef(null)
  const [hoveredShape, setHoveredShape] = useState<any>(null)

  const [selectingShapeColor, setSelectingShapeColor] = useState<Record<string, any>>({})
  const backgroundImageObj = useMemo(() => {
    const image = new Image()
    image.src = backgroundImage
    return image
  }, [backgroundImage])
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

  const curTypeCanHasCollision = useMemo(() => checkedMenu === 'transferZones', [checkedMenu])
  const showSelectedRectList = useMemo(
    () => selectedRectList.filter((item) => checkedMenu === 'all' || checkedMenu === item.type),
    [selectedRectList, checkedMenu]
  )
  const showSelectedShapeColor = useMemo(() => {
    const res: Record<string, any> = {}
    selectedRectList.forEach((rect) => {
      if (checkedMenu === 'all' || checkedMenu === rect.type) {
        shapesList.forEach(function (item: any) {
          if (isPointInRect(rect, item.canvasPosition)) res[item.id] = 'green'
        })
      }
    })
    return res
  }, [selectedRectList, checkedMenu])

  const scaleBy = 1.1

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

    if ((oldScale < 0.15 && direction < 0)) return
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
      shapesList.forEach(function (item: any) {
        if (isPointInRect(selectRect, item.canvasPosition)) {
          res[item.id] = 'red'
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
    shapesList.forEach(function (item: any) {
      if (isPointInRect(selectRect, item.canvasPosition)) {
        isEmpty = false
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

  function handleShapeMouseOver(shapeItem) {
    const list = genSaveData.slots.filter(item => item.puDoPoint == shapeItem.id) || []
    setHoveredShape({ ...shapeItem, position: list[list.length - 1]?.name })
  }

  function handleShapeMouseOut() {
    setHoveredShape(null)
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
          {backgroundImage && layoutData && <KonvaImage image={backgroundImageObj} x={0} y={0} width={layoutData.CADWidth * layoutData.CADToCanvasRatio} height={layoutData.CADHeight * layoutData.CADToCanvasRatio} opacity={0.2}></KonvaImage>}
          <Rect name="select-rect" stroke="black" {...selectRect}></Rect>
          {showSelectedRectList.map((item) => (
            <Rect {...item} stroke={item.strokeColor || 'blue'} dash={[8, 4]}></Rect>
          ))}
          {shapesList.map((item: shapeItem) => (
            <Circle
              name={'shape-' + item.id}
              onClick={handleShapeClick}
              onMouseOver={() => handleShapeMouseOver(item)}
              onMouseOut={() => handleShapeMouseOut(item)}
              {...item.canvasPosition}
              width={4}
              height={4}
              fill={showSelectedShapeColor[item.id] || selectingShapeColor[item.id] || 'black'}
            />
          ))}
        </Layer>
        <Layer>
          {hoveredShape && <>
            <Text x={hoveredShape.canvasPosition.x - 70} y={hoveredShape.canvasPosition.y + 5} text={`id: ${hoveredShape.id}, X: ${hoveredShape.CADPosition.x}, Y: ${hoveredShape.CADPosition.y}`} fill='red'></Text>
            <Text x={hoveredShape.canvasPosition.x - 70} y={hoveredShape.canvasPosition.y + 20} text={`库位号：${hoveredShape.position}`} fill='red'></Text>
          </>}
        </Layer>
      </Stage>
      <EditWarehouse></EditWarehouse>
    </div>
  )
}
export default observer(Station)
