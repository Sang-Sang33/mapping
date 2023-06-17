import dayjs from "dayjs";
/**
 * 转换默认时间 YYYY/MM/DD : HH:MM:ss
 * @param time 时间字符串
 * @param format 默认转换时间格式 YYYY/MM/DD : HH:MM:ss
 * @returns date string
 */
export const defaultDate = (time: string, format: string = "YYYY/MM/DD : HH:MM:ss") => {
	return dayjs(time).format(format);
};

export const getDateFormString = (time: string) => {
	return defaultDate(time, "YYYY-MM-DD HH:MM:ss");
};
