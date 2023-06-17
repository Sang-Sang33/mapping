import { RefObject } from 'react'

const useTableScrollToRow = (tableRef: RefObject<HTMLDivElement>) => {
  const scroll = (value: any) => {
    const tableEl = tableRef.current
    const scrollContainer = tableEl?.querySelector('.ant-table-body')
    const tBodyContainer = tableEl?.querySelector('.ant-table-tbody')
    const trNodes = Array.from(tBodyContainer?.childNodes || []) as HTMLTableRowElement[]
    const targetRow = trNodes.find((x) => x.getAttribute('data-row-key') === value)

    scrollContainer?.scrollTo({
      top: targetRow ? targetRow.offsetTop : 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  return {
    scroll
  }
}

export default useTableScrollToRow
