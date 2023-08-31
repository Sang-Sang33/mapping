import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Radio,
  Select,
  Space,
  message,
} from "antd";
import cx from "classnames";
import { observer } from "mobx-react-lite";
import useEnumOptions from "@/hooks/useEnumOptions";
import { useStore } from "@/store";
import { omit } from "lodash";
import { ETabKey } from "@/typings";
import { useUpdateEffect } from "ahooks";
import styles from "./index.module.scss";
import { postApiShelfAdd, putApiShelfUpdate } from "@/services";

interface IProps {
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}

// 区域/巷道/货架/库位 增删抽屉
const ShelfDrawer = ({ fetchAll }: IProps) => {
  const [form] = Form.useForm<Omit<API.ShelfInfoDTO, "id">>();
  const { options: shelvesTypeOptions, load } = useEnumOptions(
    "EnumShelvesType",
    {
      mannual: true,
      valueKey: "itemId",
      labelKey: "itemName",
    }
  );
  const { editorStore } = useStore();
  const { activePosition, canvasLayouts, editShelfInfo, isShelfDrawerOpen } =
    editorStore;

  const isEditing = !!editShelfInfo;

  const onDrawerSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      const body: API.ShelfInfoDTO = {
        ...editShelfInfo,
        ...values,
        ...activePosition,
      };
      await putApiShelfUpdate(body);
      message.success("更新成功！");
    } else {
      const body: Omit<API.ShelfInfoDTO, "id"> = {
        ...values,
        ...activePosition,
        z: 0,
        length: 10000,
      };
      await postApiShelfAdd(body);
      message.success("添加成功！");
    }
    fetchAll([ETabKey.Shelf], canvasLayouts);
    onClose();
  };

  const onClose = () => {
    editorStore.onShelfDrawerClose();
    form.resetFields();
  };

  useUpdateEffect(() => {
    if (isShelfDrawerOpen) {
      load();
    }
  }, [isShelfDrawerOpen]);

  useUpdateEffect(() => {
    if (editShelfInfo) {
      form.setFieldsValue(editShelfInfo);
    }
  }, [editShelfInfo]);

  return (
    <Drawer
      forceRender
      title={isEditing ? `编辑巷道` : `新增巷道`}
      placement="right"
      onClose={onClose}
      open={isShelfDrawerOpen}
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
        <Form.Item label="货架编号" labelAlign="left" name={"shelfCode"}>
          <Input />
        </Form.Item>
        <Form.Item label="货架名称" labelAlign="left" name={"shelfName"}>
          <Input />
        </Form.Item>
        <Form.Item label="货架方向" labelAlign="left" name={"isDirection"}>
          <Radio.Group disabled={isEditing}>
            <Radio value={true}>纵向</Radio>
            <Radio value={false}>横向</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="货架类型" labelAlign="left" name={"shelvesType"}>
          <Select>
            {shelvesTypeOptions.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
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

export default observer(ShelfDrawer);
