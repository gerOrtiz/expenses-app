'use client';

import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { ExpensesTableI } from "@/interfaces/expenses";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useMemo, useState } from "react";
import classes from '@/styles/summary-card.module.css';
import Link from "next/link";
import AddExpensesDialog from "../expenses/AddExpensesDialog";

interface SummaryObjectI {
	periodExpenses: string;
	percentageSpent: string;
	transactionsNumber: number;
	currentBalance: string;
	pendingCommitment: string;
}

export default function SummaryCard({ data }: { data: ExpensesTableI }) {
	// const { data } = useActiveTable();
	const { formatValue } = useMoneyFilter();
	const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState<boolean>(false);
	const totalRemaining = data ? data.remaining.card + data.remaining.cash : 0;

	const handleOpenAddExpensesDialog = () => setOpenAddExpenseDialog((cur) => !cur);


	const summary: SummaryObjectI = useMemo(() => {
		const expensesTable = data;
		if (!expensesTable)
			return { periodExpenses: formatValue(0), percentageSpent: '0%', currentBalance: formatValue(0), transactionsNumber: 0, pendingCommitment: formatValue(0) };
		const totalSpent = expensesTable.totals.total_expenses.card + expensesTable.totals.total_expenses.cash;
		const totalPending = expensesTable.totals.total_pending.card + expensesTable.totals.total_pending.cash;
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
			currentBalance: formatValue(totalRemaining), transactionsNumber: expensesTable.expenses.length,
			pendingCommitment: formatValue(totalPending)
		};
		return newSummary;
	}, [data, totalRemaining, formatValue]);

	const summaryArray: { title: string, value: string }[] = [{ title: 'Spent this period', value: summary.periodExpenses }, { title: 'Budget used (%)', value: summary.percentageSpent + '%' },
	{ title: 'Pending to pay', value: summary.pendingCommitment }, { title: 'Latest expenses', value: summary.transactionsNumber + '' }];

	return (<>
		<section className="w-full flex flex-col lg:flex-row items-stretch gap-5" aria-label={`Summary`}>
			{/* <div className="flex w-full justify-center">
				<Typography variant="h3" className="text-blue-800" >{`Summary`}</Typography>
			</div> */}

			<div className="w-full lg:w-1/2 flex flex-col border border-blue-100 bg-gray-50 rounded-md p-4">
				<div className="flex flex-col items-start gap-3 mb-4">
					<span className="text-sm text-blue-gray-900 font-semibold">{`Total balance`}</span>
					<Typography variant="h3"
						className={`${totalRemaining > 100 ? classes.positive : totalRemaining <= 0 ? classes.negative : classes.warning}`}>
						{summary.currentBalance}
					</Typography>
				</div>
				<div className="flex w-full items-center justify-center gap-5">
					<Button variant="filled" className="filled" onClick={handleOpenAddExpensesDialog}>
						{`Add expense`}
					</Button>
					<Link href="/dashboard/simple-table">
						<Button variant="filled" className="filled">
							{`Go to expenses`}
						</Button>
					</Link>

				</div>
			</div>

			<div className="w-full flex flex-col border border-blue-100 bg-gray-50 rounded-md p-4">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
					{summaryArray.map((item) => (
						<Card key={item.title} className="card col-span-1 shadow-blue-100 shadow-md border border-blue-100 flex w-full bg-gradient-to-tr from-blue-50 to-white">
							<CardBody className="p-2 lg:p-6">
								<div className="flex flex-col justify-center items-center">
									<span className="text-xs lg:text-sm text-blue-gray-900 mb-1 lg:mb-2 font-semibold">{item.title}</span>
									<Typography variant="h4" className="p-2 lg:p-4 text-lg lg:text-2xl text-indigo-600"  >
										{item.value}
									</Typography>
								</div>
							</CardBody>
						</Card>
					))}
				</div>
			</div>
		</section>
		{openAddExpenseDialog && <AddExpensesDialog isPending={false} isOpen={openAddExpenseDialog} handleOpen={handleOpenAddExpensesDialog} />}
	</>)
}
