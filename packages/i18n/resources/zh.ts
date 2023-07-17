const zh = {
  notFound: {
    subTitle: '访问的页面不存在',
    backHome: '返回首页'
  },
  layout: {
    header: {
      setting: {
        pageStyle: '整体风格设置',
        themeColor: '主题色',
        themes: {
          dark: '暗色菜单风格',
          light: '亮色菜单风格'
        },
        colors: {
          dustRed: '薄暮',
          volcano: '火山',
          sunsetOrange: '日暮',
          cyan: '明青',
          polarGreen: '极光绿',
          daybreakBlue: '拂晓蓝',
          geekBlue: '极客蓝',
          goldenPurple: '酱紫'
        }
      },
      logout: '退出'
    }
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
      debug: '调试',
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
    },
    debugDialog: {
      title: '调试',
      keyValuePair: '键值对',
      key: '键',
      valueType: '值类型',
      value: '值',
      add: '新增',
      jsonInvalid: '请输入有效的JSON数据',
      keyNull: '键不能为空',
      keyPlaceholder: '请输入键名',
      valueTypeNull: '值类型不能为空',
      valueTypePlaceholder: '请选择值类型',
      valueTypeString: '字符串',
      valueTypeNumber: '数值',
      valueTypeBoolean: '布尔值',
      valueNull: '值不能为空',
      valuePlaceholder: '请输入值'
    },
    importDialog: {
      title: '导入JSON文件',
      importText: '点击或拖拽文件导入',
      importHint: '支持JSON文件单个导入'
    },
    multiCheckDialog: {
      selectAll: '全选',
      deselectAll: '取消全选',
      cancel: '取消',
      confirm: '确认'
    },
    menuList: {
      selectAll: '全选'
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
    },
    status: {
      name: '设备',
      connection: '连接状态',
      updateTime: '更新时间',
      key: '名称',
      value: '值'
    }
  },
  event: {
    title: '事件',
    addDialog: {
      name: '事件名',
      cannotContainDecimalPoint: '不能包含小数点'
    }
  }
}

export default zh
