import cx from "classnames";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import styles from "./index.module.scss";
import EditorHeader from "./components/Header";
import AsideTabs from "./components/AsideTabs";
import { EOperationMode, ETabKey } from "@/typings";
import { useEffect, useMemo, useState } from "react";
import AsideSection from "./components/AsideSection";
import { toJS } from "mobx";
import {
  AREA_GROUP_NAME,
  BORDER_NAME,
  LOCATION_POINTS_GROUP,
  PAINTED_RECTS_GROUP,
  PAINTING_RECT_GROUP,
  POINT_NAME_PREFIX,
  RCS_POINTS_GROUP,
  RCS_POINT_PREFIX,
  SHELF_GROUP_NAME,
  STAGE_NAME,
  TOOLTIP_NAME,
  TUNNELAREA_GROUP_NAME,
  TUNNEL_GROUP_NAME,
  areaRect,
  areaText,
  shelfRect,
  shelfText,
  tunnelRect,
  tunnelText,
} from "@/constants";
import {
  Circle,
  Layer,
  Rect,
  Stage,
  Group,
  Arrow,
  Transformer,
} from "react-konva";
import { isEmpty, round } from "lodash";
import Konva from "konva";
import { generateUUID } from "@packages/utils";
import Legend from "./components/Legend";
import InfoGroup from "./components/KonvaComponents/InfoGroup";
import KonvaTooltip from "./components/KonvaComponents/KonvaTooltip";
import InfoArrow from "./components/KonvaComponents/InfoArrow";
import useStageEvents from "./hooks/useStageEvents";
import { produce } from "immer";
import useGuildLine from "./hooks/useGuildine";
import {
  getCompareRects,
  getShapeTarget,
  mapAreas,
  mapLocations,
  mapRoutingList,
  mapShelfs,
  mapTunnels,
} from "@/utils";
import RightMenu from "./components/RightMenu";
import {
  getApiAreaUpdate,
  getRcspoint,
  getApiTunnelGetPageData,
  getApiShelfGetPageData,
  getPaintingStatus,
  getApiLocations,
  getSlot,
  getApiRouting,
  savePaintingStatus,
} from "@/services";

const defaultTootipProps = {
  x: 0,
  y: 0,
  text: "",
  visible: false,
};

function CanvasEditor() {
  const { editorStore } = useStore();

  const {
    collapse,
    stageSize,
    currentTab,
    currentTabIndex,
    isLocationGroupTab,
    stageLoading,
    shouldPainting,
    paintedRects,
    isDragMode,
    paintingStatus,
  } = editorStore;

  const { onDragEnd, onDragMove } = useGuildLine({
    getCompareNodes: getCompareRects,
  });

  const { rectParams, stageEvents, isPainting, stageRef, trRef } =
    useStageEvents();

  const [borderRect, setBorderRect] = useState<Konva.RectConfig>({
    visible: false,
  });

  const [rcsPoints, setRcsPoints] = useState<Konva.CircleConfig[]>([]);

  const [warehouseData, setWarehouseData] = useState<Editor.IWarehouseData>({
    [ETabKey.Area]: [],
    [ETabKey.Tunnel]: [],
    [ETabKey.Shelf]: [],
    [ETabKey.Location]: [],
    [ETabKey.Route]: [],
    [ETabKey.LocationGroup]: [],
  });

  const [loading, setLoading] = useState(false);

  const [tooltipProps, setTooltipProps] =
    useState<ITooltipProps>(defaultTootipProps);

  /* ----------------👇----------------查询相关事件----------------👇---------------- */
  const fetchAreas = async (layouts: ILayouts): Promise<Editor.Area[]> => {
    const res = await getApiAreaUpdate();
    if (!res) return [];
    return mapAreas(res, layouts);
  };
  const fetchTunnels = async (layouts: ILayouts): Promise<Editor.Tunnel[]> => {
    const res = await getApiTunnelGetPageData();
    if (!res) return [];
    return mapTunnels(res, layouts);
  };
  const fetchShelfs = async (layouts: ILayouts): Promise<Editor.Shelf[]> => {
    const res = await getApiShelfGetPageData();
    if (!res) return [];
    return mapShelfs(res, layouts);
  };
  const fetchLocations = async (
    layouts: ILayouts
  ): Promise<Editor.Location[]> => {
    const res = await getApiLocations();
    if (!res) return [];
    return mapLocations(res, layouts);
  };
  const fetchRoutes = async (
    areas: Editor.Area[]
  ): Promise<Editor.IRouting[]> => {
    const res = await getApiRouting();
    if (!res) return [];
    return mapRoutingList(res, areas);
  };

  const fetchAll = async (keys: ETabKey[], layouts: ILayouts) => {
    let newWarehouseData: any = {};
    for (const key of keys) {
      let data: Editor.IWarehouseList = [];
      switch (key) {
        case ETabKey.Area:
          data = await fetchAreas(layouts);
          break;
        case ETabKey.Tunnel:
          data = await fetchTunnels(layouts);
          break;
        case ETabKey.Shelf:
          data = await fetchShelfs(layouts);
          break;
        case ETabKey.Location:
          data = await fetchLocations(layouts);
          break;
        case ETabKey.Route:
          data = await fetchRoutes(
            newWarehouseData?.[ETabKey.Area] ?? warehouseData[ETabKey.Area]
          );
          break;
        default:
          break;
      }
      newWarehouseData[key] = data;
    }
    setWarehouseData({
      ...warehouseData,
      ...newWarehouseData,
    });
  };

  const fetchPaintingStatus = async () => {
    const res = await getPaintingStatus();
    if (!res || isEmpty(res)) return;
    editorStore.setPaintingStatus(res);
  };

  /* ----------------👆----------------查询相关事件----------------👆---------------- */

  const initBorder = (
    radio: ILayouts["radio"],
    width: number,
    height: number
  ) => {
    const border: Konva.RectConfig = {
      x: 0,
      y: 0,
      width: width * radio,
      height: height * radio,
      stroke: "#333",
      strokeWidth: 8,
      visible: true,
    };
    setBorderRect(border);
  };

  const initRCSPoints = (
    points: {
      Id: string;
      Position: {
        X: number;
        Y: number;
      };
    }[],
    layouts: ILayouts
  ) => {
    const { radio, offsetX, offsetY } = layouts;
    const newRcsPoints: Konva.CircleConfig[] = points.map((point) => ({
      id: point.Id,
      x: round((point?.Position?.X! - offsetX) * radio, 4),
      y: round((point?.Position?.Y! * -1 - offsetY) * radio, 2),
      radius: 8,
      name: RCS_POINT_PREFIX + generateUUID(),
      fill: "#333",
    }));
    setRcsPoints(newRcsPoints);
  };

  const initLayouts = (rcsPoints: RCSPoints) => {
    const {
      Border: { DownLeft, UpRight },
      Points,
    } = rcsPoints;
    const x1 = DownLeft.X,
      y1 = DownLeft.Y,
      x2 = UpRight.X,
      y2 = UpRight.Y;
    const width = Math.abs(x1 - x2);
    const height = Math.abs(y1 - y2);
    const radio = round(
      Math.max(window.innerWidth / width, window.innerHeight / height) * 4,
      4
    );
    const offsetX = x1,
      offsetY = y2 * -1;
    const layouts: ILayouts = {
      radio,
      offsetX,
      offsetY,
    };
    editorStore.setCanvasLayouts(layouts);

    initBorder(radio, width, height);
    initRCSPoints(Points, layouts);
    return layouts;
  };

  const initData = async () => {
    const res = await getRcspoint();
    const layouts = initLayouts(res);
    fetchAll(
      [
        ETabKey.Area,
        ETabKey.Tunnel,
        ETabKey.Shelf,
        ETabKey.Location,
        ETabKey.Route,
      ],
      layouts
    );
    fetchPaintingStatus();
  };

  /* ----------------👇----------------stage相关事件----------------👇---------------- */
  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage()!;
    const oldScale = stage.scaleX()!;
    const pointer = stage.getPointerPosition()!;
    const mousePointTo = {
      x: (pointer.x - stage.x()!) / oldScale,
      y: (pointer.y - stage.y()!) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage?.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage?.position(newPos);
    stage?.batchDraw();
  };
  const onContextMenu = (e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    const target = getShapeTarget(e) as Konva.Shape;
    const name = target.name();
    if (name === STAGE_NAME) return;
    editorStore.setActiveShape(target);
    const { clientX, clientY } = e.evt;
    editorStore.setRightMenuStyles({ left: clientX, top: clientY });
  };
  /* ----------------👆----------------stage相关事件----------------👆---------------- */
  /* ----------------👇----------------location相关事件----------------👇---------------- */
  const onLocationMouseOver = (
    e: Konva.KonvaEventObject<MouseEvent>,
    location: Editor.Location
  ) => {
    if (isPainting) return;
    setTooltipProps({
      text: location.label,
      visible: true,
      x: location.konvaAttrs.x,
      y: location.konvaAttrs.y - 20,
    });
  };
  const onLocationMouseOut = (
    e: Konva.KonvaEventObject<MouseEvent>,
    location: Editor.Location
  ) => {
    if (isPainting) return;
    setTooltipProps(defaultTootipProps);
  };
  /* ----------------👆----------------location相关事件----------------👆---------------- */
  /* ----------------👇----------------infoGroup组件相关事件----------------👇---------------- */
  async function onGroupTransformEnd<T extends Editor.IWarehouseGroupData>(
    e: Konva.KonvaEventObject<Event>,
    index: number,
    data: IVectorSize,
    initialValues: T
  ) {
    const { tab } = initialValues;
    setWarehouseData(
      produce((draft) => {
        const currentItem = draft[tab][index];
        if (currentItem) {
          currentItem.konvaAttrs = {
            ...currentItem.konvaAttrs,
            ...data,
          };
        }
      })
    );
    const CADPosition = editorStore.setActivePosition(data);
    console.log("CADPosition: ", CADPosition);
  }
  async function onGroupDragEnd<T extends Editor.IWarehouseGroupData>(
    e: Konva.KonvaEventObject<DragEvent>,
    index: number,
    data: IVectorSize,
    initialValues: T
  ) {
    onDragEnd(e);
    onGroupTransformEnd(e, index, data, initialValues);
  }
  /* ----------------👆----------------infoGroup组件相关事件----------------👆---------------- */

  useEffect(() => {
    initData();
  }, []);

  return (
    <div className={cx([styles.canvasEditor])}>
      {/* 顶部操作栏 */}
      <EditorHeader initLayouts={initLayouts} />
      <article className="flex-1 flex">
        <AsideTabs />
        <main className={cx([styles.canvasEditorAsideMain])}>
          <AsideSection warehouseData={warehouseData} fetchAll={fetchAll} />
          <article
            className={cx({
              // ["flex-1"]: true,
              ["cursor-grab"]: isDragMode,
            })}
          >
            <Stage
              name={STAGE_NAME}
              visible={!stageLoading}
              draggable={isDragMode}
              onWheel={onWheel}
              onContextMenu={onContextMenu}
              ref={stageRef}
              {...stageSize}
              {...stageEvents}
            >
              <Layer>
                {/* 仓库边框 */}
                <Rect {...borderRect} name={BORDER_NAME} />
                {/* 巷道区域 */}
                <Group
                  name={TUNNELAREA_GROUP_NAME}
                  visible={currentTab === ETabKey.Tunnel}
                >
                  {(paintingStatus?.tunnelAreas ?? []).map((tunnelArea) => (
                    <Rect
                      {...tunnelArea.konvaAttrs}
                      key={tunnelArea.id}
                      dash={[4, 6]}
                      strokeWidth={4}
                      stroke={"#000"}
                      initialValues={tunnelArea}
                    />
                  ))}
                </Group>
                {/* 区域 */}
                <Group name={AREA_GROUP_NAME}>
                  {warehouseData[ETabKey.Area].map((area, index) => (
                    <InfoGroup
                      key={area.id}
                      {...area.konvaAttrs}
                      draggable={editorStore.isShapeActive(
                        area.konvaAttrs.name
                      )}
                      index={index}
                      text={area.label}
                      rectProps={areaRect}
                      textProps={areaText}
                      initialValues={area}
                      onGroupTransformEnd={onGroupTransformEnd}
                      onGroupDragEnd={onGroupDragEnd}
                      onGroupDragMove={onDragMove}
                    />
                  ))}
                </Group>
                {/* 巷道 */}
                <Group name={TUNNEL_GROUP_NAME}>
                  {warehouseData[ETabKey.Tunnel].map((tunnel, index) => (
                    <InfoGroup
                      key={tunnel.id}
                      {...tunnel.konvaAttrs}
                      index={index}
                      text={tunnel.label}
                      rectProps={tunnelRect}
                      textProps={tunnelText}
                      initialValues={tunnel}
                    />
                  ))}
                </Group>
                {/* 货架 */}
                <Group name={SHELF_GROUP_NAME}>
                  {warehouseData[ETabKey.Shelf].map((shelf, index) => (
                    <InfoGroup
                      key={shelf.id}
                      {...shelf.konvaAttrs}
                      index={index}
                      text={shelf.label}
                      rectProps={shelfRect}
                      textProps={shelfText}
                      initialValues={shelf}
                    />
                  ))}
                </Group>
                {/* 路径 */}
                <Group>
                  {warehouseData[ETabKey.Route].map((route) => (
                    <InfoArrow
                      {...route.konvaAttrs}
                      key={route.id}
                      label={route.label}
                      active={editorStore.isShapeActive(route.konvaAttrs.name)}
                      initialValues={route}
                    />
                  ))}
                </Group>
                {/* 已经绘制完成的区域 */}
                <Group name={PAINTED_RECTS_GROUP}>
                  {paintedRects.map((paintedRect) => (
                    <Rect
                      {...paintedRect}
                      key={paintedRect.name}
                      dash={[8, 2]}
                      opacity={0.6}
                      fill="#fff"
                      stroke="#f87171"
                    />
                  ))}
                </Group>
                {/* 绘制区域 */}
                <Group name={PAINTING_RECT_GROUP}>
                  <Rect
                    {...rectParams}
                    stroke={"#0ea5e9"}
                    fill="#e0f2fe"
                    opacity={0.6}
                    strokeWidth={2}
                    dash={[7, 3]}
                  />
                </Group>
                {/* RCS点位 */}
                <Group name={RCS_POINTS_GROUP}>
                  {rcsPoints.map((rcs) => (
                    <Circle key={rcs.id} {...rcs} />
                  ))}
                </Group>
                {/* 货位 */}
                <Group name={LOCATION_POINTS_GROUP}>
                  {warehouseData[ETabKey.Location].map((location) => (
                    <Circle
                      key={location.id}
                      {...location.konvaAttrs}
                      fill="#7e22ce"
                      onMouseOver={(e) => onLocationMouseOver(e, location)}
                      onMouseOut={(e) => onLocationMouseOut(e, location)}
                      radius={8}
                      initialValues={location}
                    />
                  ))}
                </Group>
                {/* 货位 Tooltip */}
                <KonvaTooltip name={TOOLTIP_NAME} {...tooltipProps} />
                <Transformer ref={trRef} rotateEnabled={false} />
              </Layer>
            </Stage>
          </article>
        </main>
      </article>
      <Legend />
      <RightMenu fetchAll={fetchAll} warehouseData={warehouseData} />
    </div>
  );
}

export default observer(CanvasEditor);
