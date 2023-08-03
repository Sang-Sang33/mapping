import { MwSearchTableField } from 'multiway'
import { Badge, Descriptions, Tooltip } from 'antd'
import { formatDate } from '@packages/utils'
import i18n from '@/i18n'
import { RCS_MISSION_STATUS_ENUM, RCS_SUB_MISSION_STATUS_ENUM } from './interface.d'

const t = (key: string) => i18n.t(key)
export const ColorBox = ['green', 'red', 'blue', 'cyan', 'gold', 'red']

const RcsMissionColorStrategy = {
  [RCS_MISSION_STATUS_ENUM.Sent]: '#2196F3',
  [RCS_MISSION_STATUS_ENUM.Rejected]: '#e74c3c',
  [RCS_MISSION_STATUS_ENUM.Accepted]: '#2ecc71',
  [RCS_MISSION_STATUS_ENUM.Running]: '#FF9800',
  [RCS_MISSION_STATUS_ENUM.Completed]: '#2ecc71',
  [RCS_MISSION_STATUS_ENUM.Aborted]: '#e74c3c',
  [RCS_MISSION_STATUS_ENUM.Canceled]: '#34495e'
}
export const rcsMissionfields: Array<MwSearchTableField> = [
  {
    title: t('rcsMission.status'),
    width: 150,
    key: 'status',
    align: 'center',
    render: (_, record) => {
      return (
        <>
          <Badge color={RcsMissionColorStrategy[record.status as RCS_MISSION_STATUS_ENUM]}></Badge>
          <span className="pl-2" style={{ color: RcsMissionColorStrategy[record.status as RCS_MISSION_STATUS_ENUM] }}>
            {record.status}
          </span>
        </>
      )
    }
  },
  {
    title: t('rcsMission.id'),
    key: 'id',
    width: 320,
    ellipsis: true
    // search: true
  },
  {
    title: t('rcsMission.predecessorIds'),
    width: 360,
    key: 'predecessorIds',
    align: 'center',
    type: 'select',
    dialog: {
      showSearch: true,
      mode: 'multiple'
    }
  },
  {
    title: t('rcsMission.priority'),
    width: 150,
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
    type: 'number',
    hidden: true
  },
  {
    title: t('rcsMission.vehicles'),
    width: 150,
    key: 'vehicles',
    align: 'center',
    render: (_, record) =>
      record.vehicles.length > 0 ? record.vehicles.map((v: any) => <p className="block">{v.tag}</p>) : t('empty'),
    dialog: true
  },
  {
    title: t('rcsMission.creationTime'),
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
    title: t('rcsMission.lastModificationTime'),
    width: 180,
    key: 'lastModificationTime',
    align: 'center',
    render: (text) => {
      const formatString = formatDate(text as string)
      return text ? <Tooltip title={formatString}>{formatString}</Tooltip> : t('empty')
    },
    ellipsis: true,
    sort: true
  },

  {
    title: t('rcsMission.extraProperties'),
    width: 150,
    key: 'extraProperties',
    align: 'center',
    render: (extraProperties: any) => {
      const keys = Object.keys(extraProperties)
      return keys.length > 0 ? keys.map((label) => <p key={label}>{label}</p>) : t('empty')
    },
    hidden: true
  }
]

const RcsSubMissionColorStrategy = {
  [RCS_SUB_MISSION_STATUS_ENUM.Sent]: '#2196F3',
  [RCS_SUB_MISSION_STATUS_ENUM.Rejected]: '#e74c3c',
  [RCS_SUB_MISSION_STATUS_ENUM.Accepted]: '#2ecc71',
  [RCS_SUB_MISSION_STATUS_ENUM.Running]: '#FF9800',
  [RCS_SUB_MISSION_STATUS_ENUM.Succeeded]: '#2ecc71',
  [RCS_SUB_MISSION_STATUS_ENUM.Failed]: '#e74c3c',
  [RCS_SUB_MISSION_STATUS_ENUM.Canceled]: '#34495e'
}
export const rcsSubMissionFields: Array<MwSearchTableField> = [
  {
    title: t('rcsMission.status'),
    width: 150,
    key: 'status',
    align: 'center',
    render: (_, record) => {
      return (
        <>
          <Badge color={RcsSubMissionColorStrategy[record.status as RCS_SUB_MISSION_STATUS_ENUM]}></Badge>
          <span
            className="pl-2"
            style={{ color: RcsSubMissionColorStrategy[record.status as RCS_SUB_MISSION_STATUS_ENUM] }}
          >
            {record.status}
          </span>
        </>
      )
    }
  },
  {
    title: t('rcsMission.id'),
    key: 'id',
    width: 270,
    ellipsis: true
  },
  {
    title: t('rcsMission.predecessorIds'),
    width: 250,
    key: 'predecessorIds',
    align: 'center'
  },
  {
    title: t('rcsMission.priority'),
    width: 150,
    key: 'priority',
    align: 'center',
    render: (_, record) => {
      return <Badge size="small" color={ColorBox[record.priority]} showZero count={record.priority}></Badge>
    },
    hidden: true
  },
  {
    title: t('rcsMission.to'),
    width: 150,
    key: 'to',
    align: 'center'
  },
  {
    title: t('rcsMission.vehicles'),
    width: 150,
    key: 'vehicle',
    align: 'center',
    render: (vehicle: string[]) => vehicle || t('empty')
  },
  {
    title: t('rcsMission.height'),
    width: 150,
    key: 'forkArm',
    align: 'center',
    render: (_, record) => (
      <Descriptions column={1}>
        <Descriptions.Item label={t('rcsMission.declineHeight')}>{record.forkArm?.liftHeight}</Descriptions.Item>
        <Descriptions.Item label={t('rcsMission.liftHeight')}>{record.forkArm?.declineHeight}</Descriptions.Item>
      </Descriptions>
    ),
    hidden: true
  },
  {
    title: t('rcsMission.creationTime'),
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
    title: t('rcsMission.lastModificationTime'),
    width: 150,
    key: 'lastModificationTime',
    align: 'center',
    render: (text) => {
      const formatString = formatDate(text as string)
      return text ? <Tooltip title={formatString}>{formatString}</Tooltip> : t('empty')
    },
    ellipsis: true
  },

  {
    title: t('rcsMission.extraProperties'),
    width: 250,
    key: 'extraProperties',
    align: 'center',
    render: (extraProperties: any) => {
      const keys = Object.keys(extraProperties)
      return keys.length > 0 ? keys.map((label) => <p key={label}>{label}</p>) : t('empty')
    },
    hidden: true
  }
]
