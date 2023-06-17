import { FC, useState, useEffect } from "react";
import { Tabs, Dropdown, Badge, Spin, List, Avatar, Tag, Tooltip } from "antd";
import { LoadingOutlined, BellOutlined } from "@ant-design/icons";
import services from "@/http/modules/layout";
import { Notice, EventStatus } from "@/interface/layout/notice.interface";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { TabPane } = Tabs;

const HeaderNoticeComponent: FC = () => {
	const [visible, setVisible] = useState(false);
	const [noticeList, setNoticeList] = useState<Notice[]>([]);
	const [loading, setLoading] = useState(false);
	const noticeListFilter = <T extends Notice["type"]>(type: T) => {
		return noticeList.filter(notice => notice.type === type) as Notice<T>[];
	};

	// loads the notices belonging to logged in user
	// and sets loading flag in-process
	// const getNotice = async () => {
	// 	setLoading(true);
	// 	const res = await services.noticeList();
	// 	setLoading(false);
	// 	setNoticeList(res.data);
	// };

	// useEffect(() => {
	// 	getNotice();
	// }, []);

	const tabs = (
		<div>
			<Spin tip="Loading..." indicator={antIcon} spinning={loading}>
				<Tabs defaultActiveKey="1">
					<TabPane tab={`通知(${noticeListFilter("notification").length})`} key="1">
						<List
							dataSource={noticeListFilter("notification")}
							renderItem={item => (
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar src={item.avatar} />}
										title={<a href={item.title}>{item.title}</a>}
										description={item.datetime}
									/>
								</List.Item>
							)}
						/>
					</TabPane>

					<TabPane tab={`消息(${noticeListFilter("message").length})`} key="2">
						<List
							dataSource={noticeListFilter("message")}
							renderItem={item => (
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar src={item.avatar} />}
										title={<a href={item.title}>{item.title}</a>}
										description={
											<div className="notice-description">
												<div className="notice-description-content">{item.description}</div>
												<div className="notice-description-datetime">{item.datetime}</div>
											</div>
										}
									/>
								</List.Item>
							)}
						/>
					</TabPane>
					<TabPane tab={`待办(${noticeListFilter("event").length})`} key="3">
						<List
							dataSource={noticeListFilter("event")}
							renderItem={item => (
								<List.Item>
									<List.Item.Meta
										title={
											<div className="notice-title">
												<div className="notice-title-content">{item.title}</div>
												<Tag color={EventStatus[item.status]}>{item.extra}</Tag>
											</div>
										}
										description={item.description}
									/>
								</List.Item>
							)}
						/>
					</TabPane>
				</Tabs>
			</Spin>
		</div>
	);

	return (
		<Dropdown
			overlay={tabs}
			overlayClassName="bg-2"
			placement="bottomRight"
			trigger={["click"]}
			open={visible}
			onOpenChange={v => setVisible(v)}
			overlayStyle={{
				width: 336,
				boxShadow: "0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)",
				padding: 8,
				borderRadius: 4
			}}
		>
			<Tooltip title="通知">
				<Badge count={12} overflowCount={999}>
					<span className="notice" id="notice-center">
						<BellOutlined className="text-base" />
					</span>
				</Badge>
			</Tooltip>
		</Dropdown>
	);
};

export default HeaderNoticeComponent;
