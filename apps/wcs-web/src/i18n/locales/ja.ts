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
    instanceList: {
      nav: '実行履歴'
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
    extraProperties: 'その他のプロパティ',
    action: 'アクション',
    debugMode: 'デバッグモード',
    open: 'オープン',
    close: 'クローズ',
    create: '作成',
    edit: '編集',
    detail: '詳細',
    complete: '完了',
    cancel: 'キャンセル',
    createSubMission: 'サブタスク作成',
    createMissionSuccess: 'ミッションの作成に成功しました',
    editMissionSuccess: 'ミッションの編集に成功しました',
    createSubMissionSuccess: 'サブタスクの作成に成功しました',
    editSubMissionSuccess: 'サブタスクの編集に成功しました',
    completeMissionSuccess: 'ミッションが正常に完了しました',
    cancelMissionSuccess: 'ミッションが正常にキャンセルされました'
  },
  rcsMission: {
    status: 'ステータス',
    id: 'ミッションID',
    predecessorIds: '前のミッション',
    priority: '優先順位',
    to: '宛先',
    vehicles: '呼び出し車両',
    creationTime: '作成時間',
    lastModificationTime: '最終変更時間',
    extraProperties: '追加プロパティ',
    height: '高さ',
    declineHeight: '下降高さ',
    liftHeight: '持ち上げ高さ'
  },
  missionProcess: {
    title: 'ミッション処理',
    addDialog: {
      name: 'ミッション名'
    }
  },
  empty: 'データがありません'
}

export default ja
