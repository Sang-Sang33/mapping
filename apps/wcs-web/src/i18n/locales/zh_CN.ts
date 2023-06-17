const zh_CN = {
  notfound: '访问的页面不存在',
  back_home: '返回首页',
  home: '首页',
  system: 'WCS仓库控制系统',
  header: {
    page_style: '整体风格设置',
    theme_color: '主题色',
    logout: '退出'
  },
  aside: {
    wmsMission: {
      nav: 'WMS任务'
    },
    rcsMission: {
      nav: 'RCS任务'
    },
    missionProcess: {
      nav: '任务处理'
    },
    device: {
      nav: '设备',
      feature: {
        nav: '功能'
      },
      status: {
        nav: '状态'
      }
    },
    event: {
      nav: '事件'
    },
    logs: {
      nav: '日志'
    }
  },
  wmsMission: {
    status: '状态',
    id: '任务ID',
    predecessorIds: '前置任务',
    priority: '优先级',
    from: '从',
    to: '到',
    autoRun: '自动运行',
    autoAbort: '自动终止',
    creationTime: '创建时间',
    lastModificationTime: '更新时间',
    extraProperties: '额外信息'
  },
  rcsMission: {
    status: '状态',
    id: '任务ID',
    predecessorIds: '前置任务',
    priority: '优先级',
    vehicles: '调用车辆',
    creationTime: '创建时间',
    lastModificationTime: '更新时间',
    extraProperties: '额外信息'
  },
  workflowEngine: {
    empty: {
      goToCreate: '去创建',
      chooseWorkflow: '请选择工作流'
    },
    action: {
      title: '操作',
      add: '添加',
      edit: '编辑',
      delete: '删除',
      copy: '复制',
      paste: '粘贴',
      import: '导入',
      export: '导出',
      deletePopConfirmTitle: '确认删除',
      copyDialogTitle: '请选择需要复制的数据',
      exportDialogTitle: '请选择需要导出的数据',
      deleteSuccess: '删除成功',
      addSuccess: '添加成功',
      updateSuccess: '编辑成功',
      copySuccess: '已复制',
      pasteNull: '请先复制数据',
      pasteInvalid: '不能粘贴到',
      importInvalid: '不能导入到',
      deleteCancel: '取消删除',
      fileInvalid: '请选择JSON格式的文件',
      pasteSuccess: '粘贴成功',
      importSuccess: '导入成功',
      selectNull: '请先选择数据'
    }
  },
  missionProcess: {
    title: '任务处理',
    addDialog: {
      name: '任务名'
    }
  },
  device: {
    title: '设备',
    edit: '编辑设备',
    addDialog: {
      deviceName: '设备名',
      functionName: '功能',
      behaviour: '行为',
      cannotContainDecimalPoint: '不能包含小数点',
      behaviourSwitchChecked: '主动',
      behaviourSwitchUnChecked: '被动'
    },
    editDialog: {
      oldName: '旧设备名',
      newName: '新设备名'
    }
  },
  function: {
    title: '功能'
  },
  event: {
    title: '事件',
    addDialog: {
      name: '事件名',
      cannotContainDecimalPoint: '不能包含小数点'
    }
  }
}

export default zh_CN
