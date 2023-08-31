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
  Table,
  message,
} from "antd";
import { first, pick } from "lodash";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { DIRECTION_OPTIONS, Direction, ITunnelOption } from "@/constants";
import useEnumOptions from "@/hooks/useEnumOptions";
import { getVehicleTypes, postApiLocations, saveSlot } from "@/services";
import { genLocationLayoutList, genSlots } from "@/utils";
import cx from "classnames";
import { ETabKey } from "@/typings";
import { useUpdateEffect } from "ahooks";
import useOptions from "@/hooks/useOptions";
import styles from "./index.module.scss";
import { generateUUID } from "@packages/utils";

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

const columns = [
  {
    title: "层",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "叉臂举升高度",
    dataIndex: "liftHeight",
    key: "liftHeight",
    editable: true, // 可编辑列
    render: (text: string, record: IRecordForkArm, index: number) => (
      <Form.Item
        style={{ margin: 0 }}
        name={[index, "liftHeight"]}
        initialValue={text}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
    ),
  },
  {
    title: "叉臂下降高度",
    dataIndex: "declineHeight",
    key: "declineHeight",
    render: (text: string, record: IRecordForkArm, index: number) => (
      <Form.Item
        style={{ margin: 0 }}
        name={[index, "declineHeight"]}
        initialValue={text}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
    ),
  },
];

interface IProps {
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}

interface IForm extends API.BatchLocationInfoDTO {
  direction: Direction;
  isColumn: boolean;
  layer: number;
  height: number;
  rowCode: string;
  vehicleTypes: string[];
}

const BatchLocationsDrawer = ({ fetchAll }: IProps) => {
  const { editorStore } = useStore();
  const { batchLocationsInfo, warehouse, isBatchDrawerOpen, canvasLayouts } =
    editorStore;
  const isUpdatingBatchLocations = Boolean(batchLocationsInfo?.locationInfo);

  const [form] = Form.useForm<IForm>();
  const [tableForm] = Form.useForm<IRecordForkArm[]>();
  const [dataSource, setDataSource] = useState<IRecordForkArm[]>([]);

  const { options: vehicleTypeOptions, load: loadVehicle } = useOptions(
    getVehicleTypes,
    { mannual: true, valueKey: (d) => d, labelKey: (d) => d }
  );

  const { options: positionTypeOptions, load: loadPosition } = useEnumOptions(
    "EnumPositionType",
    {
      mannual: true,
      valueKey: "itemId",
      labelKey: "itemName",
    }
  );
  const { options: inboundTypeOptions, load: loadInbound } = useEnumOptions(
    "EnumInboundType",
    {
      mannual: true,
      valueKey: "itemId",
      labelKey: "itemName",
    }
  );

  const onClose = () => {
    editorStore.onBatchDrawerClose();
    form.resetFields();
    tableForm.resetFields();
  };

  const onSave = async () => {
    const values = await form.validateFields();
    const { direction, isColumn, layer, height, rowCode } = values;
    const {
      tunnelInfo: { tunnelAreaCode: tunnelCode },
      areaInfo: { areaCode, id: areaId },
      points,
      shelfInfo: { id: shelfId },
    } = batchLocationsInfo!;

    const locations = genLocationLayoutList(points, {
      direction,
      isColumn,
      tunnelCode,
      layer,
      areaCode,
      height,
      rowCode,
    });

    const body: API.BatchLocationInfoDTO = {
      ...pick(values, Pick_Keys),
      shelfId,
      locations,
    };
    await postApiLocations(body);

    const tableValues = tableForm.getFieldsValue();
    const slots = genSlots(locations, tableValues, values.vehicleTypes);
    await saveSlot({ slots });
    onClose();
    // const api = isUpdatingBatchLocations
    //   ? postApiLocationBatchUpdate
    //   : postApiLocationBatchAdd;
    // const msg = isUpdatingBatchLocations
    //   ? "批量更新库位成功"
    //   : "批量添加库位成功";
    // await api(body);
    // message.success(msg);
    // onClose();
    // form.resetFields();
    fetchAll([ETabKey.Location], canvasLayouts);
  };

  const onlayerChange = (val: number | null) => {
    if (!val) return;
    const newDataSource = [];
    for (let i = 1; i <= (val as number); i++) {
      const item: IRecordForkArm = {
        id: "record_" + generateUUID(),
        index: i,
        liftHeight: 0,
        declineHeight: 0,
      };
      newDataSource.push(item);
    }
    setDataSource(newDataSource);
  };

  useEffect(() => {
    if (batchLocationsInfo && batchLocationsInfo.locationInfo) {
      form.setFieldsValue(batchLocationsInfo?.locationInfo);
    }
  }, [batchLocationsInfo]);

  useUpdateEffect(() => {
    if (isBatchDrawerOpen) {
      loadInbound();
      loadPosition();
      loadVehicle();
    }
  }, [isBatchDrawerOpen]);

  return (
    <Drawer
      forceRender
      title={isUpdatingBatchLocations ? "批量更新库位" : "批量填充库位"}
      placement="right"
      size="large"
      onClose={onClose}
      open={isBatchDrawerOpen}
      bodyStyle={{ overflowY: "auto" }}
      mask={true}
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
        <div className={cx([styles.title, "mb-5"])}>库位编码相关信息</div>
        <Form.Item label="排编号" labelAlign="left" name={"rowCode"}>
          <Input />
        </Form.Item>
        <Form.Item label="起始点" labelAlign="left" name={"direction"}>
          <Select>
            {DIRECTION_OPTIONS.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="层数" labelAlign="left" name={"layer"}>
          <InputNumber style={{ width: "100%" }} onChange={onlayerChange} />
        </Form.Item>
        <Form.Item label="车型" labelAlign="left" name={"vehicleTypes"}>
          <Select mode="multiple">
            {vehicleTypeOptions.map((opt) => (
              <Select.Option value={opt.value} key={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Divider />
        <div className={cx([styles.title, "mb-5"])}>库位基本信息</div>
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
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="长" labelAlign="left" name={"length"}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="宽" labelAlign="left" name={"width"}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="高" labelAlign="left" name={"height"}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
      <Form component={false} form={tableForm}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey={"id"}
        />
      </Form>
    </Drawer>
  );
};

export default observer(BatchLocationsDrawer);
