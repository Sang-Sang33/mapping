import { get } from "../http/request";

interface IdownloadParams {
	fileUrl: string;
	fileName: string;
}

export default async ({ fileUrl, fileName }: IdownloadParams) => {
	const res = await get(fileUrl, {}, { responseType: "blob", headers: { "Content-Type": "application/json" } });
	const link = document.createElement("a");
	const blob = res;
	const _fileName = fileName; //文件名，中文无法解析的时候会显示 _(下划线),生产环境获取不到   res.headers['content-disposition'].split(';')[1].split('=')[1]
	link.style.display = "none";
	// 兼容不同浏览器的URL对象
	const url = window.URL || window.webkitURL || window.moxURL;
	link.href = url.createObjectURL(new Blob([blob]));
	link.download = _fileName;
	link.click();
	window.URL.revokeObjectURL(url);
};
