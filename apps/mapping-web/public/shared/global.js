window.__DOCUMENT_TITLE_PRFIX__ = '' // 系统标题前缀
window.__APP_LIST__ = [
  {
    label: 'WCS',
    link: 'http://www.dev.multiway-cloud.com:25022/wcs-web/'
  },
  {
    label: 'FCU',
    link: 'http://www.dev.multiway-cloud.com:25022/fcu-web/'
  },
  {
    label: 'Mapping',
    link: 'http://www.dev.multiway-cloud.com:25022/mapping-web/'
  }
] // 跳转系统列表

document.title = window.__DOCUMENT_TITLE_PRFIX__ + document.title // 修改网站标题前缀
