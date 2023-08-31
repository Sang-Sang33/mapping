import { Input, Popconfirm, message } from "antd";
import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { forwardRef, ReactNode, useMemo } from "react";
import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { animated, useSpring } from "react-spring";
import { useStore } from "@/store";
import expand from "@/assets/icons/expand.svg";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Konva from "konva";
import { EOperationMode, ETabKey } from "@/typings";
import {
  calculateBoundingBox,
  getAttrsBetweenPoints,
  toShapeCenter,
} from "@/utils";
import {
  deleteApiAreaDelete,
  deleteApiRoutingDelete,
  deleteApiShelfDelete,
  deleteApiTunnelDelete,
} from "@/services";

const { Search } = Input;

interface IProps {
  warehouseData: Editor.IWarehouseData;
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}

const AsideSection = ({ warehouseData, fetchAll }: IProps) => {
  const { editorStore } = useStore();
  const { collapse, currentTab, stageRef, canvasLayouts } = editorStore;

  const warehouseDataList = useMemo(
    () => warehouseData[currentTab],
    [warehouseData, currentTab]
  );

  const sectionAnimation = useSpring({
    width: collapse ? "0px" : "240px",
  });

  const hiddenAnimation = useSpring({
    left: collapse ? "-2px" : "238px",
  });

  const onItemClick = (warehouseDataItem: Editor.IWarehouseList[number]) => {
    const tab = warehouseDataItem.tab;
    const groupName =
      tab === ETabKey.LocationGroup ? "" : warehouseDataItem?.konvaAttrs?.name;
    const editGroup = stageRef?.current?.findOne(
      "." + groupName
    ) as Konva.Shape;
    let attrs: IVectorSize | undefined = undefined;
    switch (warehouseDataItem.tab) {
      case ETabKey.Route:
        attrs = getAttrsBetweenPoints(warehouseDataItem?.konvaAttrs?.points!);
        editorStore.onEditRoute({ route: warehouseDataItem }, editGroup);
        break;
      case ETabKey.LocationGroup:
        const coordinates = warehouseDataItem.locationList?.map<
          [number, number]
        >((l) => [l.x!, l.y!])!;
        const realAttrs = calculateBoundingBox(coordinates);
        if (realAttrs) {
          const canvasAttrs = editorStore.getCanvasPosition(realAttrs);
          attrs = {
            ...canvasAttrs,
            y: canvasAttrs.y - canvasAttrs.height, // 沿x轴做一次镜像
          };
        }
        break;
      case ETabKey.Area:
        attrs = warehouseDataItem.konvaAttrs;
        editorStore.onEditArea(warehouseDataItem, editGroup);
        break;
      case ETabKey.Tunnel:
        attrs = warehouseDataItem.konvaAttrs;
        editorStore.onEditTunnel(warehouseDataItem, editGroup);
        break;
      case ETabKey.Shelf:
        attrs = warehouseDataItem.konvaAttrs;
        editorStore.onEditShelf(warehouseDataItem, editGroup);
        break;
      case ETabKey.Location:
        attrs = warehouseDataItem.konvaAttrs;
        break;
      default:
        break;
    }
    if (attrs) {
      toShapeCenter(stageRef?.current!, attrs);
    }
    editorStore.setActiveMode(EOperationMode.Drag);
  };

  const onItemDelete = async (
    warehouseDataItem: Editor.IWarehouseList[number]
  ) => {
    const tab = warehouseDataItem.tab;
    switch (tab) {
      case ETabKey.Route:
        await deleteApiRoutingDelete(warehouseDataItem.id);
        fetchAll([tab], canvasLayouts);
        break;
      case ETabKey.LocationGroup:
        break;
      case ETabKey.Area:
        await deleteApiAreaDelete(warehouseDataItem.id);
        fetchAll([tab], canvasLayouts);
        break;
      case ETabKey.Tunnel:
        await deleteApiTunnelDelete(warehouseDataItem.id);
        fetchAll([tab], canvasLayouts);
        break;
      case ETabKey.Shelf:
        await deleteApiShelfDelete(warehouseDataItem.id);
        fetchAll([tab], canvasLayouts);
        break;
      case ETabKey.Location:
        break;
      default:
        break;
    }
    message.success("删除成功");
  };

  return (
    <>
      <animated.section
        style={sectionAnimation}
        className="overflow-y-auto h-[calc(100vh-56px)]"
      >
        <section className={cx([styles.canvasEditorSection])}>
          <Search placeholder="搜索" className="mb-2" />
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="List"
                height={height - 56}
                itemCount={warehouseDataList.length}
                itemSize={40}
                width={208}
              >
                {({ index, style }) => {
                  const warehouseDataItem = warehouseDataList[index];
                  return (
                    <div
                      className={cx([styles.sectionItem])}
                      style={style}
                      onClick={() => onItemClick(warehouseDataItem)}
                    >
                      {warehouseDataItem.tab === ETabKey.LocationGroup && (
                        <span
                          className="rounded-full w-3 h-3 mr-2"
                          style={{
                            backgroundColor: warehouseDataItem.groupColor,
                          }}
                        ></span>
                      )}
                      <span>{warehouseDataItem.label}</span>
                      <Popconfirm
                        title="确认删除这条数据？"
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          onItemDelete(warehouseDataItem);
                        }}
                        okText="Yes"
                        cancelText="No"
                        onCancel={(e) => e?.stopPropagation()}
                      >
                        <DeleteOutlined
                          onClick={(e) => e.stopPropagation()}
                          className={cx([styles.delete])}
                        />
                      </Popconfirm>
                    </div>
                  );
                }}
              </List>
            )}
          </AutoSizer>
        </section>
      </animated.section>
      {/* <animated.div
        className={cx([styles.canvasEditorHidden])}
        onClick={() => editorStore.toggleCollapse()}
        style={hiddenAnimation}
      >
        <img src={expand} className={cx([styles.wrapper])} />
        <LeftOutlined
          className={cx([styles.direction, { [styles.collapse]: collapse }])}
        />
      </animated.div> */}
    </>
  );
};

export default observer(AsideSection);
