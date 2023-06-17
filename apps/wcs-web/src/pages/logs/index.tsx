import { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";

import {
	MwSearchTableField,
	Record,
	MwTableCtrlField,
	MwSearchTable,
	MwCtrl,
	MwAction,
	AnyKeyProps,
	MwDialogForm,
	TableRefProps
} from "multiway";
import { message, Switch } from "antd";
import { useRequest, useUpdateEffect } from "ahooks";
import { get, post, put, del, upload, download } from "@/http/request";
import { apiFilterByFE, dedup, downloadfiles } from "@/utils/utils";
import useModalConfig from "@/hooks/useModalConfig";
import useOptions from "@/hooks/useOptions";
import { useStore } from "@/store/index";


import moment from "moment";

const url = {
};

function Logs() {
	
	return (
		<div className="space-list">
			Logs
		</div>
	);
}

export default observer(Logs);
