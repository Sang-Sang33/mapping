import { MenuItem } from '.'
// 菜单管理
export const menus: Array<MenuItem> = [
  {
    key: 'wmsMission',
    label: 'aside.wmsMission.nav',
    icon: 'icon-WMSrizhi',
    path: '/wmsMission',
    permission: ''
  },
  {
    key: 'rcsMission',
    label: 'aside.rcsMission.nav',
    icon: 'icon-RCS',
    path: 'rcsMission',
    permission: ''
  },

  {
    key: 'missionProcess',
    label: 'aside.missionProcess.nav',
    icon: 'icon-renwuchuli',
    path: '/missionProcess',
    permission: ''
  },
  {
    key: 'device',
    label: 'aside.device.nav',
    icon: 'icon-device',
    path: '/device',
    permission: '',
    children: [
      {
        key: 'feature',
        label: 'aside.device.feature.nav',
        icon: 'icon-shebeigongnengguanli',
        path: '/device/feature',
        permission: ''
      },
      {
        key: 'status',
        label: 'aside.device.status.nav',
        icon: 'icon-shebeizhuangtai',
        path: '/device/status',
        permission: ''
      }
    ]
  },

  {
    key: 'event',
    label: 'aside.event.nav',
    icon: 'icon-shijian',
    path: '/event',
    permission: ''
  },

  {
    key: 'logs',
    label: 'aside.logs.nav',
    icon: 'icon-rizhi',
    path: 'logs',
    permission: '',
    url: 'http://dev.multiway-cloud.com:25009/#/'
  }

  // {
  // 	key: "permission",
  // 	label: "aside.permission.nav",
  // 	icon: "icon-quanxianziyuan",
  // 	children: [
  // 		{
  // 			key: "permission/user",
  // 			label: "aside.permission.user.nav",
  // 			icon: "icon-yonghu",
  // 			path: "/permission/user",
  // 			permission: ""
  // 		},
  // 		{
  // 			key: "permission/role",
  // 			label: "aside.permission.role.nav",
  // 			icon: "icon-jiaoseguanli",
  // 			path: "/permission/role",
  // 			permission: ""
  // 		}
  // 	]
  // }
]
