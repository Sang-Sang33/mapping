import { lazy } from "react";

interface router {
	path: string;
	name: string;
	component: any;
	children?: Array<router>;
}

const routes: Array<router> = [
	{
		path: "/",
		name: "station",
		component: lazy(() => import("@/pages/station")),
	},
	{
		path: "*",
		name: "404",
		component: lazy(() => import("@/pages/404"))
	},
];

export default routes;
