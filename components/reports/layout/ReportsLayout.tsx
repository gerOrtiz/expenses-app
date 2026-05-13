'use client';

import { useReportsTable } from "@/hooks/useReportsTable";
import { Button } from "@material-tailwind/react";
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
import { Text } from "@/components/ui/Text";

export default function ReportsLayout() {
	const [rangeDates, setRangeDates] = useState<{ startDate: number, endDate: number }>({ startDate: undefined, endDate: undefined });
	const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
	const { data, status, isFetching } = useReportsTable(rangeDates.startDate, rangeDates.endDate);
	const tableData: ExpensesTableI | null = useMemo(() => data ? data.data : null, [data]);
	const sDate = tableData ? tableData.sDate : rangeDates.startDate;
	const fDate = tableData ? tableData.fDate : rangeDates.endDate;

	const periodDate = sDate !== undefined && fDate !== undefined ? `${new Date(sDate).toLocaleDateString()} - ${new Date(fDate).toLocaleDateString()}` : null;

	const handleDialogOpen = useCallback(() => setIsDateDialogOpen(op => !op), []);
	const handleDateRangeSetting = useCallback((start: number, end: number) => {
		setIsDateDialogOpen(false);
		setRangeDates({ startDate: start, endDate: end });
	}, []);

	if (status === 'pending' && isFetching) return <ReportsSkeleton />;

	return (<>
		<div className="w-full my-3 lg:my-4 p-4 lg:p-5 grid grid-cols-3 gap-2">
			<div className="col-span-3 lg:col-span-1 flex items-center justify-start lg:justify-end">
				<Text variant="h2">{`Reports`}</Text>
			</div>
			{periodDate && (<>
				<div className="col-span-3 lg:col-span-1 justify-start lg:justify-center flex items-center w-full">
					<Text variant="h3">{`Period: `}<span className="text-blue-gray-700">{periodDate}</span></Text>
				</div>
				<div className="col-span-3 lg:col-span-1 w-full flex items-center justify-start">
					<Button variant="outlined"
						className="outlined p-3 transition ease-in-out hover:-translate-y-1 duration-200"
						onClick={handleDialogOpen}>
						{`Change dates`}
					</Button>
				</div>
			</>)}

		</div>
		{tableData !== null ? (<>
			<section className="w-full mt-2 p-3 lg:p-8">
				<ReportsCards tableData={tableData} />
			</section>

			<section className="w-full mt-4 lg:mt-8 p-3 lg:p-8">
				<h4 className="sr-only">{`Totals`}</h4>
				<TotalsCharts totals={tableData.totals} />
			</section>

			<section className="w-full flex flex-col gap-8 mt-4 lg:mt-8 p-4 lg:p-8">
				<h3 className="sr-only">{`Expenses`}</h3>
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
