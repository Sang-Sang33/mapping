import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
  message,
} from "antd";
import { first, pick } from "lodash";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { IAreaOption, getAreaLabel } from "@/constants";
import useEnumOptions from "@/hooks/useEnumOptions";
import { useUpdateEffect } from "ahooks";
import useOptions from "@/hooks/useOptions";
import {
  postApiRoutingAdd,
  putApiRoutingUpdate,
  getApiAreaUpdate,
} from "@/services";
import { ETabKey } from "@/typings";

export const Pick_Keys = [
  "positionType",
  "inboundType",
  "allowStockIn",
  "allowStockOut",
  "outboundPriority",
  "length",
  "width",
  "height",
];

interface IProps {
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}

const RouteDrawer = ({ fetchAll }: IProps) => {
  const { editorStore } = useStore();
  const { isRoutingDrawerOpen, editRouteInfo, canvasLayouts } = editorStore;

  const isEditing = !!editRouteInfo?.route;

  const [form] = Form.useForm<API.RoutingInfoDTO>();
  const { options: taskExecuteTypeOptions, load: loadTask } = useEnumOptions(
    "EnumTaskExecuteType",
    {
      mannual: true,
      valueKey: "itemId",
      labelKey: "itemName",
    }
  );

  const { options: areaOptions, load: loadArea } = useOptions(
    getApiAreaUpdate,
    {
      mannual: true,
      valueKey: "id",
      labelKey: getAreaLabel,
    }
  );

  const onClose = () => {
    form.resetFields();
    editorStore.onRouteDrawerClose();
  };

  const onSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      const body: API.RoutingInfoDTO = {
        ...editRouteInfo.route,
        ...values,
      };
      await putApiRoutingUpdate(body);
      message.success("更新成功！");
    } else {
      const body: Omit<API.RoutingInfoDTO, "id"> = {
        ...values,
      };
      await postApiRoutingAdd(body);
      message.success("添加成功！");
    }
    fetchAll([ETabKey.Route], canvasLayouts);
    onClose();
  };

  useUpdateEffect(() => {
    if (editRouteInfo?.route) {
      form.setFieldsValue(editRouteInfo.route);
    }
  }, [editRouteInfo?.route]);

  useUpdateEffect(() => {
    if (isRoutingDrawerOpen) {
      loadArea();
      loadTask();
    }
  }, [isRoutingDrawerOpen]);

  useUpdateEffect(() => {
    form.setFieldValue("fromArea", editRouteInfo?.area?.id);
  }, [editRouteInfo?.area?.id]);

  return (
    <Drawer
      forceRender
      title={isEditing ? "编辑路径" : "添加路径"}
      placement="right"
      onClose={onClose}
      open={isRoutingDrawerOpen}
      mask={false}
      extra={
        <Space>
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        </Space>
      }
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        form={form}
      >
        <Form.Item label="路径编号" labelAlign="left" name={"code"}>
          <Input />
        </Form.Item>
        <Form.Item label="路径名称" labelAlign="left" name={"name"}>
          <Input />
        </Form.Item>
        <Form.Item label="起始区域" labelAlign="left" name={"fromArea"}>
          <Select>
            {areaOptions.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="目标区域" labelAlign="left" name={"toArea"}>
          <Select>
            {areaOptions.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="搬运任务类型"
          labelAlign="left"
          name={"taskExecuteType"}
        >
          <Select>
            {taskExecuteTypeOptions.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="WCS名称" labelAlign="left" name={"wcsName"}>
          <Input />
        </Form.Item>
        <Form.Item
          label="是否空托解绑"
          labelAlign="left"
          name={"isEmptyDismiss"}
          valuePropName="checked"
        >
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item
          label="是否实托解盘"
          labelAlign="left"
          name={"isFullDismiss"}
          valuePropName="checked"
        >
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item
          label="启用状态"
          labelAlign="left"
          name={"isEnable"}
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item label="优先级" labelAlign="left" name={"priority"}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default observer(RouteDrawer);
