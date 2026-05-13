'use client';

import SummaryCard from "../cards/summaryCard";
import { useActiveTable } from "@/hooks/useActiveTable";
import DashboardCharts from "../cards/DashboardCharts";
import DashboardSkeleton from "@/components/loadingSkeletons/dashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";
import { Text } from "@/components/ui/Text";

interface DashboardLayoutPropsI {
	username: string;
}

export default function DashboardlayoutComponent({ username }: DashboardLayoutPropsI) {
	const { status, isFetching, data } = useActiveTable();

	if (status === 'pending' && isFetching) return <DashboardSkeleton />


	return (<>
		<section className="w-full flex flex-col gap-8 mt-0 lg:mt-4 p-8">
			<Text variant="h2" className="self-start">{`Welcome, `}<span className="text-blue-gray-700">{username}</span>!</Text>

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
