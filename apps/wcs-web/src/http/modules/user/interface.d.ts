/**
 * StringServiceResult，接口服务返回结果
 */
interface ApifoxModel {
	/**
	 * 接口执行结果信息（一般执行异常返回异常消息）
	 */
	message?: null | string;
	/**
	 * 接口执行结果数据
	 */
	resultData?: null | string;
	statusCode?: number;
	/**
	 * 接口执行结果是否成功
	 */
	success?: boolean;
}

export default ApifoxModel;
