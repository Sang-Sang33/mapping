// 解析文件中的JSON对象
const parseTSJsonFromFile = (content) => {
  const cleanedContent = content
    .replace(/(export\s+const\s+\w+\s+=)/g, '') // 移除const ** = ; export default **
    .replace(/'/g, '"') // 值处理双引号
    .replace(/(\b\w+\b)\s*:/g, '"$1":') // 键处理双引号
    .replace(/;/g, '') // 处理;
    .trimLeft() // 处理前面空格
    .trim() // 处理后面空格
  return JSON.parse(cleanedContent)
}

/**
 * 将: { zh_CN: { Buttons: { Save:  '保存' }}, en_US: { Buttons: Save: 'Save'}}
 * 转换成:  [{ key: 'Buttons.Save',  zh_CN: '保存’, en_US: 'Save' }]
 * @param {*} data
 */
const flattenLanguageJSON = (data) => {
  const tempList = []

  /**
   * 将: { zh_CN: { Buttons: { Save:  '保存' }}, en_US: { Buttons: Save: 'Save'}}
   * 转换成:  [{ key: 'Buttons.Save',  zh_CN: '保存’ }, { key: 'Buttons.Save',  en_US: 'Save’ }]
   */
  const __flattenLanguageJSON = (obj, parentLanguageKey, currentKey = '') => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        __flattenLanguageJSON(obj[key], parentLanguageKey, currentKey ? `${currentKey}.${key}` : key)
      } else {
        const item = {}
        item.key = `${currentKey}.${key}`.replace(`${parentLanguageKey}.`, '')
        item[parentLanguageKey] = obj[key]
        tempList.push(item)
      }
    }
  }
  for (const key in data) {
    __flattenLanguageJSON(data[key], key)
  }

  /**
   * 将: [{ key: 'Buttons.Save',  zh_CN: '保存’ }, { key: 'Buttons.Save',  en_US: 'Save’ }]
   * 转换成: [{ key: 'Buttons.Save',  zh_CN: '保存’, en_US: 'Save' }]
   */
  const resultList = []
  tempList.forEach((item) => {
    let findItem = resultList.find((r) => r.key === item.key)
    if (findItem) {
      for (let key in item) {
        findItem[key] = item[key]
      }
    } else {
      resultList.push(item)
    }
  })

  return resultList
}

module.exports = { parseTSJsonFromFile, flattenLanguageJSON }
