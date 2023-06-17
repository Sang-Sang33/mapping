import { MutableRefObject, useEffect } from 'react'

const useTableAutoRefresh = (tableRef: MutableRefObject<any>, interval = 3000) => {
  useEffect(() => {
    const timer = setInterval(() => {
      tableRef.current?.refresh()
    }, interval)

    return () => {
      clearInterval(timer)
    }
  }, [])
}

export default useTableAutoRefresh
