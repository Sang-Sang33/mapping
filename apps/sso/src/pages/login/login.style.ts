export const style: any = {
	container: {
		background: "#4f69a5"
		// background: "linear-gradient(to right, #cbb4d8 0%, #97db97 0%, #F8F8F8 0%, #00D1D1 33%, #00D1A1 66%, #d8778f 100%)"
	},
	li: {
		listStyleType: "none",
		display: "block",
		position: "absolute",
		bottom: "-120px",
		width: "15px",
		height: "15px",
		zIndex: "-8",
		backgroundColor: "rgba(255, 255, 255, 0.15)"
	}
};
export const liStyle = {
	F: {
		...style.li,
		animationDuration: "10s"
	},
	S: {
		...style.li,
		animationDuration: "15s"
	},
	T: {
		...style.li,
		animationDuration: "18s"
	},
	Fo: {
		...style.li,
		animationDuration: "12s",
		animationDelay: "3s"
	},
	Fi: {
		...style.li,
		animationDuration: "16s",
		animationDelay: "5s"
	},
	Si: {
		...style.li,
		animationDuration: "8s"
	},
	Se: {
		...style.li,
		animationDuration: "15s",
		animationDelay: "3s",
		left: "70%"
	},
	E: {
		...style.li,
		animationDelay: "4s"
	},
	N: {
		...style.li,
		animationDuration: "28s",
		left: "82%"
	},
	Te: {
		...style.li,
		animationDuration: "20s",
		animationDelay: "6s",
		left: "90%"
	}
};