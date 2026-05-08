'use client';

import ExpensesPageSkeleton from "@/components/loadingSkeletons/expensesPageSkeleton";
import CreateSimpleTableComponent from "../createSimpleTableComponent";
import ExpensesForm from "../expenses/AddExpensesDialog";
import CloseActiveTableButton from "../CloseActiveTableButton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useActiveTable } from "@/hooks/useActiveTable";
import SimpleTableDashboard from "./simpleTableDashboard";


export default function SimpleTableLayoutComponent() {
	const { data, isFetching } = useActiveTable();
	const [openExpensesDialog, setOpenExpensesDialog] = useState(false);

	const handleOpenExpensesDialog = () => setOpenExpensesDialog((isOpen) => !isOpen);

	// if (isFetching) return <ExpensesPageSkeleton />

	return (<>
		<div className="w-full grid grid-flow-row grid-cols-3 px-6 mx-auto mt-0 lg:mt-4">
			<div className="flex w-full justify-start col-span-3 lg:col-span-1 py-1 lg:py-4">
				<Link aria-label={`Return to your dashboard`} href="/dashboard" className="text-blue-800 font-bold flex gap-2 items-center py-1.5">
					<FontAwesomeIcon icon={faArrowLeft} size="lg" />
					{`Return`}
				</Link>
			</div>
			<div className="flex w-full justify-center col-span-3 lg:col-span-1 py-2 lg:py-4">
				<Typography variant="h2" className="text-blue-800">{`Daily expenses`}</Typography>
			</div>
			{!isFetching && data && data.data !== null && (
				<div className="w-full flex justify-center gap-4 col-span-3 lg:col-span-1 py-2 lg:py-4">
					<Button aria-haspopup={true} aria-label={`Add expense`} variant="filled" className="filled" onClick={handleOpenExpensesDialog}>
						<span className="hidden lg:block text-[13px]">{`Add expense`}</span>
						<span className=" block lg:hidden text-[12px]">{`Add`}</span>
					</Button>
					<CloseActiveTableButton />
				</div>
			)}
		</div>
		<section className="w-full min-h-max">
			{isFetching && (<ExpensesPageSkeleton />)}
			{!isFetching && data && (
				data.data !== null ? (<SimpleTableDashboard tableData={data.data} />) : (<CreateSimpleTableComponent />)
			)}
		</section>
		{openExpensesDialog && (<ExpensesForm isOpen={openExpensesDialog} isPending={false} handleOpen={handleOpenExpensesDialog} />)}
	</>);
}
