import { registerAction, success, registerTableRender, RenderProps, MwAction, registerField } from "multiway";

import { PlusOutlined, BorderOuterOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Badge, Button, Switch, Tag, Tooltip, InputNumber, Input } from "antd";
import { find } from "lodash";


import currency from "currency.js";

export interface AnyKeyProps {
	[key: string]: any;
}

