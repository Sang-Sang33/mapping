import { message } from "antd";
import cx from "classnames";
import Konva from "konva";
import { first, isEmpty, isNil, pick } from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import {
  AREA_GROUP_NAME,
  AREA_NAME_PREFIX,
  getAreaLabel,
  getShelfLabel,
  getTunnelLabel,
  IAreaOption,
  IShelfOption,
  ITunnelOption,
  LOCATION_POINTS_GROUP,
  PAGINATION,
  RCS_POINTS_GROUP,
  SHELF_GROUP_NAME,
  SHELF_NAME_PREFIX,
  TUNNEL_GROUP_NAME,
  TUNNEL_NAME_PREFIX,
  TUNNELAREA_GROUP_NAME,
  TUNNELAREA_NAME_PREFIX,
} from "@/constants";
import { delApiLocations } from "@/services";
import { useStore } from "@/store";
import { ETabKey } from "@/typings";
import { getIntersectionByGroups } from "@/utils";
import { EditOutlined } from "@ant-design/icons";
import BatchLocationsDrawer, {
  Pick_Keys,
} from "../Drawer/BatchLocationsDrawer";
import styles from "./index.module.scss";
import AreaDrawer from "../Drawer/AreaDrawer";
import TunnelDrawer from "../Drawer/TunnelDrawer";
import ShelfDrawer from "../Drawer/ShelfDrawer";
import { getInitialValuesFromShape } from "../../store";
import { toJS } from "mobx";
import TunnelAreaDrawer from "../Drawer/TunnelAreaDrawer";
import RouteDrawer from "../Drawer/RouteDrawer";

interface IProps {
  warehouseData: Editor.IWarehouseData;
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}

function getInfoWhenBatchAddLocations(
  stage: Konva.Stage,
  shelfShape: Konva.Shape,
  pointGroup: string
) {
  const includingPoints = getIntersectionByGroups(
    stage,
    shelfShape,
    [pointGroup],
    (shape) => shape.getClassName() === "Circle"
  );
  if (isEmpty(includingPoints)) {
    message.warning("当前货架下暂无点位信息，请先绘制点位。");
    return;
  }
  const firstLocation = first(includingPoints);
  const includingAreas = getIntersectionByGroups(
    stage,
    shelfShape,
    [AREA_GROUP_NAME],
    (shape) => shape.name().startsWith(AREA_NAME_PREFIX)
  );
  const currentArea = first(includingAreas);
  if (isNil(currentArea)) {
    message.warning("当前货架下暂无区域信息，请先绘制区域。");
    return;
  }
  const includingTunnels = getIntersectionByGroups(
    stage,
    shelfShape,
    [TUNNELAREA_GROUP_NAME],
    (shape) => shape.name().startsWith(TUNNELAREA_NAME_PREFIX)
  );
  const currentTunnel = first(includingTunnels);
  if (isNil(currentTunnel)) {
    message.warning("当前货架下暂无巷道信息，请先绘制巷道。");
    return;
  }
  const areaInfo = getInitialValuesFromShape(
    currentArea as Konva.Shape
  ) as Editor.Area;
  const tunnelInfo = getInitialValuesFromShape(
    currentTunnel as Konva.Shape
  ) as unknown as Editor.TunnelArea;
  const shelfInfo = getInitialValuesFromShape(
    shelfShape as Konva.Shape
  ) as Editor.Shelf;
  const locationInfo = getInitialValuesFromShape(
    firstLocation as Konva.Shape
  ) as Editor.Location | undefined;
  return {
    areaInfo,
    tunnelInfo,
    shelfInfo,
    locationInfo,
    includingPoints,
  };
}

function RightMenu({ warehouseData, fetchAll }: IProps) {
  const { editorStore } = useStore();
  const {
    rightMenuStyles,
    activeShape,
    isCommonDrawerOpen,
    isLocationGroupDrawerOpen,
    isRoutingDrawerOpen,
    isTunnelAreaDrawerOpen,
    isPointTarget,
    isAreaTarget,
    isShelfTarget,
    isTunnelTarget,
    isRectTarget,
    isLocationTab,
    isTunnelTab,
    isRoutingTarget,
    isCURDRequired,
    isLocationGroupTab,
    stageRef,
    canvasLayouts,
  } = editorStore;

  const RightMenuItem = ({
    label,
    children,
    onClick,
  }: {
    label: string;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <div className={styles.menuItem} onClick={onClick}>
      <div className={styles.iconWrapper}>{children}</div>
      <span className={styles.text}>{label}</span>
    </div>
  );

  const setTabKeyByName = () => {
    if (!activeShape) return;
    const initialValues = getInitialValuesFromShape(activeShape);
    const tab = initialValues?.tab ?? ETabKey.Area;
    editorStore.setCurrentTab(tab);
    return tab;
  };

  const onDeleteTarget = async () => {
    editorStore.onRightMenuDelete((tab) => {
      message.success("删除成功");
      fetchAll([tab], canvasLayouts);
    });
  };

  const onEditTarget = () => {
    setTabKeyByName();
    editorStore.onRightMenuEdit();
  };

  const onBatchAddLocations = () => {
    if (!activeShape) return;
    const res = getInfoWhenBatchAddLocations(
      stageRef?.current!,
      activeShape!,
      RCS_POINTS_GROUP
    );
    if (!res) return;
    const { includingPoints, locationInfo, ...otherRes } = res;
    const points = includingPoints.map((point) => {
      const x = point.x(),
        y = point.y();
      const atrrs = editorStore.getCADPosition({ x, y, width: 1, height: 1 });
      const id = locationInfo?.id ?? "0";
      const puDoPoint = point?.id() ?? "";
      return {
        ...pick(atrrs, ["x", "y"]),
        id,
        puDoPoint,
      };
    });
    editorStore.onBatchAddLocations({
      points,
      locationInfo,
      ...otherRes,
    });
  };

  // const onBatchUpdateLocations = async () => {
  // 	if (!activeShape) return;
  // 	const shelfId = activeShape.id();
  // 	const res = await postApiLocationGetPageData({ ...PAGINATION, query: { shelfId } });
  // 	const locationList = res?.resultData?.pageData ?? [];
  // 	if (isEmpty(locationList)) {
  // 		message.info("当前货架下暂无货位，请先添加货位。");
  // 		return;
  // 	}
  // 	const firstLocation = first(locationList);
  // 	const initialValues = pick(firstLocation, [...Pick_Keys, "tunnelId", "locationLayer", "locationRow"]);
  // 	setBatchDrawerintialValues(initialValues);
  // 	const areaCode = firstLocation?.areaCode!;
  // 	const points = locationList.map(p => ({ x: p.x!, y: p.y!, id: p.id! }));
  // 	editorStore.onBatchUpdateLocations({
  // 		points,
  // 		shelfId,
  // 		areaCode
  // 	});
  // 	setTabKeyByName();
  // };

  const onBatchDeleteLocations = async () => {
    const includingPoints = getIntersectionByGroups(
      stageRef?.current!,
      activeShape!,
      [LOCATION_POINTS_GROUP],
      (shape) => shape.getClassName() === "Circle"
    );
    const ids = includingPoints.map(
      (p) => p?.id?.() ?? 0
    ) as unknown as number[];
    if (isEmpty(ids)) {
      editorStore.hideMenu();
      return;
    }
    await delApiLocations(ids);
    message.success("批量删除库位成功");
    fetchAll([ETabKey.Location], canvasLayouts);
    editorStore.hideMenu();
  };

  const onAddRoute = () => {
    const area = getInitialValuesFromShape(activeShape!) as Editor.Area;
    editorStore.onAddRoute({ area }, ETabKey.Route);
  };

  const onAddLocation = () => {
    setTabKeyByName();
    editorStore.hideMenu();
    const point = activeShape;
    if (!point) return;

    const includingAreas = getIntersectionByGroups(
      stageRef?.current!,
      activeShape!,
      [AREA_GROUP_NAME],
      (shape) => shape.name().startsWith(AREA_NAME_PREFIX)
    );

    const includingShelves = getIntersectionByGroups(
      stageRef?.current!,
      activeShape!,
      [SHELF_GROUP_NAME],
      (shape) => shape.name().startsWith(SHELF_NAME_PREFIX)
    );

    if (!isEmpty(includingAreas) && !isEmpty(includingShelves)) {
      const area = first(includingAreas);
      const shelf = first(includingShelves);
      const areaId = area?.id?.() ?? "";
      const shelfId = shelf?.id() ?? "";
      editorStore.onAddLocation(point, { areaId, shelfId });
    } else {
      message.info("当前点位不在区域、货架下，无法生成库位！");
      return;
    }
  };

  const onAddLocationGroup = () => {
    editorStore.onAddLocationGroup();
  };

  return (
    <>
      <div style={{ ...rightMenuStyles }} className={cx([styles.rightMenu])}>
        {isShelfTarget && (
          <>
            <RightMenuItem label="批量填充库位" onClick={onBatchAddLocations}>
              <span
                className={cx(["icon-batch-add", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
            <RightMenuItem
              label="批量删除库位"
              onClick={onBatchDeleteLocations}
            >
              <span
                className={cx(["icon-batch-del", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
            {/* <RightMenuItem label="批量更新库位" onClick={onBatchUpdateLocations}>
							<span className={cx(["icon-batch-update", "iconfont", styles.iconSty])}></span>
						</RightMenuItem> */}
          </>
        )}
        {isRectTarget && isLocationTab && (
          <>
            <RightMenuItem
              label="批量删除库位"
              onClick={onBatchDeleteLocations}
            >
              <span
                className={cx(["icon-batch-del", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
          </>
        )}
        {isRectTarget && isTunnelTab && (
          <>
            <RightMenuItem
              label="生成巷道区域"
              onClick={() => {
                editorStore.onAddTunnelArea();
              }}
            >
              <span
                className={cx(["icon-area", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
            <RightMenuItem
              label="生成巷道"
              onClick={() => {
                editorStore.onAddTunnel(ETabKey.Tunnel);
              }}
            >
              <span
                className={cx(["icon-road", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
          </>
        )}
        {/* {isRectTarget && !isLocationTab && !isLocationGroupTab && (
          <>
            <RightMenuItem
              label="生成区域"
              onClick={() => {
                editorStore.onAddCommon(ETabKey.Area);
              }}
            >
              <span
                className={cx(["icon-area", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
            <RightMenuItem
              label="生成巷道"
              onClick={() => {
                editorStore.onAddCommon(ETabKey.Tunnel);
              }}
            >
              <span
                className={cx(["icon-road", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
            <RightMenuItem
              label="生成货架"
              onClick={() => {
                editorStore.onAddCommon(ETabKey.Shelf);
              }}
            >
              <span
                className={cx(["icon-shelf", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
          </>
        )} */}
        {isAreaTarget && (
          <>
            <RightMenuItem label="添加路径" onClick={onAddRoute}>
              <span
                className={cx(["icon-route", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
          </>
        )}
        {isPointTarget && (
          <>
            <RightMenuItem label="生成库位" onClick={onAddLocation}>
              <span
                className={cx(["icon-storage", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
          </>
        )}
        {isLocationGroupTab && isRectTarget && (
          <>
            <RightMenuItem label="库位分组" onClick={onAddLocationGroup}>
              <span
                className={cx([
                  "icon-locationGroup",
                  "iconfont",
                  styles.iconSty,
                ])}
              ></span>
            </RightMenuItem>
          </>
        )}
        {isCURDRequired && (
          <>
            <RightMenuItem label="编辑" onClick={onEditTarget}>
              <EditOutlined className={styles.iconSty} />
            </RightMenuItem>
            <RightMenuItem label="删除" onClick={onDeleteTarget}>
              <span
                className={cx(["icon-delete", "iconfont", styles.iconSty])}
              ></span>
            </RightMenuItem>
          </>
        )}
      </div>
      <BatchLocationsDrawer fetchAll={fetchAll} />
      <AreaDrawer fetchAll={fetchAll} />
      <TunnelAreaDrawer fetchAll={fetchAll} />
      <TunnelDrawer fetchAll={fetchAll} />
      <RouteDrawer fetchAll={fetchAll} />
      <ShelfDrawer fetchAll={fetchAll} />
    </>
  );
}

export default observer(RightMenu);
