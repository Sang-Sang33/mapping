import { useState } from "react";

const config = {
	visible: false,
	title: "默认标题",
	confirmLoading: false,
	action: "",
	width: "50%",
	destroyOnClose: true,
	maskClosable: false,
	className: "modal-css-hack"
};

const useModalConfig = (initVal: any) => {
	const obj = {
		...config,
		...initVal
	};
	const [state, setState] = useState({ ...obj });

	const onCancel = () => {
		setState({
			...obj,
			visible: false
		});
		initVal.onCancelCallback && initVal.onCancelCallback();
	};
	return [{ ...state, onCancel }, setState];
};

export default useModalConfig;
