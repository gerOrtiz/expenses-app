import DasboardCards from "@/components/dashboard/cards/cardsGrid";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Dashboardlayout from "@/components/dashboard/layout/dashboardLayout";

async function retrieveSession() {
	const session = await getServerSession(authOptions);
	return session;
}

export default async function Dashboard() {
	const session = await retrieveSession();
	if (!session) redirect('/login');
	return (<>
		<main className=" container flex min-h-1 flex-col py-2 justify-self-center justify-center">
			<div className="relative lg:w-11/12 w-full text-center p-0 mx-auto overflow-x-hidden overflow-auto ">
				{/* <h1 className="text-5xl m-4 p-2 text-blue-900">Te damos la bienvenida a tu tablero, <span className="text-blue-400" > {session.user.name}</span> !</h1> */}
				{/* <DasboardCards /> */}
				<Dashboardlayout username={session.user.name} />
			</div>
		</main>
	</>);
}
