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
  InputNumber,
} from "antd";
import cx from "classnames";
import { observer } from "mobx-react-lite";
import useEnumOptions from "@/hooks/useEnumOptions";
import { useStore } from "@/store";
import { ETabKey } from "@/typings";
import { useUpdateEffect } from "ahooks";
import styles from "./index.module.scss";
import { postApiAreaAdd, putApiAreaUpdate } from "@/services";

interface IProps {
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}

const LocationDrawer = ({ fetchAll }: IProps) => {
  const [form] = Form.useForm<Omit<API.AreaInfoDTO, "id">>();
  const { options: positionTypeOptions, load: loadAreaOptions } =
    useEnumOptions("EnumPositionType", {
      mannual: true,
      valueKey: "itemId",
      labelKey: "itemName",
    });
  const { options: inboundTypeOptions, load: loadAllotOptions } =
    useEnumOptions("EnumInboundType", {
      mannual: true,
      valueKey: "itemId",
      labelKey: "itemName",
    });
  const { editorStore } = useStore();

  const { activePosition, isAreaDrawerOpen, editAreaInfo, canvasLayouts } =
    editorStore;

  const isEditing = !!editAreaInfo;

  const onDrawerSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      const body: API.AreaInfoDTO = {
        ...editAreaInfo,
        ...values,
        ...activePosition,
      };
      await putApiAreaUpdate(body);
      message.success("更新成功！");
    } else {
      const body: Omit<API.AreaInfoDTO, "id"> = {
        ...values,
        ...activePosition,
        z: 0,
        length: 10000,
      };
      await postApiAreaAdd(body);
      message.success("添加成功！");
    }
    fetchAll([ETabKey.Area], canvasLayouts);
    onClose();
  };

  const onClose = () => {
    editorStore.onAreaDrawerClose();
    form.resetFields();
  };

  useUpdateEffect(() => {
    if (isAreaDrawerOpen) {
      loadAreaOptions();
      loadAllotOptions();
    }
  }, [isAreaDrawerOpen]);

  useUpdateEffect(() => {
    if (editAreaInfo) {
      form.setFieldsValue(editAreaInfo);
    }
  }, [editAreaInfo]);

  return (
    <Drawer
      forceRender
      title={isEditing ? `编辑区域` : `新增区域`}
      placement="right"
      onClose={onClose}
      open={isAreaDrawerOpen}
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
        <Form.Item
          label="货位编号"
          labelAlign="left"
          name={"locationCode"}
          hidden={!isEditing}
        >
          <Input disabled={isEditing} />
        </Form.Item>
        <Form.Item label="自定义编号" labelAlign="left" name={"customCode"}>
          <Input />
        </Form.Item>
        <Form.Item label="位置类型" labelAlign="left" name={"positionType"}>
          <Select>
            {positionTypeOptions.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="入库类型" labelAlign="left" name={"inboundType"}>
          <Select>
            {inboundTypeOptions.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="允许入库" labelAlign="left" name={"allowStockIn"}>
          <Radio.Group>
            <Radio value={true}>允许</Radio>
            <Radio value={false}>不允许</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="允许出库" labelAlign="left" name={"allowStockOut"}>
          <Radio.Group>
            <Radio value={true}>允许</Radio>
            <Radio value={false}>不允许</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="出库优先级"
          labelAlign="left"
          name={"outboundPriority"}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item label="排" labelAlign="left" name={"locationRow"}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="列" labelAlign="left" name={"locationColumn"}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="层" labelAlign="left" name={"locationLayer"}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="深" labelAlign="left" name={"locationDepth"}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="长" labelAlign="left" name={"length"}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="宽" labelAlign="left" name={"width"}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="高" labelAlign="left" name={"height"}>
          <InputNumber />
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

export default observer(LocationDrawer);
