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
    <div className="flex min-h-screen flex-col py-2">
      <main className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <h1 className="text-6xl">Welcome to your dashboard {session.user.name}!</h1>
        <DasboardCards />
      </main>
    </div>
  </>);
}