'use client';

import { useReportsTable } from "@/hooks/useReportsTable";
import { Button, Typography } from "@material-tailwind/react";
import ExpensesReportTable from "../tables/ExpensesReportTable";
import ExpensesChart from "../charts/ExpensesChart";
import TotalsCharts from "../charts/TotalsCharts";
import PendingReportTable from "../tables/PendingReportTable";
import MovementsList from "../movements/MovementsList";
import { useCallback, useMemo, useState } from "react";
import DateRangeDialog from "@/components/ui/DateRangeDialog";
import ReportsCards from "../cards/ReportsCards";
import ReportsEmptyState from "./ReportsEmptyState";
import { ExpensesTableI } from "@/interfaces/expenses";
import ReportsSkeleton from "@/components/loadingSkeletons/reportsSkeleton";

export default function ReportsLayout() {
	const [rangeDates, setRangeDates] = useState<{ startDate: number, endDate: number }>({ startDate: undefined, endDate: undefined });
	const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
	const { data, status, isFetching } = useReportsTable(rangeDates.startDate, rangeDates.endDate);
	const tableData: ExpensesTableI | null = useMemo(() => data ? data.data : null, [data]);
	const sDate = tableData ? tableData.sDate : rangeDates.startDate;
	const fDate = tableData ? tableData.fDate : rangeDates.endDate;

	const periodTitle = sDate !== undefined && fDate !== undefined ? `Period: ${new Date(sDate).toLocaleDateString()} - ${new Date(fDate).toLocaleDateString()}` : null;

	const handleDialogOpen = useCallback(() => setIsDateDialogOpen(op => !op), []);
	const handleDateRangeSetting = useCallback((start: number, end: number) => {
		setIsDateDialogOpen(false);
		setRangeDates({ startDate: start, endDate: end });
	}, []);

	if (status === 'pending' && isFetching) return <ReportsSkeleton />;

	return (<>
		<div className="w-full my-3 lg:my-4 p-4 lg:p-5 grid grid-cols-3 gap-2">
			<div className="col-span-3 lg:col-span-1 text-left">
				<Typography variant="h2" className="text-blue-800">{`Reports`}</Typography>
			</div>
			{periodTitle && (<>
				<div className="col-span-3 lg:col-span-1 text-left lg:text-center content-center">
					<Typography variant="h3" className="text-blue-700 text-2xl lg:text-3xl">{periodTitle}</Typography>
				</div>
				<div className="col-span-3 lg:col-span-1 justify-self-start lg:justify-self-end content-center">
					<Button variant="outlined" className="outlined px-3 py-2 lg:px-6 lg:py-3 hover:-translate-y-1" onClick={handleDialogOpen}>{`Change dates`}</Button>
				</div>
			</>)}

		</div>
		{tableData !== null ? (<>
			<section className="w-full mt-2 p-3 lg:p-8">
				<ReportsCards tableData={tableData} />
			</section>

			<section className="w-full mt-4 lg:mt-8 p-3 lg:p-8">
				<h3 className="sr-only">{`Totals`}</h3>
				<TotalsCharts totals={tableData.totals} />
			</section>

			<section className="w-full flex flex-col gap-8 mt-4 lg:mt-8 p-4 lg:p-8">
				<h3 className="sr-only">{`Expenses Table`}</h3>
				<div className="w-full flex flex-col lg:flex-row gap-5">
					<div className="w-full lg:w-7/12">
						<ExpensesReportTable expenses={tableData.expenses} />
					</div>
					<div className="w-full lg:w-2/5">
						<ExpensesChart expenses={tableData.expenses} />
					</div>
				</div>
			</section>

			<section>
				<h3 className="sr-only">{`Pending and movements`}</h3>
				<div className="flex w-full justify-center">
					<div className="w-3/4 lg:w-2/3 flex flex-wrap gap-6 justify-center lg:justify-normal">
						<div className="basis-full lg:basis-1/2">
							<PendingReportTable pendingExpenses={tableData.pending} />
						</div>
						<div className="basis-11/12 lg:basis-2/5">
							<MovementsList movements={tableData.added} />
						</div>
					</div>
				</div>
			</section>
		</>) : (
			<section className="w-full gap-8 mt-4 lg:mt-8 p-3 lg:p-8">
				<ReportsEmptyState />
			</section>
		)}
		<DateRangeDialog isOpen={isDateDialogOpen} handleIsOpen={handleDialogOpen} callback={handleDateRangeSetting} />
	</>);

}
