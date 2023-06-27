export const resources = {
  en_US: {
    default: {
      Buttons: {
        Save: 'Save',
        Cancel: 'Cancel'
      },
      Tabs: {
        Properties: {
          Name: 'Properties'
        },
        Common: {
          Name: 'Common',
          Fields: {
            Name: {
              Label: 'Name',
              Hint: 'The technical name of the activity.'
            },
            DisplayName: {
              Label: 'Display Name',
              Hint: 'The friendly name of the activity.'
            },
            Description: {
              Label: 'Description',
              Hint: 'A custom description for this activity.'
            }
          }
        },
        Storage: {
          Name: 'Storage',
          Sections: {
            WorkflowContext: 'Workflow Context',
            WorkflowInstance: 'Workflow Instance'
          },
          Fields: {
            LoadWorkflowContext: {
              Label: 'Load Workflow Context',
              Hint: 'When enabled, this will load the workflow context into memory before executing this activity.'
            },
            SaveWorkflowContext: {
              Label: 'Save Workflow Context',
              Hint: 'When enabled, this will save the workflow context back into storage after executing this activity.'
            },
            SaveWorkflowInstance: {
              Label: 'Save Workflow Instance',
              Hint: 'When enabled, this will save the workflow instance back into storage right after executing this activity.'
            },
            ActivityOutput: {
              Title: 'Activity Output',
              SubTitle: 'Configure the desired storage for each output property of this activity.'
            },
            ActivityInput: {
              Title: 'Activity Input',
              SubTitle: 'Configure the desired storage for each input property of this activity.'
            }
          }
        }
      }
    }
  },
  zh_CN: {
    default: {
      Buttons: {
        Save: '保存',
        Cancel: '取消'
      },
      Tabs: {
        Properties: {
          Name: '属性'
        },
        Common: {
          Name: '通用',
          Fields: {
            Name: {
              Label: '名称',
              Hint: '该活动的技术名称。'
            },
            DisplayName: {
              Label: '展示名称',
              Hint: '该活动的呈现名称。'
            },
            Description: {
              Label: '描述',
              Hint: '对这项活动的自定义描述。'
            }
          }
        },
        Storage: {
          Name: '存储',
          Sections: {
            WorkflowContext: '工作流上下文',
            WorkflowInstance: '工作流实例'
          },
          Fields: {
            LoadWorkflowContext: {
              Label: '加载工作流上下文',
              Hint: '启用后，在执行此活动之前将工作流上下文加载到内存中。'
            },
            SaveWorkflowContext: {
              Label: '保存工作流上下文',
              Hint: '启用后，在执行此活动后将工作流上下文保存回存储。'
            },
            SaveWorkflowInstance: {
              Label: '保存工作流实例',
              Hint: '启用后，在执行此活动后将工作流实例保存回存储。'
            },
            ActivityOutput: {
              Title: '活动输出',
              SubTitle: '为此活动的每个输出属性配置所需的存储方式。'
            },
            ActivityInput: {
              Title: '活动输入',
              SubTitle: '为此活动的每个输入属性配置所需的存储方式。'
            }
          }
        }
      }
    }
  },
  ja_JP: {
    default: {
      Buttons: {
        Save: '保存',
        Cancel: 'キャンセル'
      },
      Tabs: {
        Properties: {
          Name: 'プロパティ'
        },
        Common: {
          Name: '共通',
          Fields: {
            Name: {
              Label: '名前',
              Hint: 'アクティビティの技術名。'
            },
            DisplayName: {
              Label: '表示名',
              Hint: 'アクティビティのフレンドリーな名前。'
            },
            Description: {
              Label: '説明',
              Hint: 'このアクティビティのカスタム説明。'
            }
          }
        },
        Storage: {
          Name: 'ストレージ',
          Sections: {
            WorkflowContext: 'ワークフローコンテキスト',
            WorkflowInstance: 'ワークフローインスタンス'
          },
          Fields: {
            LoadWorkflowContext: {
              Label: 'ワークフローコンテキストをロード',
              Hint: '有効にすると、このアクティビティを実行する前にワークフローコンテキストをメモリにロードします。'
            },
            SaveWorkflowContext: {
              Label: 'ワークフローコンテキストを保存',
              Hint: '有効にすると、このアクティビティを実行した後、ワークフローコンテキストをストレージに保存します。'
            },
            SaveWorkflowInstance: {
              Label: 'ワークフローインスタンスを保存',
              Hint: '有効にすると、このアクティビティを実行した直後にワークフローインスタンスをストレージに保存します。'
            },
            ActivityOutput: {
              Title: 'アクティビティ出力',
              SubTitle: 'このアクティビティの各出力プロパティの希望のストレージを構成します。'
            },
            ActivityInput: {
              Title: 'アクティビティ入力',
              SubTitle: 'このアクティビティの各入力プロパティの希望のストレージを構成します。'
            }
          }
        }
      }
    }
  },
  ko_KR: {
    default: {
      Buttons: {
        Save: '저장',
        Cancel: '취소'
      },
      Tabs: {
        Properties: {
          Name: '속성'
        },
        Common: {
          Name: '공통',
          Fields: {
            Name: {
              Label: '이름',
              Hint: '활동의 기술적 이름입니다.'
            },
            DisplayName: {
              Label: '표시 이름',
              Hint: '활동의 친근한 이름입니다.'
            },
            Description: {
              Label: '설명',
              Hint: '이 활동에 대한 사용자 정의 설명입니다.'
            }
          }
        },
        Storage: {
          Name: '저장소',
          Sections: {
            WorkflowContext: '워크플로우 컨텍스트',
            WorkflowInstance: '워크플로우 인스턴스'
          },
          Fields: {
            LoadWorkflowContext: {
              Label: '워크플로우 컨텍스트 로드',
              Hint: '활성화하면 이 활동을 실행하기 전에 워크플로우 컨텍스트를 메모리에 로드합니다.'
            },
            SaveWorkflowContext: {
              Label: '워크플로우 컨텍스트 저장',
              Hint: '활성화하면 이 활동을 실행한 후 워크플로우 컨텍스트를 다시 저장합니다.'
            },
            SaveWorkflowInstance: {
              Label: '워크플로우 인스턴스 저장',
              Hint: '활성화하면 이 활동을 실행한 바로 다음에 워크플로우 인스턴스를 다시 저장합니다.'
            },
            ActivityOutput: {
              Title: '활동 출력',
              SubTitle: '이 활동의 각 출력 속성에 대한 원하는 저장소를 구성합니다.'
            },
            ActivityInput: {
              Title: '활동 입력',
              SubTitle: '이 활동의 각 입력 속성에 대한 원하는 저장소를 구성합니다.'
            }
          }
        }
      }
    }
  }
}
