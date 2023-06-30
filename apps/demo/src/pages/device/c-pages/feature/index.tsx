import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'

interface IProps {
  children?: ReactNode
}

const Feature: FC<IProps> = (props) => {
  return <div>Feature</div>
}

export default memo(Feature)
