const ja = {
  system: 'WCS インテリジェント倉庫制御システム',
  aside: {
    wmsMission: {
      nav: 'WMS ミッション'
    },
    rcsMission: {
      nav: 'RCS ミッション'
    },
    missionProcess: {
      nav: 'ミッション処理'
    },
    device: {
      nav: 'デバイス',
      feature: {
        nav: '機能'
      },
      status: {
        nav: 'ステータス'
      }
    },
    event: {
      nav: 'イベント'
    },
    logs: {
      nav: 'ログ'
    }
  },
  wmsMission: {
    status: 'ステータス',
    id: 'ミッション ID',
    predecessorIds: '前任ミッション',
    priority: '優先度',
    from: '出荷元',
    to: '出荷先',
    autoRun: '自動実行',
    autoAbort: '自動中止',
    creationTime: '作成日時',
    lastModificationTime: '最終変更日時',
    extraProperties: 'その他のプロパティ'
  },
  rcsMission: {
    status: 'ステータス',
    id: 'ミッション ID',
    predecessorIds: '前任ミッション',
    priority: '優先度',
    vehicles: '呼び出し車両',
    creationTime: '作成日時',
    lastModificationTime: '最終変更日時',
    extraProperties: 'その他のプロパティ'
  },
  missionProcess: {
    title: 'ミッション処理',
    addDialog: {
      name: 'ミッション名'
    }
  }
}

export default ja
