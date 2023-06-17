import { RefObject } from 'react'

const useTableHighlightRow = (tableRef: RefObject<HTMLDivElement>, highlightColor = '#e3e3e3') => {
  /**
   * @description: 高亮table row
   * @param {any} value row的唯一标识的值 如id
   * @return {*}
   */
  const highlight = (value: any) => {
    setTimeout(() => {
      const tableEl = tableRef.current
      const tBodyContainer = tableEl?.querySelector('.ant-table-tbody')

      const trNodes = Array.from(tBodyContainer?.childNodes || []) as HTMLTableRowElement[]
      const targetRow = trNodes.find((x) => x.getAttribute('data-row-key') === value)

      if (targetRow) {
        targetRow.style.backgroundColor = highlightColor
        const callback = () => {
          targetRow.style.backgroundColor = ''
          tableEl?.removeEventListener('click', callback)
        }
        tableEl?.addEventListener('click', callback)
      }
    })
  }

  return { highlight }
}

export default useTableHighlightRow
