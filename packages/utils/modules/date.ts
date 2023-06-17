import dayjs from 'dayjs'

export const formatDate = (date?: string | number | dayjs.Dayjs | Date, format = 'YYYY/MM/DD HH:mm:ss') =>
  dayjs(date).format(format)
