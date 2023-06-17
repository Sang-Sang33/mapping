/**
 * [数据的转化]
 * 将一个列表的数据转化为select下拉框的选项
 * @ary 传进来的数组，数据不规范，可能实多种结构的
 * @err {*}
 */
export const transformOption = (ary: any[], config?: Record<string, string>) => {
	const { key, label } = config || { key: "key", label: "value" };

	let _ary: any = [];

	ary &&
		ary.length &&
		ary.forEach((items: any) => {
			typeof items === "string" && _ary.push({ value: items, label: items });
			typeof items === "object" && _ary.push({ key: items[key], value: items[key], label: items[label] || "-" });
		});
	return _ary;
};

/**
 * [前端分页的过滤器]
 * 前端分页,配合mwTableSearch的api使用
 * @list 传进来的数组
 * @params mwTableSearch给出来的参数
 */
export const apiFilterByFE = (list: Array<any>, params: any) => {
	const content = list?.filter((items: any) => {
		let result = true;
		for (let key in params.search) {
			let value: any = params.search[key];
			if (items[key] !== undefined && value !== null) {
				if (
					(Array.isArray(value) && typeof items[key] === "string" && !value.includes(items[key])) ||
					(typeof value === "number" && Number(items[key]) === value) ||
					(typeof value === "string" && !(items[key] + "").includes(value + "")) ||
					(Array.isArray(value) && value.length && Array.isArray(items[key]) && value.toString() !== items[key].toString())
				) {
					result = false;
				}
			}
		}
		return result;
	});
	return content;
};

/**
 * [数据去重的方法]
 * 将一个数组对象，根据里面的某个值去重
 * @ary 传进来的数组，数据不规范，可能实多种结构的
 * @key {*}
 */
export const dedup = (ary: any[], key: string) => {
	let newArr = [];
	let obj: any = {};
	for (let i = 0; i < ary.length; i++) {
		if (!obj[ary[i][key]]) {
			newArr.push(ary[i]);
			obj[ary[i][key]] = true;
		}
	}
	return newArr;
};


// 获取url的参数
export function getUrlParams(url: string) {
	console.log("url", url);
	// 通过 ? 分割获取后面的参数字符串
	let urlStr = url.split("?")[1];
	// 创建空对象存储参数
	let obj: any = {};
	// 再通过 & 将每一个参数单独分割出来
	let paramsArr = urlStr ? urlStr.split("&") : "";
	for (let i = 0, len = paramsArr.length; i < len; i++) {
		// 再通过 = 将每一个参数分割为 key:value 的形式
		let arr = paramsArr[i].split("=");
		obj[arr[0]] = arr[1];
	}
	return obj;
}

// 这个下载必须得是blob类型
export function downloadfiles(blob: any, name: string) {
	//将请求的blob数据转为可下载的url地址
	let url = URL.createObjectURL(blob);

	// 创建一个下载标签<a>
	const aLink = document.createElement("a");
	aLink.href = url;

	// 2.直接使用自定义文件名,设置下载文件名称
	aLink.setAttribute("download", name);
	document.body.appendChild(aLink);

	// 模拟点击下载
	aLink.click();

	// 移除改下载标签
	document.body.removeChild(aLink);
}
