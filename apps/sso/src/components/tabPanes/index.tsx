import React, { FC, useState, useEffect, useRef, useCallback, Component } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Alert, Dropdown, Menu } from "antd";
import Home from "@/pages/home";
import { getKeyName, isAuthorized, getRoute } from "@/assets/js/publicFunc";
import { SyncOutlined } from "@ant-design/icons";

import style from "./TabPanes.module.less";
import Loading from "../loading";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store/index";

const { TabPane } = Tabs;

const initPane = [
	{
		title: "首页",
		key: "home",
		content: Home,
		closable: false,
		path: "/"
	}
];

interface Props {
	defaultActiveKey: string;
	panesItem: {
		title: string;
		content: Component;
		key: string;
		closable: boolean;
		path: string;
	};
	tabActiveKey: string;
}

// 多页签组件
const TabPanes: FC<Props> = props => {
	const { configStore } = useStore();
	const { t } = useTranslation();
	// const dispatch = useAppDispatch();
	// const reloadPath = useAppSelector(selectReloadPath);
	// const curTab = useAppSelector(selectTabs);
	const [activeKey, setActiveKey] = useState<string>("");
	const [panes, setPanes] = useState<CommonObjectType[]>(initPane);
	const [isReload, setIsReload] = useState<boolean>(false);
	const [selectedPanel, setSelectedPanel] = useState<CommonObjectType>({});
	const pathRef: RefType = useRef<string>("");

	const { defaultActiveKey, panesItem, tabActiveKey } = props;

	// const history = useHistory();
	const navigate = useNavigate();
	const { pathname, search } = useLocation();

	const fullPath = pathname + search;

	// 记录当前打开的tab
	// const storeTabs = useCallback(
	// 	(ps): void => {
	// 		const pathArr = ps.map(item => item.path);
	// 		dispatch(setTabs(pathArr));
	// 	},
	// 	[dispatch]
	// );

	// // 从本地存储中恢复已打开的tab列表
	// const resetTabs = useCallback((): void => {
	// 	const initPanes = curTab.reduce((prev: CommonObjectType[], next: string) => {
	// 		const { title, tabKey, component: Content } = getKeyName(next);
	// 		return [
	// 			...prev,
	// 			{
	// 				title,
	// 				key: tabKey,
	// 				content: Content,
	// 				closable: tabKey !== "home",
	// 				path: next
	// 			}
	// 		];
	// 	}, []);
	// 	const { tabKey } = getKeyName(pathname);
	// 	setPanes(initPanes);
	// 	setActiveKey(tabKey);
	// }, [curTab, pathname]);

	// // 初始化页面
	// useEffect(() => {
	// 	resetTabs();
	// }, [resetTabs]);

	// tab切换
	const onChange = (tabKey: string): void => {
		setActiveKey(tabKey);
	};
	// tab新增删除操作
	const onEdit = (targetKey: string | any, action: string) => action === "remove" && remove(targetKey);

	// tab点击
	const onTabClick = (targetKey: string): void => {
		const { path } = panes.filter((item: CommonObjectType) => item.key === targetKey)[0];
		const { key, title } = getRoute(targetKey);
		configStore.switchMenuItem({ key, label: t(title) });
		// TODO 可能会有问题
		navigate(path);
	};
	const isDisabled = () => selectedPanel.key === "home";
	// tab右击菜单

	const refreshTab = () => {};
	const remove = () => {};
	const removeAll = (params?: any) => {};
	const menu = (
		<Menu>
			<Menu.Item key="1" onClick={() => refreshTab()} disabled={selectedPanel.path !== fullPath}>
				刷新
			</Menu.Item>
			<Menu.Item
				key="2"
				onClick={e => {
					e.domEvent.stopPropagation();
					remove(selectedPanel.key);
				}}
				disabled={isDisabled()}
			>
				关闭
			</Menu.Item>
			<Menu.Item
				key="3"
				onClick={e => {
					e.domEvent.stopPropagation();
					removeAll();
				}}
			>
				关闭其他
			</Menu.Item>
			<Menu.Item
				key="4"
				onClick={e => {
					e.domEvent.stopPropagation();
					removeAll(true);
				}}
				disabled={isDisabled()}
			>
				全部关闭
			</Menu.Item>
		</Menu>
	);
	// 阻止右键默认事件
	const preventDefault = (e: CommonObjectType, panel: object) => {
		e.preventDefault();
		setSelectedPanel(panel);
	};

	return (
		<Tabs
			// destroyInactiveTabPane

			activeKey={activeKey}
			className={`${style.tabs}  shadow-lg `}
			defaultActiveKey={defaultActiveKey}
			hideAdd
			onChange={onChange}
			onEdit={onEdit}
			onTabClick={onTabClick}
			type="editable-card"
			size="small"
		>
			{panes.map((pane: CommonObjectType) => (
				<TabPane
					closable={pane.closable}
					key={pane.key}
					tab={
						<Dropdown overlay={menu} placement="bottomLeft" trigger={["contextMenu"]}>
							<span onContextMenu={e => preventDefault(e, pane)}>
								{isReload && pane.path === fullPath && pane.path !== "/403" && <SyncOutlined title="刷新" spin={isReload} />}
								{pane.title}
							</span>
						</Dropdown>
					}
				>
					{/* {reloadPath !== pane.path ? <pane.content path={pane.path} /> : ""} */}
				</TabPane>
				// <pane.content path={pane.path} />
			))}
		</Tabs>
	);
};

export default TabPanes;
