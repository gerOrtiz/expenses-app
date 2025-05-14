
import TableWrapper from "@/components/dashboard/tables/simpleTableWrapper";
import TableView from "@/components/dashboard/tables/createNewTable";
import TSpinner from "@/components/ui/spinner";
import DashboardHeader from "@/components/dashboard/tables/header";
import { createNewTable, getActiveTable } from "@/lib/user/simple-expenses";
import { redirect } from "next/navigation";
import { Suspense, } from "react";
import { IncomeI } from "@/interfaces/expenses";

async function createTable(rawFormData: IncomeI) {
	'use server';
	const response = await createNewTable(rawFormData);
	if (response.success) redirect('/dashboard/simple-table');
}

async function TablePage() {
	const currentTable = await getActiveTable();

	const tableWrapper = (<>
		<DashboardHeader hasCurrentData={true} />
		<main className="flex min-h-max flex-col py-2">
			<div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
				<section>
					<TableWrapper data={currentTable} />
				</section>
			</div>
		</main>
	</>);

	const createTableView = (<>
		<DashboardHeader hasCurrentData={false} />
		<main className="flex min-h-max flex-col py-2">
			<div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
				<section>
					<TableView submitHandler={createTable} />
				</section>
			</div>
		</main>
	</>);

	if ('error' in currentTable) { return createTableView; }
	return tableWrapper;
}

export default function SimpleExpensesTable() {

	const wrapper = (
		<main className="flex min-h-max flex-col py-2">
			<div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
				<section>
					<div className="flex flex-col"><TSpinner /><p>Cargando...</p></div>
				</section>
			</div>
		</main>
	);

	return (<>
		<Suspense fallback={wrapper}>
			<TablePage />
		</Suspense>
	</>);
}
