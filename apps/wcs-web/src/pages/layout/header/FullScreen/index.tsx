import { IconFont } from "@/components/Icon";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from "../../index.module.less";
import { useStore } from "@/store/index";

const FullScreen = () => {
	const [isFullScreen, setisFullScreen] = useState(false);
	const { configStore } = useStore();

	useEffect(() => {
		window.addEventListener("resize", () => {
			if (document.fullscreenElement) {
				configStore.setFullScreen(true);
				setisFullScreen(true);
			}
			// 不是全屏
			else {
				configStore.setFullScreen(false);
				setisFullScreen(false);
			}
		});
		// window.onresize = () => {
		// 	// 全屏
		// 	debugger;
		// };
	}, []);
	// 全屏
	const fullScreen = () => {
		if (!isFullScreen) {
			document.documentElement?.requestFullscreen();
		}
	};

	// 退出全屏
	const exitFullScreen = () => {
		document.exitFullscreen();
	};
	return (
		<Tooltip title={isFullScreen ? "退出全屏" : "全屏"}>
			<a className={`${styles.action}`} onClick={isFullScreen ? exitFullScreen : fullScreen}>
				{/* 全屏的时候显示 退出全屏按钮，非全屏的时候显示 全屏按钮 */}
				{isFullScreen ? <IconFont type="wms-quxiaoquanping_o" /> : <IconFont type="wms-quanping_o" />}
			</a>
		</Tooltip>
	);
};

// class FullScreen extends Component {
// 	constructor(props: any) {
// 		super(props);
// 	}
// 	state: any = {
// 		isFullScreen: false
// 	};
// 	componentDidMount() {
// 		// 监听页面全屏事件
// 		window.onresize = () => {
// 			// 全屏
// 			if (document.fullscreenElement) {
// 				this.setState({ isFullScreen: true });
// 			}
// 			// 不是全屏
// 			else {
// 				this.setState({ isFullScreen: false });
// 			}
// 		};
// 	}

// 	// 全屏
// 	fullScreen = () => {
// 		if (!this.state.isFullScreen) {
// 			document.documentElement?.requestFullscreen();
// 		}
// 	};

// 	// 退出全屏
// 	exitFullScreen = () => {
// 		document.exitFullscreen();
// 	};

// 	render() {
// 		const { isFullScreen } = this.state;
// 		return (
// 			<Tooltip title={isFullScreen ? "退出全屏" : "全屏"}>
// 				<a className={`${styles.action}`} onClick={isFullScreen ? this.exitFullScreen : this.fullScreen}>
// 					{/* 全屏的时候显示 退出全屏按钮，非全屏的时候显示 全屏按钮 */}
// 					{isFullScreen ? <IconFont type="icon-exitFullScreen" /> : <IconFont type="icon-fullScreen" />}
// 				</a>
// 			</Tooltip>
// 		);
// 	}
// }

export default FullScreen;
