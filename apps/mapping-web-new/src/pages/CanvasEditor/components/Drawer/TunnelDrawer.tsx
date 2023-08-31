import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputRef,
  Select,
  Space,
  message,
} from "antd";
import cx from "classnames";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ETabKey } from "@/typings";
import { useUpdateEffect } from "ahooks";
import styles from "./index.module.scss";
import { postApiTunnelAdd, putApiTunnelUpdate } from "@/services";
import { useRef, useState } from "react";
import { first, isEmpty } from "lodash";
import { PlusOutlined } from "@ant-design/icons";

interface IProps {
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}
let index = 0;
// 区域/巷道/货架/库位 增删抽屉
const TunnelDrawer = ({ fetchAll }: IProps) => {
  const [form] = Form.useForm<Omit<API.TunnelInfoDTO, "id">>();

  const { editorStore } = useStore();
  const {
    activePosition,
    isTunnelDrawerOpen,
    editTunnelInfo,
    canvasLayouts,
    tunnelAreaOptions,
  } = editorStore;

  const [items, setItems] = useState<string[]>([]);
  const [name, setName] = useState("");
  const inputRef = useRef<InputRef>(null);
  const isEditing = !!editTunnelInfo;
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const onDrawerSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      const body: API.TunnelInfoDTO = {
        ...editTunnelInfo,
        ...values,
        ...activePosition,
      };
      await putApiTunnelUpdate(body);
      message.success("更新成功！");
    } else {
      const body: Omit<API.TunnelInfoDTO, "id"> = {
        ...values,
        ...activePosition,
        z: 0,
        length: 10000,
      };
      await postApiTunnelAdd(body);
      message.success("添加成功！");
    }
    fetchAll([ETabKey.Tunnel], canvasLayouts);
    onClose();
  };

  const onClose = () => {
    editorStore.onTunnelDrawerClose();
    form.resetFields();
  };

  useUpdateEffect(() => {
    if (editTunnelInfo) {
      form.setFieldsValue(editTunnelInfo);
    }
  }, [editTunnelInfo]);

  useUpdateEffect(() => {
    if (!isEmpty(tunnelAreaOptions)) {
      setItems(tunnelAreaOptions);
      form.setFieldValue("tunnelCode", first(tunnelAreaOptions));
    }
  }, [tunnelAreaOptions]);

  return (
    <Drawer
      forceRender
      title={isEditing ? `编辑巷道` : `新增巷道`}
      placement="right"
      onClose={onClose}
      open={isTunnelDrawerOpen}
      mask={false}
      extra={
        <Space>
          <Button type="primary" onClick={onDrawerSave}>
            保存
          </Button>
        </Space>
      }
    >
      <div className={cx([styles.title, "mb-5"])}>基本信息</div>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        form={form}
      >
        <Form.Item label="巷道编号" labelAlign="left" name={"tunnelCode"}>
          <Select
            options={items.map((item) => ({ label: item, value: item }))}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Please enter item"
                    ref={inputRef}
                    value={name}
                    onChange={onNameChange}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
          />
        </Form.Item>
        <Form.Item label="巷道名称" labelAlign="left" name={"tunnelName"}>
          <Input />
        </Form.Item>
        <Form.Item label="巷道描述" labelAlign="left" name={"tunnelDescribe"}>
          <Input />
        </Form.Item>
      </Form>
      <Divider />
      <Descriptions title="位置信息" column={1}>
        <Descriptions.Item label="X">{activePosition.x}</Descriptions.Item>
        <Descriptions.Item label="Y">{activePosition.y}</Descriptions.Item>
        <Descriptions.Item label="宽">{activePosition.width}</Descriptions.Item>
        <Descriptions.Item label="高">
          {activePosition.height}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default observer(TunnelDrawer);
