import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Switch,
  Tag,
  message,
} from "antd";
import { first, pick } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { ColorPicker } from "antd";
import { Color } from "antd/lib/color-picker";
import styles from "./index.module.scss";
import { useTransition, animated } from "react-spring";
import { getInitialValuesFromShape } from "../../store";
import { toJS } from "mobx";
import { postApiLocationGroupAdd } from "@/services";

const { TextArea } = Input;

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

interface IFrom extends Omit<API.PostLocationGroupInfoDTO, "groupColor"> {
  groupColor: Color;
}

const LocationGroupDrawer = ({ fetchAll }: IProps) => {
  const { editorStore } = useStore();
  const { isLocationGroupDrawerOpen, editGroupInfo, inGroupLocations } =
    editorStore;

  const isEditing = !!editGroupInfo;

  const locationList = useMemo(() => {
    const list = inGroupLocations.map<Editor.Location>((inG) => {
      const values = getInitialValuesFromShape(inG) as Editor.Location;
      return values;
    });
    return list;
  }, [inGroupLocations]);

  const tagTransitions = useTransition(locationList, {
    from: { opacity: 0, transform: "scale(0.8)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
  });

  const [form] = Form.useForm<IFrom>();

  const onDeleteLocation = (l: Editor.Location) => {
    editorStore.onDeleteLocation(l);
  };

  const onClose = () => {
    form.resetFields();
    editorStore.onLocationGroupClose();
  };

  const onSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
    } else {
      const body: API.PostLocationGroupInfoDTO = {
        ...values,
        locationIds: locationList.map((l) => l.id),
        groupColor: values.groupColor.toHexString(),
      };
      await postApiLocationGroupAdd(body);
      message.success("添加成功");
    }
    // const list: API.GroupLocationDTO[] = locationList.map(l =>
    // 	pick(l, ["x", "y", "z", "length", "width", "height", "warehouseId", "id", "locationCode", "customCode"])
    // );
    // const body: API.LocationGroupInfoDTO = {
    // 	...values,
    // 	id: isEditing ? editGroupInfo?.id : 0,
    // 	warehouseId: warehouse?.id,
    // 	locationList: list
    // };
    // const api = isEditing ? currentTabContent?.updateApi : currentTabContent?.addApi;
    // const msg = isEditing ? "编辑成功" : "添加成功";
    // await api?.(body);
    // message.success(msg);
    // fetchLocationGroups();
    // onClose();
    // clearPaintedAreas();
  };

  useEffect(() => {
    if (!editGroupInfo) return;
    form.setFieldsValue(editGroupInfo);
  }, [editGroupInfo]);

  return (
    <Drawer
      className={styles.locationGroup}
      forceRender
      title={isEditing ? "编辑库位分组" : "添加库位分组"}
      placement="right"
      onClose={onClose}
      open={isLocationGroupDrawerOpen}
      mask={false}
      extra={
        <Space>
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        </Space>
      }
    >
      <div className={"ant-descriptions-title mb-5"}>基本信息</div>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        form={form}
        initialValues={{ groupColor: "#f97316" }}
      >
        <Form.Item label="货位分组编号" labelAlign="left" name={"groupCode"}>
          <Input />
        </Form.Item>
        <Form.Item label="货位分组颜色" labelAlign="left" name={"groupColor"}>
          <ColorPicker
            format="hex"
            onChange={(val, hex) => {
              editorStore.onGroupColorChange(hex);
            }}
          />
        </Form.Item>
        <Form.Item
          label="启用状态"
          labelAlign="left"
          name={"isEnable"}
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Form.Item label="描述" labelAlign="left" name={"description"}>
          <TextArea rows={2} />
        </Form.Item>
      </Form>
      <Divider />
      <div className={"ant-descriptions-title mb-5"}>分组中的货位</div>
      <div>
        {tagTransitions((style, location) => (
          <animated.div
            style={{ ...style, display: "inline-block" }}
            key={location.id}
          >
            <Tag
              color="#108ee9"
              closable
              onClose={() => onDeleteLocation(location)}
              className={styles.location}
            >
              {location.customCode}
            </Tag>
          </animated.div>
        ))}
      </div>
    </Drawer>
  );
};

export default observer(LocationGroupDrawer);
