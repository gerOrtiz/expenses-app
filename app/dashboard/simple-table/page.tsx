
import SimpleTableLayoutComponent from "@/components/dashboard/layout/simpleTableLayout";

export default function SimpleExpensesPage() {

	const wrapper = (
		<main className="flex min-h-max flex-col py-2">
			<div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
				<h1 className="sr-only">Expenses Table</h1>
				<SimpleTableLayoutComponent />
			</div>
		</main>
	);

	return wrapper;
}
