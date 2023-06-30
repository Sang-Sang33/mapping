import React, { forwardRef, memo, useImperativeHandle } from 'react'
import type { ReactNode } from 'react'
import { useDrag } from 'ahooks'
import { Options } from 'ahooks/lib/useDrag'
import { BasicTarget } from 'ahooks/lib/utils/domTarget'

interface IProps {
  children: ReactNode
  data: any
  targetRef: BasicTarget
  options: Options
}

const Drag = forwardRef<{}, IProps>((props, ref) => {
  const { children, data, targetRef, options } = props
  useImperativeHandle(ref, () => ({}))
  useDrag(data, targetRef, options)
  return <>{children}</>
})

export default memo(Drag)
