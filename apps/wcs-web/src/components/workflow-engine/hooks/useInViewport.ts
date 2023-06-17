import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

const useInViewport = (target: RefObject<Element>, options?: IntersectionObserverInit) => {
  const [isInViewport, setIsInViewport] = useState(false)
  const [ratio, setRatio] = useState(0)
  const intersectionObserver = new IntersectionObserver((entries) => {
    const { isIntersecting, intersectionRatio } = entries[0]
    setIsInViewport(isIntersecting)
    setRatio(intersectionRatio)
  }, options)
  useEffect(() => {
    const targetEl = target.current
    if (targetEl) {
      intersectionObserver.observe(targetEl)
    }

    return () => {
      intersectionObserver.disconnect()
    }
  }, [target])

  return { isInViewport, ratio } as const
}

export default useInViewport
