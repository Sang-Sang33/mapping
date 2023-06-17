import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

function NotFound() {
	const navigate = useNavigate();
	const backHome = () => {
		navigate("/", { replace: true });
	};
	return (
		<Result
			status="404"
			title="404"
			subTitle="notfound"
			extra={
				<Button type="primary" onClick={backHome}>
					back_home
				</Button>
			}
		/>
	);
}
export default NotFound;
