import { ElementRef, useRef } from 'react'
import useTableHighlightRow from './useTableHighlightRow'
import useTableScrollToRow from './useTableScrollToRow'
import { Table } from 'antd'
import useScrollToElement from './useScrollToElement'

/**
 * @description: MWTable 点击row时聚焦到到另一个row所在位置并高亮, 需要绑定antTableRef到实际的ant table组件上
 * @param {RefObject} mwTableRef
 * @return {*}
 */
const useTableFocusRow = () => {
  const antTableRef = useRef<ElementRef<typeof Table>>(null)
  const { scroll } = useTableScrollToRow(antTableRef)
  const { highlight } = useTableHighlightRow(antTableRef)
  const { scrollToElement } = useScrollToElement()

  /**
   * @description: 聚焦到行
   * @param {any} value 行的唯一字段的值
   * @return {*}
   */
  const focusToRow = (value: any) => {
    scroll(value)
    highlight(value)

    const tableEl = antTableRef.current
    const tBodyContainer = tableEl?.querySelector('.ant-table-tbody')
    const trNodes = Array.from(tBodyContainer?.childNodes || []) as HTMLTableRowElement[]
    const targetRow = trNodes.find((x) => x.getAttribute('data-row-key') === value)
    targetRow && scrollToElement(targetRow)
  }

  return {
    antTableRef,
    focusToRow
  }
}

export default useTableFocusRow
