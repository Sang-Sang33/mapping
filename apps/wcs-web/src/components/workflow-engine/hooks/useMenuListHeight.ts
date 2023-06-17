import { useEffect, useState } from 'react'

/**
 * @description: 计算menuList组件的高度
 * @param {number} listLength list长度
 * @param {*} menuListDesignHeight menuList在1080设计稿下的高度
 * @param {*} itemHeight
 * @param {*} heightAuto 高度是否自动改变
 * @return {*}
 */
const useMenuListHeight = (listLength: number, menuListDesignHeight = 886, itemHeight = 50, heightAuto = false) => {
  const [menuListHeight, setMenuListHeight] = useState<number>(menuListDesignHeight)
  useEffect(() => {
    const resizeVirtualList = () => {
      const remainHeight = 1080 - menuListDesignHeight
      const menuListDimensionHeight = window.innerHeight - remainHeight
      const totalHeight = itemHeight * listLength

      setMenuListHeight(heightAuto && totalHeight < menuListDimensionHeight ? totalHeight : menuListDimensionHeight)
    }

    resizeVirtualList()
    window.addEventListener('resize', resizeVirtualList)

    return () => {
      window.removeEventListener('resize', resizeVirtualList)
    }
  }, [listLength])

  return menuListHeight
}

export default useMenuListHeight
