import { createFromIconfontCN } from '@ant-design/icons'

// export const ICON_URL = "//at.alicdn.com/t/font_2827128_3t87jxevm8o.js";
export const ICON_URL = '/iconfont.js'

export const IconFont = createFromIconfontCN({
  scriptUrl: ICON_URL,
  extraCommonProps: {
    style: { fontSize: '16px' }
  }
})
