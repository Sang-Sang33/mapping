import { useEffect } from 'react'
import type { RefObject } from 'react'

const useResize = (resizeElRef: RefObject<HTMLElement>, resizeTriggerElRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const resizeEl = resizeElRef.current
    const resizeTriggerEl = resizeTriggerElRef.current

    let prevX: number

    const handleResizeTriggerMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      prevX = e.pageX
      document.addEventListener('mousemove', handleDocumentMouseMove)
      document.addEventListener('mouseup', handleDocumentMouseUp)
    }
    resizeTriggerEl?.addEventListener('mousedown', handleResizeTriggerMouseDown)

    const handleDocumentMouseMove = (e: MouseEvent) => {
      const currentX = e.pageX
      const xDistance = currentX - prevX
      const originalWidth = resizeEl?.getBoundingClientRect().width!
      resizeEl!.style.width = originalWidth + xDistance + 'px'
      prevX = currentX

      // 解决鼠标在iframe上移动documen mousemove事件不会触发问题
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach((iframe) => (iframe.style.pointerEvents = 'none'))
    }
    const handleDocumentMouseUp = (e: MouseEvent) => {
      // 解决鼠标在iframe上移动documen mousemove事件不会触发问题
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach((iframe) => (iframe.style.pointerEvents = 'auto'))
      removeAllDocumentListener()
    }

    // remove all listener
    const removeAllDocumentListener = () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove)
      document.removeEventListener('mouseup', handleDocumentMouseUp)
    }

    return () => {
      removeAllDocumentListener()
      resizeTriggerEl?.removeEventListener('mousedown', handleResizeTriggerMouseDown)
    }
  })
}

export default useResize
