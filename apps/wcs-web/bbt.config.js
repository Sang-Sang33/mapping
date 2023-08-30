/** @type { import('@wakeadmin/bbt').IBBTProjectConfig } */

const parseTSJsonFromFile = (content) => {
  const cleanedContent = content
    .replace(/(const\s+\w+\s+=|export\s+default\s+\w+)/g, '') // 移除const ** = ; export default **
    .replace(/'/g, '"') // 值处理双引号
    .replace(/(\b\w+\b)\s*:/g, '"$1":') // 键处理双引号
    .trimLeft() // 处理前面空格
    .trim() // 处理后面空格
  return JSON.parse(cleanedContent)
}
module.exports = {
  langs: ['zh_CN', 'en_US', 'ja', 'ko'],
  test: '(zh_CN|en_US|ja|ko).ts$',
  exclude: ['node_modules'],
  outFileExtName: 'ts',
  bbtExcelPath: './wcs-web-languages.csv',
  plugins: {
    parser: {
      parse: (content) => {
        return parseTSJsonFromFile(content)
      },
      stringify: (record) => {
        const jsonString = JSON.stringify(record, null, 2)
        const fileContent = `const resource = ${jsonString}\nexport default resource`
        return fileContent
      }
    }
  }
}
