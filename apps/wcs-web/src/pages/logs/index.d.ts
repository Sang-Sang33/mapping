export interface ICommonOption {
	value: string;
	key: string;
	label: string;
}
export interface IAlertEditTableRef {
	getTableData: () => Record<string, any>;
	getOrderMap: () => Record<string, any>;
}

export interface IAlertEditTableProps {
	record: Record<string, any>;
	subunitOption: Array<ICommonOption>;
	rowAction: string;
}
