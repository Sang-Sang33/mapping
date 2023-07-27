import { MwSearchTableField } from 'multiway'
import { Badge, List, Switch, Tooltip } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { formatDate } from '@packages/utils'
import i18n from '@/i18n'
import { WMS_MISSION_STATUS_ENUM, WMS_SUB_MISSION_STATUS_ENUM } from './interface.d'

const t = (key: string) => i18n.t(key)
export const ColorBox = ['green', 'red', 'blue', 'cyan', 'gold', 'red']

const WmsMissionColorStrategy = {
  [WMS_MISSION_STATUS_ENUM.Received]: '#2196F3',
  [WMS_MISSION_STATUS_ENUM.Rejected]: '#e74c3c',
  [WMS_MISSION_STATUS_ENUM.Accepted]: '#2ecc71',
  [WMS_MISSION_STATUS_ENUM.Running]: '#FF9800',
  [WMS_MISSION_STATUS_ENUM.Completed]: '#2ecc71',
  [WMS_MISSION_STATUS_ENUM.Aborted]: '#e74c3c',
  [WMS_MISSION_STATUS_ENUM.Canceled]: '#34495e'
}

export const wmsMissionfields: Array<MwSearchTableField> = [
  {
    title: t('wmsMission.status'),
    width: 150,
    key: 'status',
    align: 'center',
    render: (_, record) => {
      return (
        <>
          <Badge color={WmsMissionColorStrategy[record.status as WMS_MISSION_STATUS_ENUM]}></Badge>
          <span className="pl-2" style={{ color: WmsMissionColorStrategy[record.status as WMS_MISSION_STATUS_ENUM] }}>
            {record.status}
          </span>
        </>
      )
    }
  },
  {
    title: t('wmsMission.id'),
    key: 'id',
    width: 270,
    ellipsis: true
    // search: true
  },
  {
    title: t('wmsMission.predecessorIds'),
    width: 150,
    key: 'predecessorIds',
    align: 'center',
    // dialog: true,
    type: 'select',
    dialog: {
      showSearch: true,
      mode: 'multiple'
    }
  },
  {
    title: t('wmsMission.priority'),
    width: 100,
    key: 'priority',
    align: 'center',
    // search: true,
    render: (_, record) => {
      return <Badge size="small" color={ColorBox[record.priority]} showZero count={record.priority}></Badge>
    },
    sort: true,
    dialog: {
      defaultValue: 1
    },
    type: 'number'
  },
  {
    title: t('wmsMission.from'),
    width: 150,
    key: 'from',
    align: 'center',
    render: (values: string[]) => {
      return values.length > 0 ? (
        <List
          size="small"
          dataSource={values}
          renderItem={(item, index) => (
            <List.Item>
              <Tooltip title={item}>
                <div className="flex items-center overflow-hidden cursor-pointer">
                  <div
                    className={`w-2 h-[12px] `}
                    style={{ backgroundColor: ColorBox[index % ColorBox.length] }}
                    color={ColorBox[index % ColorBox.length]}
                  ></div>
                  <span className="ml-2 overflow-hidden whitespace-nowrap text-ellipsis">{item}</span>
                </div>
              </Tooltip>
            </List.Item>
          )}
        />
      ) : (
        '无'
      )
    },
    type: 'select',
    dialog: {
      showSearch: true,
      mode: 'multiple'
    }
  },
  {
    title: t('wmsMission.to'),
    width: 150,
    key: 'to',
    align: 'center',
    render: (values: string[]) => {
      return values.length > 0 ? (
        <List
          size="small"
          dataSource={values}
          renderItem={(item, index) => (
            <List.Item>
              <Tooltip title={item}>
                <div className="flex items-center overflow-hidden cursor-pointer">
                  <div
                    className={`w-2 h-[12px] `}
                    style={{ backgroundColor: ColorBox[index % ColorBox.length] }}
                    color={ColorBox[index % ColorBox.length]}
                  ></div>
                  <span className="ml-2 overflow-hidden whitespace-nowrap text-ellipsis">{item}</span>
                </div>
              </Tooltip>
            </List.Item>
          )}
        />
      ) : (
        '无'
      )
    },
    type: 'select',
    dialog: {
      showSearch: true,
      mode: 'multiple'
    }
  },
  {
    title: t('wmsMission.autoRun'),
    width: 120,
    key: 'autoRun',
    align: 'center',
    render: (_, record) => (
      <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={record.autoRun} />
    ),
    type: 'custom',
    dialog: {
      renderContent: (_: any, record: any) => (
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={record.autoRun} />
      ),
      defaultValue: false
    }
  },
  {
    title: t('wmsMission.autoAbort'),
    width: 120,
    key: 'autoAbort',
    align: 'center',
    render: (_, record) => (
      <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={record.autoAbort} />
    ),
    type: 'custom',
    dialog: {
      renderContent: (_: any, record: any) => (
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={record.autoAbort} />
      ),
      defaultValue: false
    }
  },
  {
    title: t('wmsMission.creationTime'),
    width: 180,
    key: 'creationTime',
    align: 'center',
    render: (text) => {
      const formatString = formatDate(text as string)
      return <Tooltip title={formatString}>{formatString}</Tooltip>
    },
    ellipsis: true,
    sort: true
  },
  {
    title: t('wmsMission.lastModificationTime'),
    width: 180,
    key: 'lastModificationTime',
    align: 'center',
    render: (text) => {
      const formatString = formatDate(text as string)
      return text ? <Tooltip title={formatString}>{formatString}</Tooltip> : '无'
    },
    ellipsis: true,
    sort: true
  },

  {
    title: t('wmsMission.extraProperties'),
    width: 150,
    key: 'extraProperties',
    align: 'center',
    render: (extraProperties: any) => {
      const keys = Object.keys(extraProperties)
      return keys.length > 0 ? keys.map((label) => <p key={label}>{label}</p>) : '无'
    }
    // dialog: true
    // type: 'custom',
    // dialog: {
    //   renderContent: () => <Configuration></Configuration>
    // }
  }
]

const WmsSubMissionColorStrategy = {
  [WMS_SUB_MISSION_STATUS_ENUM.Received]: '#2196F3',
  [WMS_SUB_MISSION_STATUS_ENUM.Rejected]: '#e74c3c',
  [WMS_SUB_MISSION_STATUS_ENUM.Accepted]: '#2ecc71',
  [WMS_SUB_MISSION_STATUS_ENUM.Running]: '#FF9800',
  [WMS_SUB_MISSION_STATUS_ENUM.Succeeded]: '#2ecc71',
  [WMS_SUB_MISSION_STATUS_ENUM.Failed]: '#e74c3c',
  [WMS_SUB_MISSION_STATUS_ENUM.Canceled]: '#34495e'
}
export const wmsSubMissionFields: Array<MwSearchTableField> = [
  {
    title: '状态',
    width: 150,
    key: 'status',
    align: 'center',
    render: (_, record) => {
      return (
        <>
          <Badge color={WmsSubMissionColorStrategy[record.status as WMS_SUB_MISSION_STATUS_ENUM]}></Badge>
          <span
            className="pl-2"
            style={{ color: WmsSubMissionColorStrategy[record.status as WMS_SUB_MISSION_STATUS_ENUM] }}
          >
            {record.status}
          </span>
        </>
      )
    }
  },
  {
    title: 'ID',
    key: 'id',
    width: 270,
    ellipsis: true
  },
  {
    title: '前置任务',
    width: 250,
    key: 'predecessorIds',
    align: 'center',
    type: 'select',
    dialog: {
      showSearch: true,
      mode: 'multiple'
    }
  },
  {
    title: '优先级',
    width: 100,
    key: 'priority',
    align: 'center',
    render: (_, record) => {
      return <Badge size="small" color={ColorBox[record.priority]} showZero count={record.priority}></Badge>
    },
    dialog: {
      defaultValue: 1
    },
    type: 'number'
  },
  {
    title: '到',
    width: 150,
    key: 'to',
    align: 'center',
    render: (values: string[]) => {
      return values.length > 0 ? (
        <List
          size="small"
          dataSource={values}
          renderItem={(item, index) => (
            <List.Item>
              <Tooltip title={item}>
                <div className="flex items-center overflow-hidden cursor-pointer">
                  <div
                    className={`w-2 h-[12px] `}
                    style={{ backgroundColor: ColorBox[index % ColorBox.length] }}
                    color={ColorBox[index % ColorBox.length]}
                  ></div>
                  <span className="ml-2 overflow-hidden whitespace-nowrap text-ellipsis">{item}</span>
                </div>
              </Tooltip>
            </List.Item>
          )}
        />
      ) : (
        '无'
      )
    },
    type: 'select',
    dialog: {
      showSearch: true,
      mode: 'multiple'
    }
  },
  {
    title: '动作',
    width: 80,
    key: 'action',
    align: 'left',
    type: 'select',
    dialog: true,
    options: [
      {
        label: 'PickUp',
        value: 'PickUp'
      },
      {
        label: 'PutDown',
        value: 'PutDown'
      },
      {
        label: 'Wait',
        value: 'Wait'
      }
    ]
  },
  {
    title: '创建时间',
    width: 150,
    key: 'creationTime',
    align: 'center',
    render: (text) => {
      const formatString = formatDate(text as string)
      return <Tooltip title={formatString}>{formatString}</Tooltip>
    },
    ellipsis: true
  },
  {
    title: '更新时间',
    width: 150,
    key: 'lastModificationTime',
    align: 'center',
    render: (text) => {
      const formatString = formatDate(text as string)
      return text ? <Tooltip title={formatString}>{formatString}</Tooltip> : '无'
    },
    ellipsis: true
  },

  {
    title: '额外信息',
    width: 250,
    key: 'extraProperties',
    align: 'center',
    render: (extraProperties: any) => {
      const keys = Object.keys(extraProperties)
      return keys.length > 0 ? keys.map((label) => <p key={label}>{label}</p>) : '无'
    }
  }
]
