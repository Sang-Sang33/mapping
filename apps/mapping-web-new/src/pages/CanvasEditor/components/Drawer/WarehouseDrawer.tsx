import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Menu,
  Space,
  Switch,
  Radio,
  message,
} from "antd";
import cx from "classnames";
import { FC, useState } from "react";
import { useStore } from "@/store";
import { putApiWarehouseUpdate } from "@/services";
import { observer } from "mobx-react-lite";

const WarehouseDrawer: FC<any> = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<API.WarehouseInfoDTO>();
  const { editorStore } = useStore();
  const { warehouseTitle, warehouse } = editorStore;

  const onOpen = () => {
    if (!warehouseTitle) return;
    form.setFieldsValue(warehouse!);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onSave = async () => {
    const values = await form.validateFields();
    const body: API.WarehouseInfoDTO = {
      ...warehouse,
      ...values,
    };
    const res = await putApiWarehouseUpdate(body);
    if (res.resultData) {
      editorStore.setWarehouse(body);
      message.success("更新成功");
      onClose();
    }
  };

  return (
    <>
      <h3
        className="text-[#00d0d0] text-xl mb-0 cursor-pointer min-w-[90px]"
        onClick={onOpen}
      >
        {warehouseTitle}
      </h3>
      <Drawer
        forceRender
        title="更新仓库位置信息"
        placement="right"
        onClose={onClose}
        open={open}
        mask={true}
        extra={
          <Space>
            <Button type="primary" onClick={onSave}>
              保存
            </Button>
          </Space>
        }
      >
        <Descriptions title="仓库基本信息" column={1}>
          <Descriptions.Item label="仓库编号">
            {warehouse?.warehouseCode}
          </Descriptions.Item>
          <Descriptions.Item label="仓库名称">
            {warehouse?.warehouseName}
          </Descriptions.Item>
          <Descriptions.Item label="仓库别名">
            {warehouse?.aliasName}
          </Descriptions.Item>
          <Descriptions.Item label="仓库描述">
            {warehouse?.warehouseDescribe}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <div className={cx(["ant-descriptions-title", "mb-5"])}>
          仓库位置信息
        </div>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          form={form}
          initialValues={warehouse}
        >
          <Form.Item label="x" labelAlign="left" name={"x"}>
            <Input />
          </Form.Item>
          <Form.Item label="y" labelAlign="left" name={"y"}>
            <Input />
          </Form.Item>
          <Form.Item label="width" labelAlign="left" name={"width"}>
            <Input />
          </Form.Item>
          <Form.Item label="height" labelAlign="left" name={"height"}>
            <Input />
          </Form.Item>
          <Form.Item label="length" labelAlign="left" name={"length"}>
            <Input />
          </Form.Item>
          <Form.Item label="z" labelAlign="left" name={"z"}>
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default observer(WarehouseDrawer);
