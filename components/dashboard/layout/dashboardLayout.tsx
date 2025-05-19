'use client';

import { Typography } from "@material-tailwind/react";
import DasboardCards from "../cards/cardsGrid";
import SummaryCard from "../cards/summaryCard";
import { ExpensesTableI } from "@/interfaces/expenses";
import { useContext, useEffect } from "react";
import SimpleExpensesContext from "@/components/providers/simple-expenses-context";

interface DashboardLayoutPropsI {
	username: string;
	expensesTable: ExpensesTableI | { error: string };
}

export default function Dashboardlayout({ username, expensesTable }: DashboardLayoutPropsI) {
	const tableContext = useContext(SimpleExpensesContext);

	useEffect(() => {
		if ('error' in expensesTable) return;
		tableContext.updateExpensesTable(expensesTable);
	}, [expensesTable]);

	return (<>
		<section className="w-full flex flex-col gap-6 mt-8  p-8">
			<Typography variant="h3" className="text-blue-700">{`Welcome, `} <span className="text-blue-400">{username} </span> ! </Typography>
			<div className="flex flex-col w-full gap-8" >

				<SummaryCard />
				<DasboardCards />
			</div>
		</section>
	</>);
}
