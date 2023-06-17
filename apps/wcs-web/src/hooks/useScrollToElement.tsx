import { useCallback } from 'react'

const useScrollToElement = () => {
  const scrollToElement = useCallback((element: HTMLElement) => {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  return { scrollToElement }
}

export default useScrollToElement
