import React, { memo, useState } from 'react'
import type { FC } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { MwSearchTable, MwSearchTableField } from 'multiway'
import { Button, Card } from 'antd'
import { formatDate, getLocalLibLocale } from '@packages/utils'
import useWorkflowIframe from '@packages/ui/components/workflow-engine/hooks/useWorkflowIframe'
import { useWcsRequest } from '@packages/services'
import { Loading } from '@packages/ui'

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
    title: 'ID',
    key: 'id',
    search: {
      type: 'search',
      // 把这个查询条件放到右侧
      position: 'more'
    }
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '状态',
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
    title: '创建时间',
    key: 'createdAt',
    render: (_, record) => record.createdAt && formatDate(record.createdAt),
    sort: true,
    sortDirections: ['descend']
  },
  {
    title: '最后执行时间',
    key: 'lastExecutedAt',
    render: (_, record) => record.lastExecutedAt && formatDate(record.lastExecutedAt),
    sort: true,
    sortDirections: ['descend']
  },
  {
    title: '完成时间',
    key: 'finishedAt',
    render: (_, record) => record.finishedAt && formatDate(record.finishedAt),
    sort: true,
    sortDirections: ['descend']
  },
  {
    title: '故障时间',
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
    tab: '任务处理'
  },
  {
    key: ETabKey.FUNCTION,
    tab: '设备'
  },
  {
    key: ETabKey.EVENT,
    tab: '事件'
  }
]

const Instance: FC<IProps> = (props) => {
  const { workflowEngineUrl } = props
  const { fetchMissionProcessInstanceList, fetchEventInstanceList, fetchDeviceFunctionInstanceList } = useWcsRequest()
  const [workflowInstanceId, setWorkflowInstanceId] = useState('')
  const [workflowInstanceDisplayName, setWorkflowInstanceDisplayName] = useState('')
  const [activeTabKey, setActiveTabKey] = useState<ETabKey>(ETabKey.MISSION_PROCESS)
  const mergeFields: MwSearchTableField[] = [
    ...fields,
    {
      title: '操作',
      key: 'aciton',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setWorkflowInstanceId(record.id)
              setWorkflowInstanceDisplayName(record.displayName)
            }}
          >
            查看
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
  const { WorkflowIframe, subscribeMessage } = useWorkflowIframe(workflowEngineUrl, <Loading></Loading>)

  const workflowApi = {
    workflowInstanceApi: {
      getWorkflowInstanceById: {
        url: `/api/wcs/${activeTabKey}/instance`
      }
    },
    activitiesApi: {
      list: {
        url: `/api/wcs/${activeTabKey}/activities`
      }
    }
  }
  subscribeMessage('before-initialized', (iframeEl) => {
    const contentWindow = iframeEl?.contentWindow
    contentWindow?.postMessage(
      {
        type: 'api',
        data: workflowApi
      },
      '*'
    )
  })

  return (
    <div className="h-full">
      <Card
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={(tab) => {
          setActiveTabKey(tab as ETabKey)
          setWorkflowInstanceId('')
        }}
      >
        {workflowInstanceId ? (
          <Card
            title={
              <div className="flex items-center gap-2">
                <LeftOutlined className="cursor-pointer" onClick={() => setWorkflowInstanceId('')} />
                <span>{workflowInstanceDisplayName}</span>
              </div>
            }
            bodyStyle={{ height: '827px' }}
          >
            <WorkflowIframe mode="view" culture={locale} workflowInstanceId={workflowInstanceId}></WorkflowIframe>
          </Card>
        ) : (
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
            extraSizeVisible
            pagination={{
              showSizeChanger: true
            }}
          />
        )}
      </Card>
    </div>
  )
}

export default memo(Instance)
