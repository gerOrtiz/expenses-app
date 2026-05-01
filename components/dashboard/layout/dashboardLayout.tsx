'use client';

import { Typography } from "@material-tailwind/react";
import SummaryCard from "../cards/summaryCard";
import { useActiveTable } from "@/hooks/useActiveTable";
import DashboardCharts from "../cards/DashboardCharts";
import DashboardSkeleton from "@/components/loadingSkeletons/dashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

interface DashboardLayoutPropsI {
	username: string;
}

export default function DashboardlayoutComponent({ username }: DashboardLayoutPropsI) {
	const { status, isFetching, data } = useActiveTable();

	if (status === 'pending' && isFetching) return <DashboardSkeleton />


	return (<>
		<section className="w-full flex flex-col gap-8 mt-8 p-8">

			<Typography variant="h2" color="blue-gray" className=" self-start">{`Welcome, `} <span className="text-blue-700">{username} </span> </Typography>

			{status === 'success' && data && data.data === null && (
				<DashboardEmptyState />
			)}

			{status === 'success' && data && data.data && (<>
				<SummaryCard data={data.data} />
				<DashboardCharts data={data.data} />
			</>)}

		</section>
	</>);
}
