export const resources = {
  en_US: {
    default: {
      Tabs: {
        Settings: {
          Name: 'Settings',
          Fields: {
            Name: {
              Label: 'Name',
              Hint: 'The technical name of the workflow.'
            },
            DisplayName: {
              Label: 'Display Name',
              Hint: 'A user-friendly display name of the workflow.'
            },
            Description: {
              Label: 'Description',
              Hint: ''
            }
          }
        },
        Variables: {
          Name: 'Variables'
        },
        WorkflowContext: {
          Name: 'Workflow Context',
          Fields: {
            Type: {
              Label: 'Type',
              Hint: 'The fully qualified workflow context type name.'
            },
            Fidelity: {
              Label: 'Fidelity',
              Hint: 'The workflow context refresh fidelity controls the behavior of when to load and persist the workflow context.'
            }
          }
        },
        Advanced: {
          Name: 'Advanced',
          Fields: {
            Tag: {
              Label: 'Tag',
              Hint: 'Tags can be used to query workflow definitions with.'
            },
            PersistenceBehavior: {
              Label: 'Persistence Behavior',
              Hint: 'The persistence behavior controls how often a workflow instance is persisted during workflow execution.'
            },
            Channel: {
              Label: 'Channel',
              Hint: 'Select a channel for this workflow to execute in.'
            },
            Singleton: {
              Label: 'Singleton',
              Hint: 'Singleton workflows will only have one active instance executing at a time.'
            }
          }
        }
      },
      Buttons: {
        Save: 'Save',
        Cancel: 'Cancel'
      }
    }
  },
  zh_CN: {
    default: {
      Tabs: {
        Settings: {
          Name: '设置',
          Fields: {
            Name: {
              Label: '名称',
              Hint: '工作流的技术名称。'
            },
            DisplayName: {
              Label: '显示名称',
              Hint: '工作流的用户友好显示名称。'
            },
            Description: {
              Label: '描述',
              Hint: ''
            }
          }
        },
        Variables: {
          Name: '变量'
        },
        WorkflowContext: {
          Name: '工作流上下文',
          Fields: {
            Type: {
              Label: '类型',
              Hint: '完全限定的工作流上下文类型名称。'
            },
            Fidelity: {
              Label: '精度',
              Hint: '工作流上下文刷新精度控制何时加载和持久化工作流上下文。'
            }
          }
        },
        Advanced: {
          Name: '高级',
          Fields: {
            Tag: {
              Label: '标签',
              Hint: '标签可用于查询工作流定义。'
            },
            PersistenceBehavior: {
              Label: '持久化行为',
              Hint: '持久化行为控制工作流实例在工作流执行期间何时被持久化。'
            },
            Channel: {
              Label: '通道',
              Hint: '选择工作流在其中执行的通道。'
            },
            Singleton: {
              Label: '单例',
              Hint: '单例工作流将同时只有一个活动实例在执行。'
            }
          }
        }
      },
      Buttons: {
        Save: '保存',
        Cancel: '取消'
      }
    }
  },

  ja_JP: {
    default: {
      Tabs: {
        Settings: {
          Name: '設定',
          Fields: {
            Name: {
              Label: '名前',
              Hint: 'ワークフローの技術的名称です。'
            },
            DisplayName: {
              Label: '表示名',
              Hint: 'ユーザーフレンドリーな表示名です。'
            },
            Description: {
              Label: '説明',
              Hint: ''
            }
          }
        },
        Variables: {
          Name: '変数'
        },
        WorkflowContext: {
          Name: 'ワークフローコンテキスト',
          Fields: {
            Type: {
              Label: 'タイプ',
              Hint: '完全修飾されたワークフローコンテキストタイプ名です。'
            },
            Fidelity: {
              Label: '信頼性',
              Hint: 'ワークフローコンテキスト更新信頼性は、ワークフローコンテキストをいつ読み込みおよび保存するかを制御します。'
            }
          }
        },
        Advanced: {
          Name: '高度な設定',
          Fields: {
            Tag: {
              Label: 'タグ',
              Hint: 'クエリ用のタグ。'
            },
            PersistenceBehavior: {
              Label: '永続化動作',
              Hint: '永続化動作は、ワークフローインスタンスがワークフロー実行中にどのくらい頻繁に永続化されるかを制御します。'
            },
            Channel: {
              Label: 'チャネル',
              Hint: 'このワークフローが実行されるチャネルを選択します。'
            },
            Singleton: {
              Label: 'シングルトン',
              Hint: 'シングルトンワークフローは、同時に1つのアクティブなインスタンスしか実行されません。'
            }
          }
        }
      },
      Buttons: {
        Save: '保存',
        Cancel: 'キャンセル'
      }
    }
  },
  ko_KR: {
    default: {
      Tabs: {
        Settings: {
          Name: '설정',
          Fields: {
            Name: {
              Label: '이름',
              Hint: '워크플로우의 기술적인 이름입니다.'
            },
            DisplayName: {
              Label: '디스플레이 이름',
              Hint: '사용자가 이해하기 쉬운 워크플로우의 디스플레이 이름입니다.'
            },
            Description: {
              Label: '설명',
              Hint: ''
            }
          }
        },
        Variables: {
          Name: '변수'
        },
        WorkflowContext: {
          Name: '워크플로우 컨텍스트',
          Fields: {
            Type: {
              Label: '유형',
              Hint: '완전한 워크플로우 컨텍스트 유형 이름입니다.'
            },
            Fidelity: {
              Label: '정확도',
              Hint: '워크플로우 컨텍스트 갱신 정확도는 워크플로우 컨텍스트를 언제 로드하고 저장할지를 제어합니다.'
            }
          }
        },
        Advanced: {
          Name: '고급',
          Fields: {
            Tag: {
              Label: '태그',
              Hint: '태그를 사용하여 워크플로우 정의를 쿼리할 수 있습니다.'
            },
            PersistenceBehavior: {
              Label: '지속성 동작',
              Hint: '지속성 동작은 워크플로우 인스턴스를 실행하는 동안 얼마나 자주 저장하는지를 제어합니다.'
            },
            Channel: {
              Label: '채널',
              Hint: '이 워크플로우가 실행될 채널을 선택합니다.'
            },
            Singleton: {
              Label: '싱글톤',
              Hint: '싱글톤 워크플로우는 한 번에 하나의 활성 인스턴스만 실행됩니다.'
            }
          }
        }
      },
      Buttons: {
        Save: '저장',
        Cancel: '취소'
      }
    }
  }
}
