import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Space,
  Table,
  message,
  TableColumnProps,
} from "antd";
import cx from "classnames";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ETabKey } from "@/typings";
import { useUpdateEffect } from "ahooks";
import styles from "./index.module.scss";
import {
  postApiTunnelAdd,
  putApiTunnelUpdate,
  savePaintingStatus,
} from "@/services";
import { TUNNELAREA_NAME_PREFIX } from "@/constants";
import { generateUUID } from "@packages/utils";
import { useEffect, useState } from "react";
import { cloneDeep, isEmpty, omit, pick } from "lodash";
import { toJS } from "mobx";

interface IProps {
  fetchAll: (keys: ETabKey[], layouts: ILayouts) => void;
}

// 区域/巷道/货架/库位 增删抽屉
const TunnelAreaDrawer = ({ fetchAll }: IProps) => {
  const [form] = Form.useForm<Editor.TunnelArea>();
  const [tableForm] = Form.useForm<API.TunnelInfoDTO[]>();
  const [dataSource, setDataSource] = useState<API.TunnelInfoDTO[]>([]);
  const [tunnelCode, setTunnelCode] = useState("");

  const { editorStore } = useStore();
  const {
    activePosition,
    isTunnelAreaDrawerOpen,
    editTunnelAreaInfo,
    canvasLayouts,
    tunnelInfos,
    paintingStatus,
  } = editorStore;

  const isEditing = !!editTunnelAreaInfo;

  const columns: TableColumnProps<API.TunnelInfoDTO>[] = [
    {
      title: "巷道编号",
      dataIndex: "tunnelCode",
      key: "tunnelCode",
      render: (text: string, record: API.TunnelInfoDTO, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          name={[index, "tunnelCode"]}
          initialValue={text || tunnelCode}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input style={{ width: "100%" }} disabled={index === 0} />
        </Form.Item>
      ),
      width: 100,
    },
    {
      title: "巷道名称",
      dataIndex: "tunnelName",
      key: "tunnelName",
      render: (text: string, record: API.TunnelInfoDTO, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          name={[index, "tunnelName"]}
          initialValue={text}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
      ),
      width: 100,
    },
    {
      title: "巷道描述",
      dataIndex: "tunnelDescribe",
      key: "tunnelDescribe",
      render: (text: string, record: API.TunnelInfoDTO, index: number) => (
        <Form.Item
          style={{ margin: 0 }}
          name={[index, "tunnelDescribe"]}
          initialValue={text}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
      ),
      width: 150,
    },
    {
      title: "x",
      dataIndex: "x",
      key: "x",
      ellipsis: true,
    },
    {
      title: "y",
      dataIndex: "y",
      key: "y",
      ellipsis: true,
    },
    {
      title: "width",
      dataIndex: "width",
      key: "width",
      ellipsis: true,
    },
    {
      title: "height",
      dataIndex: "height",
      key: "height",
      ellipsis: true,
    },
  ];

  const onDrawerSave = async () => {
    const values = await form.validateFields();
    const id = TUNNELAREA_NAME_PREFIX + generateUUID();
    const tunnelArea: Editor.TunnelArea = {
      ...values,
      id,
      tab: "tunnelArea",
      konvaAttrs: {
        ...editorStore.getCanvasPosition(activePosition),
        name: id,
        id,
      },
    };
    const body: Editor.IPaintingStatus = {
      ...paintingStatus,
      tunnelAreas: [...paintingStatus.tunnelAreas, tunnelArea],
    };
    console.log("body: ", body);
    // await savePaintingStatus({ items: JSON.stringify(body) });
    const tableValues = await tableForm.validateFields();
    const tunnelBody = tunnelInfos.map((item, index) => ({
      ...item,
      ...tableValues[index],
    }));
    console.log("tunnelBody: ", tunnelBody);
    // for (const b of tunnelBody) {
    //   const data = omit(b, "id");
    //   await postApiTunnelAdd(data);
    // }
    // savePaintingStatus({ items: JSON.stringify(body) });
    // onClose();
  };

  const onClose = () => {
    editorStore.onTunnelAreaDrawerClose();
    form.resetFields();
  };

  const onStartAddTunnel = async () => {
    const values = await form.validateFields();
    const id = TUNNELAREA_NAME_PREFIX + generateUUID();
    const tunnelArea: Editor.TunnelArea = {
      ...values,
      id,
      tab: "tunnelArea",
      konvaAttrs: {
        ...editorStore.getCanvasPosition(activePosition),
        name: id,
        id,
      },
    };
    const body: Editor.IPaintingStatus = {
      ...paintingStatus,
      tunnelAreas: [...paintingStatus.tunnelAreas, tunnelArea],
    };
    editorStore.setPaintingStatus(body);
    editorStore.onStartAddTunnel();
  };

  useUpdateEffect(() => {
    if (editTunnelAreaInfo) {
      form.setFieldsValue(editTunnelAreaInfo);
    }
  }, [editTunnelAreaInfo]);

  useEffect(() => {
    console.log("tunnelInfos: ", toJS(tunnelInfos));
    if (isEmpty(tunnelInfos)) return;
    console.log("tunnelInfos: ", toJS(tunnelInfos));
    setDataSource(cloneDeep(tunnelInfos));
  }, [tunnelInfos.length]);

  useEffect(() => {
    console.log("dataSource: ", dataSource);
  }, [dataSource.length]);

  return (
    <Drawer
      forceRender
      title={isEditing ? `编辑巷道区域` : `新增巷道区域`}
      placement="right"
      onClose={onClose}
      size="large"
      open={isTunnelAreaDrawerOpen}
      mask={true}
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
        <Form.Item label="巷道编号" labelAlign="left" name={"tunnelAreaCode"}>
          <Input onChange={(e) => setTunnelCode(e.target.value)} />
        </Form.Item>
      </Form>
      <Divider />
      <div className={cx([styles.title, "mb-5"])}>实际巷道</div>
      <Button
        type="primary"
        icon={<i className="iconfont icon-rect"></i>}
        className="mb-2"
        onClick={onStartAddTunnel}
      >
        开始绘制
      </Button>
      <Form component={false} form={tableForm}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          locale={{ emptyText: "点击‘开始绘制’按钮添加‘实际巷道’" }}
          rowKey={"id"}
        />
      </Form>
    </Drawer>
  );
};

export default observer(TunnelAreaDrawer);
