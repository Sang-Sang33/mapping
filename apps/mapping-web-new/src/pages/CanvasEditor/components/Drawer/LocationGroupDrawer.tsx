import { Button, Divider, Drawer, Form, Input, Radio, Select, Space, Switch, Tag, message } from "antd";
import { first, pick } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { ColorPicker  } from "antd";
import styles from "./index.module.scss";
import { useTransition, animated } from "react-spring";

const { TextArea } = Input;

export const Pick_Keys = [
	"positionType",
	"inboundType",
	"allowStockIn",
	"allowStockOut",
	"outboundPriority",
	"length",
	"width",
	"height"
];

interface IProps {
	locationMap: Record<string, Editor.Location>;
	fetchLocationGroups: () => void;
	clearPaintedAreas: () => void;
}

const LocationGroupDrawer = ({ locationMap, fetchLocationGroups, clearPaintedAreas }: IProps) => {
	const { editorStore } = useStore();
	const { warehouse, isLocationGroupDrawerOpen, editGroupInfo, isEditing, currentTabContent, inGroupLocations } =
		editorStore;

	const locationList = useMemo(() => {
		const ids = inGroupLocations.map(i => i.id());
		const list = ids.reduce<Editor.Location[]>((acc, cur) => {
			const item = locationMap?.[cur] ?? false;
			if (item) {
				acc.push(item);
			}
			return acc;
		}, []);
		return list;
	}, [locationMap, inGroupLocations]);

	const tagTransitions = useTransition(locationList, {
		from: { opacity: 0, transform: "scale(0.8)" },
		enter: { opacity: 1, transform: "scale(1)" },
		leave: { opacity: 0, transform: "scale(0)" }
	});

	const [form] = Form.useForm<API.RoutingInfoDTO>();

	const onDeleteLocation = (l: Editor.Location) => {
		editorStore.onDeleteLocation(l);
	};

	const onClose = () => {
		form.resetFields();
		editorStore.onLocationGroupClose();
	};

	const onSave = async () => {
		const values = await form.validateFields();
		const list: API.GroupLocationDTO[] = locationList.map(l =>
			pick(l, ["x", "y", "z", "length", "width", "height", "warehouseId", "id", "locationCode", "customCode"])
		);
		const body: API.LocationGroupInfoDTO = {
			...values,
			id: isEditing ? editGroupInfo?.id : 0,
			warehouseId: warehouse?.id,
			locationList: list
		};
		const api = isEditing ? currentTabContent?.updateApi : currentTabContent?.addApi;
		const msg = isEditing ? "编辑成功" : "添加成功";
		await api?.(body);
		message.success(msg);
		fetchLocationGroups();
		onClose();
		clearPaintedAreas();
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
						popup
						blockStyles={{
							width: "30px",
							height: "30px",
							borderRadius: "50%"
						}}
						onColorResult={color => color.hex}
						onChange={val => {
							editorStore.onGroupColorChange(val);
						}}
					/>
				</Form.Item>
				<Form.Item label="启用状态" labelAlign="left" name={"isEnable"} valuePropName="checked">
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
					<animated.div style={{ ...style, display: "inline-block" }} key={location.id}>
						<Tag color="#108ee9" closable onClose={() => onDeleteLocation(location)} className={styles.location}>
							{location.customCode}
						</Tag>
					</animated.div>
				))}
			</div>
		</Drawer>
	);
};

export default observer(LocationGroupDrawer);
