import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import DashboardlayoutComponent from "@/components/dashboard/layout/dashboardLayout";
import { Suspense } from "react";
import DashboardSkeleton from "@/components/loadingSkeletons/dashboardSkeleton";



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
	const session = await getServerSession(authOptions);

	if (!session) redirect('/login');
	return (
		<main className=" container flex min-h-1 flex-col py-2 justify-self-center justify-center">
			<div className="relative lg:w-11/12 w-full text-center p-0 mx-auto overflow-x-hidden overflow-auto ">
				<h1 className="sr-only">User dashboard</h1>
				<DashboardlayoutComponent username={session.user.name} />
			</div>
		</main>
	);
}
