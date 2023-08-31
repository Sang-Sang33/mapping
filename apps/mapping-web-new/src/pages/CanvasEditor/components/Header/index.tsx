import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  message,
  Popover,
  Select,
  Upload,
} from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import cx from "classnames";
import { observer } from "mobx-react-lite";
import logoMini from "@/assets/imgs/logo.png";
import {
  CANVAS_OPERATIONS_TOUR,
  CHOOSE_WAREHOUSE_TOUR,
  IMPORT_RCS_TOUR,
  POINT_OPERATION_TOUR,
  RECT_OPERATION_TOUR,
  SELECTION_OPERATION_TOUR,
} from "@/constants";
import useWarehouseList from "@/hooks/useWarehouseList";
import i18n from "@/i18n";
import {
  getCustomerList,
  putApiWarehouseUpdate,
  getApiWarehouseUpdate,
  saveRcspoint,
} from "@/services";
import { useStore } from "@/store";
import {
  DownOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import WarehouseDrawer from "../Drawer/WarehouseDrawer";
import Operation from "../../../../components/Operation";
import styles from "./index.module.scss";

import type { MenuProps } from "antd";
import { EOperationMode } from "@/typings";
import { canvasDriver, isJsonString } from "@/utils";
import { useEffect, useState } from "react";
import useOptions from "@/hooks/useOptions";
import { first, isEmpty } from "lodash";
import { RcFile } from "antd/es/upload";
const t = (key: string) => i18n.t(key);

const userItems: MenuProps["items"] = [
  {
    key: "logout",
    label: <span className="cursor-pointer">退出登录</span>,
  },
];

const OPERATIONS: IOperation[] = [
  {
    key: EOperationMode.Drag,
    icon: "icon-grab",
    popoverProps: {
      title: "拖拽",
      content: "拖拽画布",
    },
    id: SELECTION_OPERATION_TOUR,
  },
  {
    key: EOperationMode.Selection,
    icon: "icon-selection",
    popoverProps: {
      title: "选择",
      content: "选择形状。",
    },
    id: SELECTION_OPERATION_TOUR,
  },
  {
    key: EOperationMode.Rect,
    icon: "icon-rect",
    popoverProps: {
      title: "绘制矩形",
      content: "按下鼠标并拖动。",
    },
    id: RECT_OPERATION_TOUR,
  },
  {
    key: EOperationMode.Point,
    icon: "icon-point",
    popoverProps: {
      title: "绘制点位",
      content: "在画布中选择位置按下鼠标。",
    },
    id: POINT_OPERATION_TOUR,
  },
];

interface IProps {
  initLayouts: (rcsPoints: RCSPoints) => void;
}

const EditorHeader = ({ initLayouts }: IProps) => {
  const { editorStore } = useStore();
  const { activeMode, tenantId, warehouseid } = editorStore;

  const { options: customerOptions } = useOptions(getCustomerList, {
    mannual: false,
    valueKey: "id",
    labelKey: "displayName",
    onsuccess(options) {
      editorStore.setTenantId(first(options)?.id ?? "");
    },
  });

  const { options: warehouseOptions } = useOptions(getApiWarehouseUpdate, {
    mannual: false,
    valueKey: "id",
    labelKey: "name",
    onsuccess(options) {
      if (isEmpty(options)) return;
      editorStore.setWarehouseId(first(options)!);
    },
  });

  const beforeUpload = async (file: RcFile) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (e) {
      if (!isJsonString(e.target?.result as string))
        return message.error("文件格式不正确！");
      const jsonResult = e.target?.result as string;
      initLayouts(JSON.parse(jsonResult) as RCSPoints);
      saveRcspoint({ points: jsonResult }).then(() => {
        message.success("导入成功！");
      });
    };
    return false;
  };

  const onStartTours = () => {
    const driverObj = canvasDriver();
    driverObj.drive();
  };

  return (
    <header className={styles.editorHeader}>
      <div className="w-[72px] h-14 text-center p-3 block">
        <img src={logoMini} alt="" className="w-[48px]" />
      </div>
      <h3 className="text-[#00d0d0] text-xl mb-0">{t("warehouseEditor")}</h3>
      {/* <WarehouseDrawer /> */}
      <Divider type="vertical" className={styles.editorHeaderDivider} />
      <div className={cx([styles.editorHeaderBox])} id={CHOOSE_WAREHOUSE_TOUR}>
        <Select
          style={{ width: 120 }}
          options={customerOptions}
          value={tenantId}
          onChange={(value, option) => {
            editorStore.setTenantId(value);
          }}
        />
        <Select
          style={{ width: 120 }}
          options={warehouseOptions}
          value={warehouseid}
          onChange={(value, option) => {
            editorStore.setWarehouseId(option as API.IWarehouse);
          }}
        />
        <Button ghost>仓库操作</Button>
      </div>
      <Divider type="vertical" className={styles.editorHeaderDivider} />
      <div
        className={cx([styles.editorHeaderBox, styles.canvasOperations])}
        id={CANVAS_OPERATIONS_TOUR}
      >
        {OPERATIONS.map((operation) => (
          <Operation
            key={operation.key}
            onClick={() => {
              editorStore.onModeChange(operation);
            }}
            active={activeMode === operation.key}
            popoverProps={operation.popoverProps}
            id={operation.id}
          >
            <i
              className={cx(["iconfont", operation.icon])}
              style={{ fontSize: 18 }}
            ></i>
          </Operation>
        ))}
      </div>
      <div className={cx([styles.editorHeaderBox])} id={IMPORT_RCS_TOUR}>
        <Upload
          accept=".json"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <Button ghost icon={<UploadOutlined />}>
            {t("importRCSJson")}
          </Button>
        </Upload>

        <Button ghost icon={<UploadOutlined />}>
          背景图
        </Button>
        <Button type="primary" ghost>
          保存
        </Button>
        <Button type="primary" ghost>
          导出
        </Button>
        <Dropdown menu={{ items: userItems }}>
          <Avatar icon={<UserOutlined className={styles.canvasIcon} />} />
        </Dropdown>
        <Popover content={"查看操作引导"}>
          <QuestionCircleOutlined
            className={styles.canvasIcon}
            onClick={onStartTours}
          />
        </Popover>
      </div>
    </header>
  );
};

export default observer(EditorHeader);
