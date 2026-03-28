'use client';

import { useActiveTable } from "@/hooks/useActiveTable";
import ExpensesPageSkeleton from "@/components/loadingSkeletons/expensesPageSkeleton";
import TableWrapper from "../tables/simpleTableWrapper";
import CreateSimpleTableComponent from "../tables/createSimpleTableComponent";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@material-tailwind/react";
import CloseTableButton from "../tables/closeTableButton";

export default function SimpleTableLayoutComponent() {
	const { data, isFetching } = useActiveTable();
	if (isFetching) return <ExpensesPageSkeleton />

	return (<>
		<div className="flex mx-auto  px-6 py-3">
			<Link aria-label={`Return to your dashboard`} href="/dashboard" className="text-blue-700 font-bold flex gap-2 items-center py-1.5">
				<FontAwesomeIcon icon={faArrowLeft} size="lg" />
				{`Return`}
			</Link>
			{/* <DashboardHeader hasCurrentData={false} /> */}
		</div>
		<div className="flex flex-col lg:flex-row items-center justify-evenly gap-3 lg:justify-between w-full px-5">
			<Typography variant="h2" color="blue">{`Daily expenses`}</Typography>
			{data && data.data !== null && (<CloseTableButton />)}
		</div>
		<section>
			{data && (
				data.data !== null ? (<TableWrapper tableData={data.data} />) : (<CreateSimpleTableComponent />)
			)}
		</section>
	</>);
}
