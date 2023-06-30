import { useLocalStorageState } from 'ahooks'
import { cloneDeep } from 'lodash'

const useCopyAndPaste = <T = any>(key = 'use-copy-and-paste', defaultValue: any = '') => {
  const [content, setContent] = useLocalStorageState<T>(key, {
    defaultValue
  })

  /**
   * @description: 复制
   * @param {any} content 内容
   * @return {void}
   */
  const copy = (content: T) => {
    setContent(cloneDeep(content))
  }

  /**
   * @description: 粘贴
   * @return {*} 粘贴的内容
   */
  const paste = () => {
    setContent(defaultValue)
    return content
  }

  return { copy, paste, content }
}

export default useCopyAndPaste
