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
import { ETabKey } from "@/typings";
import { useUpdateEffect } from "ahooks";
import styles from "./index.module.scss";
import { postApiAreaAdd, putApiAreaUpdate } from "@/services";

interface IProps {
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}

const AreaDrawer = ({ fetchAll }: IProps) => {
  const [form] = Form.useForm<Omit<API.AreaInfoDTO, "id">>();
  const { options: areaTypeOptions, load: loadAreaOptions } = useEnumOptions(
    "EnumAreaType",
    {
      mannual: true,
      valueKey: "itemId",
      labelKey: "itemName",
    }
  );
  const { options: allotLocationProcessTypeOptions, load: loadAllotOptions } =
    useEnumOptions("EnumAllotLocationProcessType", {
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
        <Form.Item label="区域编号" labelAlign="left" name={"areaCode"}>
          <Input />
        </Form.Item>
        <Form.Item label="区域名称" labelAlign="left" name={"areaName"}>
          <Input />
        </Form.Item>
        <Form.Item label="区域类型" labelAlign="left" name={"areaType"}>
          <Radio.Group>
            {areaTypeOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="货位分配过程类型"
          labelAlign="left"
          name={"allotLocationProcessType"}
        >
          <Select>
            {allotLocationProcessTypeOptions.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="区域描述" labelAlign="left" name={"areaDescribe"}>
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

export default observer(AreaDrawer);
