'use client';

import { Typography } from "@material-tailwind/react";
import DasboardCards from "../cards/cardsGrid";
import SummaryCard from "../cards/summaryCard";
import { useActiveTable } from "@/hooks/useActiveTable";

interface DashboardLayoutPropsI {
	username: string;
}

export default function DashboardlayoutComponent({ username }: DashboardLayoutPropsI) {
	const { status, isFetching, data } = useActiveTable();
	return (<>
		<section className="w-full flex flex-col gap-6 mt-8  p-8">
			<Typography variant="h2" >{`Welcome, `} <span className="text-blue-700">{username} </span> ! </Typography>
			<div className="flex flex-col w-full gap-8" >

				{status === 'success' && data && data.data !== null && <SummaryCard />}
				{isFetching && !data && (
					<div data-testid="skeleton" className="h-40 bg-gray-300 rounded-xl animate-pulse" />
				)}

				<DasboardCards />
			</div>
		</section>
	</>);
}
