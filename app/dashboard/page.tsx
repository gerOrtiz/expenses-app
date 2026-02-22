import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import Dashboardlayout from "@/components/dashboard/layout/dashboardLayout";
import { Suspense } from "react";
import { getActiveTable } from "@/lib/user/simple-expenses";
import DashboardSkeleton from "@/components/loadingSkeletons/dashboardSkeleton";

async function retrieveSession() {
	const session = await getServerSession(authOptions);
	return session;
}

export default function Dashboard() {
	const wrapper = (
		<main className=" container flex min-h-1 flex-col py-2 justify-self-center justify-center">
			<div className="relative lg:w-11/12 w-full text-center p-0 mx-auto overflow-x-hidden overflow-auto ">
				<DashboardSkeleton />
			</div>
		</main>
	);

	return (<>
		<Suspense fallback={wrapper} >
			<DashboardPage />
		</Suspense>
	</>);
}

async function DashboardPage() {
	const session = await retrieveSession();
	if (!session) redirect('/login');
	const tableData = await getActiveTable();
	return (
		<main className=" container flex min-h-1 flex-col py-2 justify-self-center justify-center">
			<div className="relative lg:w-11/12 w-full text-center p-0 mx-auto overflow-x-hidden overflow-auto ">
				<Dashboardlayout username={session.user.name} expensesTable={tableData} />
			</div>
		</main>
	);
}
