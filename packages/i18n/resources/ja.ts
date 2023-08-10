const ja = {
  notFound: {
    subTitle: '申し訳ありませんが、アクセスしたページは存在しません。',
    backHome: 'ホームに戻る'
  },
  layout: {
    header: {
      setting: {
        pageStyle: 'ページスタイル設定',
        themeColor: 'テーマカラー',
        themes: {
          dark: 'ダークスタイル',
          light: 'ライトスタイル'
        },
        colors: {
          dustRed: 'ダストレッド',
          volcano: 'ボルケーノ',
          sunsetOrange: 'サンセットオレンジ',
          cyan: 'シアン',
          polarGreen: 'ポーラーグリーン',
          daybreakBlue: 'デイブレイクブルー',
          geekBlue: 'ギークブルー',
          goldenPurple: 'ゴールデンパープル'
        }
      },
      logout: 'ログアウト'
    }
  },
  workflowEngine: {
    empty: {
      goToCreate: '作成に進む',
      chooseWorkflow: 'ワークフローを選択してください'
    },
    action: {
      title: 'アクション',
      add: '追加',
      edit: '編集',
      delete: '削除',
      copy: 'コピー',
      paste: '貼り付け',
      import: 'インポート',
      export: 'エクスポート',
      debug: 'デバッグ',
      deletePopConfirmTitle: '削除の確認',
      copyDialogTitle: 'コピーするデータを選択してください',
      exportDialogTitle: 'エクスポートするデータを選択してください',
      deleteSuccess: '削除が成功しました',
      addSuccess: '追加が成功しました',
      updateSuccess: '編集が成功しました',
      copySuccess: 'コピーが成功しました',
      pasteNull: 'まずデータをコピーしてください',
      pasteInvalid: '次に貼り付けることはできません',
      importInvalid: '次にインポートすることはできません',
      deleteCancel: '削除をキャンセル',
      fileInvalid: 'JSON形式のファイルを選択してください',
      pasteSuccess: '貼り付けが成功しました',
      importSuccess: 'インポートが成功しました',
      selectNull: 'まずデータを選択してください'
    },
    debugDialog: {
      title: 'デバッグ',
      keyValuePair: 'キーと値のペア',
      key: 'キー',
      valueType: '値のタイプ',
      value: '値',
      add: '追加',
      jsonInvalid: '有効なJSONデータを入力してください',
      keyNull: 'キーは空にできません',
      keyPlaceholder: 'キーを入力してください',
      valueTypeNull: '値のタイプは空にできません',
      valueTypePlaceholder: '値のタイプを選択してください',
      valueTypeString: '文字列',
      valueTypeNumber: '数値',
      valueTypeBoolean: 'ブール値',
      valueNull: '値は空にできません',
      valuePlaceholder: '値を入力してください'
    },
    importDialog: {
      title: 'JSONファイルをインポート',
      importText: 'ファイルをクリックまたはドラッグしてインポート',
      importHint: '単一ファイルのインポートをサポート'
    },
    multiCheckDialog: {
      selectAll: 'すべて選択',
      deselectAll: 'すべて選択解除',
      cancel: 'キャンセル',
      confirm: '確認'
    },
    menuList: {
      selectAll: 'すべて選択'
    }
  },
  missionProcess: {
    title: 'ミッション処理',
    id: 'ID',
    name: '名前',
    workflowStatus: 'ステータス',
    createdAt: '作成された時間',
    lastExecutedAt: '最終実行時間',
    finishedAt: '完了時間',
    faultedAt: '障害発生時間',
    action: 'アクション',
    view: '表示'
  },
  device: {
    title: 'デバイス',
    edit: 'デバイスの編集',
    addDialog: {
      deviceName: 'デバイス名',
      functionName: '機能',
      behaviour: '動作',
      cannotContainDecimalPoint: '小数点を含めることはできません',
      behaviourSwitchChecked: 'アクティブ',
      behaviourSwitchUnChecked: 'パッシブ'
    },
    editDialog: {
      oldName: '旧デバイス名',
      newName: '新しいデバイス名'
    },
    status: {
      name: 'デバイス',
      connection: '接続',
      updateTime: '更新時間',
      key: 'キー',
      value: '値'
    }
  },
  function: {
    title: '機能'
  },
  event: {
    title: 'イベント',
    addDialog: {
      name: 'イベント名',
      cannotContainDecimalPoint: '小数点を含めることはできません'
    }
  }
}

export default ja
