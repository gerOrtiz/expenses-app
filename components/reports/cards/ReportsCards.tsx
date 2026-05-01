'use client';

import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { ExpensesTableI } from "@/interfaces/expenses";
import { Card, CardBody, Typography } from "@material-tailwind/react";

export default function ReportsCards({ tableData }: { tableData: ExpensesTableI }) {
	const { formatValue } = useMoneyFilter();
	const totalExpenses = tableData.totals.total_expenses.card + tableData.totals.total_expenses.cash;
	const transactionsNumber = tableData.expenses.length;
	const paymentsMade = tableData.expenses.reduce((acc, curr) => {
		if (curr.isPending) acc++;
		return acc;
	}, 0);
	const totalIncome = tableData.income.card + tableData.income.cash;
	const totalAdded = tableData.added.reduce((acc, curr) => {
		if (!curr.isWithdrawal) acc += (curr.card + curr.cash);
		return acc;
	}, 0);
	const totalBudget = totalIncome + totalAdded;
	const percentageSpent = ((totalExpenses / totalBudget) * 100).toFixed(2) + '%';

	const cards = [{ title: 'Total spent', value: formatValue(totalExpenses) }, { title: 'Number of transactions', value: transactionsNumber },
	{ title: 'Number of payments', value: paymentsMade }, { title: '% spent', value: percentageSpent }];

	return (<>
		<div data-testid="report-cards" className="w-full lg:w-4/5 flex justify-self-center justify-center bg-gray-50 rounded-md p-4">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
				{cards.map((item) => (
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
	</>)

}
