
import SimpleTableLayoutComponent from "@/components/dashboard/layout/simpleTableLayout";
import ExpensesPageSkeleton from "@/components/loadingSkeletons/expensesPageSkeleton";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function SimpleExpenses() {
	return (
		<main className="flex min-h-max flex-col py-2">
			<div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
				<h1 className="sr-only">Expenses Table</h1>
				<Suspense fallback={<ExpensesPageSkeleton />}>
					<SimpleExpensesPage />
				</Suspense>
			</div>
		</main>
	);
}

async function SimpleExpensesPage() {
	const session = await getServerSession(authOptions);

	if (!session) redirect('/login');
	return <SimpleTableLayoutComponent />
}
