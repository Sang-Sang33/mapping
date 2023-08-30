// 匹配文件名的正则表达式
const FilePattern = /localizations\.ts$/i
const DirPattern = [
  'elsa-activity-editor-modal',
  'elsa-activity-picker-modal',
  'elsa-version-history-panel',
  'elsa-workflow-definition-editor-screen',
  'elsa-workflow-properties-panel',
  'elsa-workflow-publish-button',
  'elsa-workflow-settings-modal',
  'elsa-workflow-test-panel',
  'elsa-workflow-instance-viewer-screen',
  'elsa-confirm-dialog',
  'elsa-designer-panel',
  'elsa-modal-dialog'
]

// 遍历的根文件夹路径
const RootFolderPath = './src/components'

// 生成csv名称
const OutputFileName = 'elsa-designer-languages.csv'

module.exports = { FilePattern, DirPattern, RootFolderPath, OutputFileName }
