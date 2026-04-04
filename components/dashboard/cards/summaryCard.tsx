'use client';

import { useActiveTable } from "@/hooks/useActiveTable";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { useMemo } from "react";

interface SummaryObjectI {
	periodExpenses: string;
	percentageSpent: string;
	transactionsNumber: number;
	currentBalance: string;
}

export default function SummaryCard() {
	const { data } = useActiveTable();
	const { formatValue } = useMoneyFilter();

	const summary: SummaryObjectI = useMemo(() => {
		const expensesTable = data.data;
		const totalSpent = expensesTable.totals.total_expenses.card + expensesTable.totals.total_expenses.cash;
		const totalRemaining = expensesTable.remaining.card + expensesTable.remaining.cash;
		let totalIncome = expensesTable.income.card + expensesTable.income.cash;
		let totalAdded = 0;
		expensesTable.added.forEach(element => {
			if (!element.isWithdrawal) {
				totalAdded += element.card;
				totalAdded += element.cash;
			}
		});
		totalIncome += totalAdded;
		const percentage = (totalSpent / totalIncome) * 100;
		const newSummary: SummaryObjectI = {
			periodExpenses: formatValue(totalSpent), percentageSpent: percentage.toFixed(2),
			currentBalance: formatValue(totalRemaining), transactionsNumber: expensesTable.expenses.length
		};
		return newSummary;
	}, [data, formatValue]);

	return (<>
		<div className="w-full flex">
			<Card className="w-full bg-blue-50/40">
				<CardHeader className="bg-transparent" floated={false} shadow={false}>
					<Typography variant="h4" >{`Summary`}</Typography>
				</CardHeader>
				<CardBody className="p-2 lg:p-6">
					<div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x-2 lg:divide-blue-400">
						<div className="flex flex-col gap-2 mb-2 lg:mb-0" >
							<Typography variant="h5" className="text-lg lg:tex-xl">{`Spent this period`}</Typography>
							<Typography variant="paragraph" className="text-sm lg:text-base"> {summary.periodExpenses}</Typography>
						</div>
						<div className="flex flex-col gap-2 mb-2 lg:mb-0" >
							<Typography variant="h5" className="text-lg lg:tex-xl">{`Budget`}</Typography>
							<Typography variant="paragraph" className="text-sm lg:text-base">{`${summary.percentageSpent} %`} used</Typography>
						</div>
						<div className="flex flex-col gap-2" >
							<Typography variant="h5" className="text-lg lg:tex-xl">{`Latest expenses`}</Typography>
							<Typography variant="paragraph" className="text-sm lg:text-base">{summary.transactionsNumber} transactions</Typography>
						</div>
						<div className="flex flex-col gap-2" >
							<Typography variant="h5" className="text-lg lg:tex-xl">{`Current balance`}</Typography>
							<Typography variant="paragraph" className="text-sm lg:text-base">{summary.currentBalance}</Typography>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	</>)
}
