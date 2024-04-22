import DasboardCards from "@/components/dashboard/cards/cardsGrid";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function retrieveSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default async function Dashboard() {
  const session = await retrieveSession();
  if (!session) redirect('/user');
  return (<>
    <div className="flex min-h-1 flex-col py-2">
      <main className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto gap-4">
        <h1 className="text-6xl m-4 p-2 text-blue-900">Te damos la bienvenida a tu tablero, <span className="text-blue-400" > {session.user.name}</span> !</h1>
        <DasboardCards />
      </main>
    </div>
  </>);
}