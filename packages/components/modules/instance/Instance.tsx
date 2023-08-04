import React, { memo, useState } from 'react'
import type { FC } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { MwSearchTable, MwSearchTableField } from 'multiway'
import { Button, Card } from 'antd'
import { TOptions } from 'i18next'
import { formatDate, getLocalLibLocale } from '@packages/utils'
import { useWcsRequest } from '@packages/services'
import { i18n } from '@packages/i18n'
import WorkflowIframeBase, {
  type TMessageEffectItem
} from '@packages/ui/components/workflow-engine/components/workflow-iframe/WorkflowIframeBase'

const t = (key: string, options: TOptions = { ns: 'missionProcess' }) => i18n.t(key, options)
interface IProps {
  workflowEngineUrl: string
}

enum ETabKey {
  MISSION_PROCESS = 'mission-process',
  FUNCTION = 'function',
  EVENT = 'event'
}

const fields: Array<MwSearchTableField> = [
  {
    title: t('id'),
    key: 'id',
    search: {
      type: 'search',
      // 把这个查询条件放到右侧
      position: 'more'
    }
  },
  {
    title: t('name'),
    key: 'name'
  },
  {
    title: t('workflowStatus'),
    key: 'workflowStatus',
    type: 'select',
    options: [
      { label: 'Running', value: 'Running' },
      { label: 'Suspended', value: 'Suspended' },
      { label: 'Finished', value: 'Finished' },
      { label: 'Faulted', value: 'Faulted' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'Idle', value: 'Idle' }
    ],
    filter: true
  },
  {
    title: t('createdAt'),
    key: 'createdAt',
    render: (_, record) => record.createdAt && formatDate(record.createdAt),
    sort: true,
    sortDirections: ['descend']
  },
  {
    title: t('lastExecutedAt'),
    key: 'lastExecutedAt',
    render: (_, record) => record.lastExecutedAt && formatDate(record.lastExecutedAt),
    sort: true,
    sortDirections: ['descend']
  },
  {
    title: t('finishedAt'),
    key: 'finishedAt',
    render: (_, record) => record.finishedAt && formatDate(record.finishedAt),
    sort: true,
    sortDirections: ['descend']
  },
  {
    title: t('faultedAt'),
    key: 'faultedAt',
    render: (_, record) => record.faultedAt && formatDate(record.faultedAt)
  }
]

const orderByKeyMap: Record<string, string> = {
  createdAt: 'Started',
  lastExecutedAt: 'LastExecuted',
  finishedAt: 'Finished'
}

const tabList = [
  {
    key: ETabKey.MISSION_PROCESS,
    tab: t('title', { ns: 'missionProcess' })
  },
  {
    key: ETabKey.FUNCTION,
    tab: t('title', { ns: 'device' })
  },
  {
    key: ETabKey.EVENT,
    tab: t('title', { ns: 'event' })
  }
]

const Instance: FC<IProps> = (props) => {
  const { workflowEngineUrl } = props
  const { fetchMissionProcessInstanceList, fetchEventInstanceList, fetchDeviceFunctionInstanceList } = useWcsRequest()
  const [workflowInstanceId, setWorkflowInstanceId] = useState('')
  const [activeTabKey, setActiveTabKey] = useState<ETabKey>(ETabKey.MISSION_PROCESS)
  const mergeFields: MwSearchTableField[] = [
    ...fields,
    {
      title: t('action'),
      key: 'aciton',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setWorkflowInstanceId(record.id)
            }}
          >
            {t('view')}
          </Button>
        )
      }
    }
  ]
  const tabApiMap = {
    [ETabKey.MISSION_PROCESS]: fetchMissionProcessInstanceList,
    [ETabKey.EVENT]: fetchEventInstanceList,
    [ETabKey.FUNCTION]: fetchDeviceFunctionInstanceList
  }

  const locale = getLocalLibLocale('workflowEngine')

  const workflowApi = {
    workflowInstanceApi: {
      getWorkflowInstanceById: {
        url: `/api/wcs/${activeTabKey}/instance`
      },
      getWorkflowRegistryById: {
        url: `/api/wcs/${activeTabKey}/instance/registry`
      },
      getWorkflowInstanceExecutionLogById: {
        url: `/api/wcs/${activeTabKey}/instance`
      }
    },
    activitiesApi: {
      list: {
        url: activeTabKey === ETabKey.FUNCTION ? `/api/wcs/device/activities` : `/api/wcs/${activeTabKey}/activities`
      }
    }
  }

  const messageEffectList: TMessageEffectItem[] = [
    {
      type: 'before-initialized',
      callback: (iframeEl) => {
        const contentWindow = iframeEl?.contentWindow
        contentWindow?.postMessage(
          {
            type: 'api',
            data: workflowApi
          },
          '*'
        )
      }
    }
  ]

  return (
    <div className="h-full">
      <Card
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={(tab) => {
          setActiveTabKey(tab as ETabKey)
        }}
        bodyStyle={{ padding: '0 24px 24px' }}
        tabProps={{
          onTabClick: () => {
            setWorkflowInstanceId('')
          }
        }}
      >
        {workflowInstanceId ? (
          // <Card
          //   title={
          //     <div className="flex items-center gap-2">
          //       <LeftOutlined className="cursor-pointer" onClick={() => setWorkflowInstanceId('')} />
          //       <span>{workflowInstanceName}</span>
          //     </div>
          //   }
          //   bodyStyle={{ height: '823px', padding: 0 }}
          // >
          <div style={{ height: '790px' }}>
            <WorkflowIframeBase
              workflowEngineUrl={workflowEngineUrl}
              mode="view"
              culture={locale}
              workflowInstanceId={workflowInstanceId}
              messageEffectList={messageEffectList}
            ></WorkflowIframeBase>
          </div>
        ) : (
          // </Card>
          <MwSearchTable
            key={activeTabKey}
            api={async (params) => {
              const { Search, PageNumber, PageSize, Filter, Sorting } = params
              const listApi = tabApiMap[activeTabKey]

              const { items, totalCount } = await listApi({
                page: PageNumber - 1,
                pageSize: PageSize,
                workflowStatus: Filter.workflowStatus?.[0] || null,
                orderBy: Sorting[0]?.order ? orderByKeyMap[Sorting[0]?.key] : null,
                searchTerm: Search.id || null
              })

              return {
                items,
                totalCount
              }
            }}
            // data={data}
            fields={mergeFields}
            rowKey="id"
            searchExtend={{ inline: true }}
            compact
            extraRefreshVisible
            pagination={{
              showSizeChanger: true
            }}
            tableExtend={{
              size: 'middle'
            }}
          />
        )}
      </Card>
    </div>
  )
}

export default memo(Instance)
