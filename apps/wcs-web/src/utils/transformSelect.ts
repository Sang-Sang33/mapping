const transformSelect = data => {
	if (data && data instanceof Object) {
		const newData = [];
		for (let key in data) {
			newData.push({
				value: key,
				label: data[key]
			});
		}
		return newData;
	}
};

export const tansformOptions = (data, { label, value }) => {
	const options = [];
	if (data) {
		data.map(item => {
			options.push({
				label: item[label],
				value: item[value]
			});
		});
	}
	return options;
};
export default transformSelect;
