import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'

interface IProps {
  children?: ReactNode
}

const Status: FC<IProps> = (props) => {
  return <div>Status</div>
}

export default memo(Status)
