import { driver } from "driver.js";
import { CANVAS_OPERATIONS_TOUR, CHOOSE_WAREHOUSE_TOUR, IMPORT_RCS_TOUR, POINT_OPERATION_TOUR, RECT_OPERATION_TOUR, SELECTION_OPERATION_TOUR } from '@/constants'

export function canvasDriver() {
	return driver({
		showProgress: true,
		steps: [
			{ element: "#" + CHOOSE_WAREHOUSE_TOUR, popover: { title: "选择仓库", description: "请先选择需要编辑的仓库。" } },
			{ element: "#" + IMPORT_RCS_TOUR, popover: { title: "导入RCS数据", description: "导入RCS点位的JSON文件。" } },
			// {
			// 	element: ".canvasEditorAside",
			// 	popover: {
			// 		title: "侧边栏",
			// 		description: `<div>
			// 				<span>
			// 					主要展示区域、巷道、货架等列表数据信息。
			// 				</span>
			// 				<ul>
			// 					<li> - 点击列表中的每一项进入该项的<strong>编辑模式</strong>;</li>
			// 					<li> - 点击列表中的每一项的<strong>‘删除’图标</strong>可删除该项;</li>
			// 				</ul>
			// 			</div>`
			// 	}
			// },
			{
				element: "#" + CANVAS_OPERATIONS_TOUR,
				popover: {
					title: "画布操作栏",
					description:
						"点击按钮选择当前画布的操作模式（<strong>选择、绘制矩形、绘制点位</strong>）以对侧边栏的数据进行<strong>增删改</strong>。默认是‘查看’模式，只可对画布进行拖拽、缩放，不可编辑。"
				}
			},
			{
				element: "#" + RECT_OPERATION_TOUR,
				popover: {
					title: "绘制矩形",
					description:
						`按下鼠标并拖动。<br />
						对于侧边栏不同的页签，绘制的矩形含义不同，具体如下：
							<ul>
								<li> - <strong>区域:  </strong><span>以绘制完成的矩形为‘区域’，并打开‘新增区域抽屉’，保存之后可添加相应的‘区域’数据。</span></li>
								<li> - <strong>巷道:  </strong><span>与‘区域’相同，默认为‘新增巷道’。</span></li>
								<li> - <strong>货架:  </strong><span>与‘区域’相同，默认为‘新增货架’。</span></li>
								<li> - <strong>货位:  </strong><span>可批量删除绘制的矩形下的货位。</span></li>
								<li> - <strong>路径:  </strong><span>无。</span></li>
								<li> - <strong>货位分组:  </strong><span>绘制矩形来框选需要分组的库位，<strong>鼠标置于绘制的矩形上</strong>按下鼠标右键以打开‘新增货位分组’抽屉。</span></li>
							</ul>
						`
				}
			},
			{
				element: "#" + POINT_OPERATION_TOUR,
				popover: {
					title: "绘制点位",
					description:
						`在画布中选择位置按下鼠标。<br />
						对于侧边栏不同的页签，绘制点位含义不同，具体如下：
							<ul>
								<li> - <strong>区域:  </strong><span>无。</span></li>
								<li> - <strong>巷道:  </strong><span>无。</span></li>
								<li> - <strong>货架:  </strong><span>无。</span></li>
								<li> - <strong>货位:  </strong><span>绘制的点位落在画布的‘区域元素’与‘巷道元素’中，默认为‘新增货位’，并打开‘新增货位弹窗’。</span></li>
								<li> - <strong>路径:  </strong><span>无。</span></li>
								<li> - <strong>货位分组:  </strong><span>无。</span></li>
							</ul>
						`
				}
			},
			{
				element: "#" + SELECTION_OPERATION_TOUR,
				popover: {
					title: "选择",
					description:
						`选择<strong>画布中</strong>的元素进行编辑<br />
						对于选中的元素含义各不同，具体如下：
							<ul>
								<li> - <strong>区域元素:  </strong><span>编辑选中的区域。</span></li>
								<li> - <strong>巷道元素:  </strong><span>编辑选中的巷道。</span></li>
								<li> - <strong>货架元素:  </strong><span>编辑选中的货架。</span></li>
								<li> - <strong>货位元素:  </strong><span>编辑选中的货位。</span></li>
								<li> - <strong>路径元素:  </strong><span>编辑选中的路径。</span></li>
								<li> - <strong>点位元素:  </strong><span>激活选中的点位可进行位置拖拽。</span></li>
								<li> - <strong>矩形元素:  </strong><span>激活选中的矩形可进行拖拽、缩放，按下‘delete’键删除。</span></li>
							</ul>
						`
				}
			},
			// {
			// 	element: ".canvasStage",
			// 	popover: {
			// 		title: "画布区域",
			// 		description:
			// 			`<strong>鼠标置于画布中的元素上</strong>，按下鼠标右键打开相应元素的右键菜单。<br />
			// 			对于不同的元素，右键菜单的内容各不相同，具体如下：
			// 				<ul>
			// 					<li> - <strong>区域元素:  </strong><span>编辑、删除、添加路径</span></li>
			// 					<li> - <strong>巷道元素:  </strong><span>编辑、删除</span></li>
			// 					<li> - <strong>货架元素:  </strong><span>编辑、删除、批量填充货位、批量更新货位</span></li>
			// 					<li> - <strong>货位元素:  </strong><span>编辑、删除</span></li>
			// 					<li> - <strong>路径元素:  </strong><span>编辑、删除</span></li>
			// 					<li> - <strong>点位元素:  </strong><span>创建货位</span></li>
			// 					<li> - <strong>矩形元素:  </strong><span>创建区域、创建巷道、创建货位</span></li>
			// 				</ul>
			// 			`,
			// 		side: 'left',
			// 		align: 'center'
			// 	},
			// }
		]
	});
}
