import { setDefaultDataFilter, setSearchTableDefaultValue, setGlobalDialogField } from "multiway";


/**
 * 表格请求后过滤
 * @param data object 接口请求完成的数据
 */


setDefaultDataFilter((res: any) => {
	return {
		content: res,
		totalCount: res?.length
	};
});

setGlobalDialogField(() => {
	return {
		maskClosable: false,
		destroyOnClose: true
	};
});

setSearchTableDefaultValue({
	extraRefreshVisible: false,
	extraSizeVisible: false,
	extraSettingVisible: false,
	extraFullscreenVisible: false
});

