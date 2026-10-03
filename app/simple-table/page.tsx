
import SimpleTableLayoutComponent from "@/components/simpleTable/layout/simpleTableLayout";
import ExpensesPageSkeleton from "@/components/loadingSkeletons/expensesPageSkeleton";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function SimpleExpenses() {
	return (
		<main className="flex min-h-max lg:container flex-col py-2 justify-center justify-self-center">
			<div className="relative flex-1 lg:w-11/12 w-full text-center p-0 mx-auto overflow-x-hidden overflow-auto">
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
