/* eslint-disable no-prototype-builtins */
import { useState, useEffect } from 'react'

const defaultTransform = {
  label: 'label',
  value: 'value',
  children: 'children',
  parentId: 'parentId',
  rootValue: null,
  keepLeaf: false
}

interface Iconfig {
  transform?: any
  keepOrigin?: boolean
  isStringArray?: boolean // 是否是纯字符串的数组
}

/** 递归寻找下层 */
const loop = (options: Array<any>, level: number = 0, transform: any, keepOrigin: boolean): Array<any> => {
  return options.map((option: any, index: number) => {
    let newOption: any = { value: undefined }
    if (typeof transform === 'function') {
      newOption = transform(option, index, level)
    } else {
      for (let key in transform) {
        newOption[key] = option[transform[key]]
      }
      // let { label, value, children, parentId } = { ...defaultTransform, ...transform } as any;
      // newOption = {
      // 	label: option[label],
      // 	value: option[value],
      // 	children: option[children]
      // };
      if (keepOrigin) {
        newOption = {
          ...option,
          ...newOption
        }
      }
      // if ((option as any).hasOwnProperty(parentId)) {
      // 	newOption[parentId] = option[parentId];
      // }
    }

    // 如果还有子元素，递归下级
    if (newOption.children && newOption.children.length) {
      newOption.children = loop(newOption.children, level + 1, transform, keepOrigin)
    }
    return newOption
  })
}

const useOptions = <T = any,>(api: () => Promise<any>, config: Iconfig) => {
  const { transform, keepOrigin = false, isStringArray = false } = config
  const [options, setOptions] = useState<T[]>([])
  useEffect(() => {
    api().then((res) => {
      let ooptions = res
      transform && (ooptions = loop(ooptions, 0, transform, keepOrigin))
      isStringArray &&
        (ooptions = ooptions.map((it: any) => {
          return { value: it, label: it, id: it }
        }))
      setOptions(ooptions)
    })
  }, [])

  return { options }
}

export default useOptions
