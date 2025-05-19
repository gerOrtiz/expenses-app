
import TableWrapper from "@/components/dashboard/tables/simpleTableWrapper";
import TableView from "@/components/dashboard/tables/createNewTable";
import TSpinner from "@/components/ui/spinner";
import DashboardHeader from "@/components/dashboard/tables/header";
import { createNewTable, getActiveTable } from "@/lib/user/simple-expenses";
import { redirect } from "next/navigation";
import { Suspense, } from "react";
import { ExpensesTableI, IncomeI } from "@/interfaces/expenses";
import ExpensesPageSkeleton from "@/components/loadingSkeletons/expensesPageSkeleton";

async function createTable(rawFormData: IncomeI) {
	'use server';
	const response = await createNewTable(rawFormData);
	if (response.success) redirect('/dashboard/simple-table');
}


async function TablePage() {
	const tableData = await getActiveTable();

	const tableWrapper = (<>
		<div className="sticky top-[90px] z-10 w-full">
			<DashboardHeader hasCurrentData={true} />
		</div>

		<main className="flex min-h-max flex-col py-2">
			<div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
				<section>
					<TableWrapper data={tableData as ExpensesTableI} />
				</section>
			</div>
		</main>
	</>);

	const createTableView = (<>
		<div>
			<DashboardHeader hasCurrentData={false} />
		</div>
		<main className="flex min-h-max flex-col py-2">
			<div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
				<section>
					<TableView submitHandler={createTable} />
				</section>
			</div>
		</main>
	</>);

	if ('error' in tableData) { return createTableView; }
	return tableWrapper;

}

export default function SimpleExpensesTable() {

	const wrapper = (
		<main className="flex min-h-max flex-col py-2">
			<div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
				{/* <section>
					<div className="flex flex-col"><TSpinner /></div>
				</section> */}
				<ExpensesPageSkeleton />
			</div>
		</main>
	);

	return (<>
		<Suspense fallback={wrapper}>
			<TablePage />
		</Suspense>
	</>);
}
