const en = {
  notFound: {
    subTitle: 'Sorry, the page you visited does not exist.',
    backHome: 'Back Home'
  },
  layout: {
    header: {
      setting: {
        pageStyle: 'Page Style Setting',
        themeColor: 'Theme Color',
        themes: {
          dark: 'Dark style',
          light: 'Light style'
        },
        colors: {
          dustRed: 'Dust Red',
          volcano: 'Volcano',
          sunsetOrange: 'Sunset Orange',
          cyan: 'Cyan',
          polarGreen: 'Polar Green',
          daybreakBlue: 'Daybreak Blue',
          geekBlue: 'Geek Glue',
          goldenPurple: 'Golden Purple'
        }
      },
      logout: 'Logout'
    }
  },
  workflowEngine: {
    empty: {
      goToCreate: 'Go to Create',
      chooseWorkflow: 'Choose a Workflow'
    },
    action: {
      title: 'Actions',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      copy: 'Copy',
      paste: 'Paste',
      import: 'Import',
      export: 'Export',
      debug: 'Debug',
      deletePopConfirmTitle: 'Confirm to delete ',
      copyDialogTitle: 'Select data to copy',
      exportDialogTitle: 'Select data to export',
      deleteSuccess: 'Delete successfully',
      addSuccess: 'Add successfully',
      updateSuccess: 'Update successfully',
      copySuccess: 'Copy successfully',
      pasteNull: 'Please copy data first',
      pasteInvalid: 'Cannot paste to',
      importInvalid: 'Cannot import to',
      deleteCancel: 'Cancel deletion',
      fileInvalid: 'Please select a JSON file',
      pasteSuccess: 'Paste successfully',
      importSuccess: 'Import successfully',
      selectNull: 'Please select data first'
    },
    debugDialog: {
      title: 'Debug',
      keyValuePair: 'Key-Value Pair',
      key: 'Key',
      valueType: 'Value Type',
      value: 'Value',
      add: 'Add',
      jsonInvalid: 'Please input valid JSON data',
      keyNull: 'Key cannot be empty',
      keyPlaceholder: 'Input key',
      valueTypeNull: 'Value type cannot be empty',
      valueTypePlaceholder: 'Select value type',
      valueTypeString: 'String',
      valueTypeNumber: 'Number',
      valueTypeBoolean: 'Boolean',
      valueNull: 'Value cannot be empty',
      valuePlaceholder: 'Input value'
    },
    importDialog: {
      title: 'Import a JSON file',
      importText: 'Click or drag a file to import',
      importHint: 'Support single file import'
    },
    multiCheckDialog: {
      selectAll: 'Select all',
      deselectAll: 'Deselect all',
      cancel: 'Close',
      confirm: 'Confirm'
    },
    menuList: {
      selectAll: 'Select all'
    }
  },
  missionProcess: {
    title: 'Mission Process',
    id: 'ID',
    name: 'Name',
    workflowStatus: 'Status',
    createdAt: 'Created Time',
    lastExecutedAt: 'Last Execution Time',
    finishedAt: 'Finished Time',
    faultedAt: 'Faulted Time',
    action: 'Action',
    view: 'View'
  },
  device: {
    title: 'Device',
    edit: 'Edit Device',
    addDialog: {
      deviceName: 'Device Name',
      functionName: 'Function',
      behaviour: 'Behavior',
      cannotContainDecimalPoint: 'Cannot contain a decimal point',
      behaviourSwitchChecked: 'Active',
      behaviourSwitchUnChecked: 'Passive'
    },
    editDialog: {
      oldName: 'Old Device Name',
      newName: 'New Device Name'
    },
    status: {
      name: 'Device',
      connection: 'Connection',
      updateTime: 'Update Time',
      key: 'Key',
      value: 'Value'
    }
  },
  function: {
    title: 'Function'
  },
  event: {
    title: 'Event',
    addDialog: {
      name: 'Event Name',
      cannotContainDecimalPoint: 'Cannot contain a decimal point'
    }
  }
}

export default en
