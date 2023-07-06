import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Redirect() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate("/login");
	}, []);

	return <></>;
}
export default Redirect;
