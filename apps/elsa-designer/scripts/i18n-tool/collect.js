const fs = require('fs')
const path = require('path')
const { FilePattern, RootFolderPath, DirPattern, OutputFileName } = require('./common')
const { parseTSJsonFromFile, flattenLanguageJSON } = require('./utils/json')
const json2csv = require('json2csv').parse

// 用于存储收集到的语言数据
const collectedData = []

// 递归查找符合规则的文件
const findFilesInDirectory = (dirPath, pattern) => {
  const files = fs.readdirSync(dirPath)
  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      findFilesInDirectory(filePath, pattern)
    } else if (stat.isFile() && pattern.test(file) && DirPattern.some((d) => dirPath.includes(d))) {
      const fileContent = fs.readFileSync(filePath, 'utf8') // 读取文件内容
      const json = parseTSJsonFromFile(fileContent) // 解析json
      const flattenedData = flattenLanguageJSON(json) // 扁平化
      const flattenedDataWithPath = flattenedData.map((d) => ({ path: dirPath, ...d }))
      collectedData.push(...flattenedDataWithPath)
    }
  })
}

// 开始递归查找
findFilesInDirectory(RootFolderPath, FilePattern)

// 将收集到的数据转换为CSV格式字符串
const csvData = json2csv(collectedData, { fields: Object.keys(collectedData[0]) })

// 将CSV数据写入文件
fs.writeFileSync(path.join(__dirname, OutputFileName), csvData, 'utf-8')

console.log('Language data collected and saved to languageData.csv')
