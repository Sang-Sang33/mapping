// TODO
// 可以优化代码  且放到其他的位置上去 先简单写一写方便调试
// 页面初始化的时候去获取它的租户 从URL地址上
export const getTenant = () => {
	let url = window.location.href;
	let protocol = window.location.protocol + "//";
	let except_params = window.EXCEPT_PARAMS || "www";
	url = url.replace(protocol, "");

	if (url.indexOf("localhost") == -1 && url.indexOf("127.0.0.1") == -1) {
		const urlAry = url.split(".");
		if (urlAry[0] && urlAry[0] != except_params && urlAry[0] != url) {
			return urlAry[0];
		}
	}
	return ''
};
