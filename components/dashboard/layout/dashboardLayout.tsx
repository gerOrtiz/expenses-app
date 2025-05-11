'use client';

import { Typography } from "@material-tailwind/react";
import DasboardCards from "../cards/cardsGrid";
import SummaryCard from "../cards/summaryCard";

interface DashboardlayoutPropsI {
	username: string
}

export default function Dashboardlayout({ username }: DashboardlayoutPropsI) {

	return (<>
		<section className="w-full flex flex-col gap-6 mt-8 border border-solid border-gray-400 rounded-lg p-8">
			<Typography variant="h3" className="text-blue-700">{`Welcome, `} <span className="text-blue-400">{username} </span> ! </Typography>
			<div className="flex flex-col w-full gap-8" >

				<SummaryCard />
				<DasboardCards />
			</div>
		</section>
	</>);
}
