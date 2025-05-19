import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReportsLayout from "@/components/dashboard/reports/layout";

async function retrieveSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default async function ReportsPage() {
  const session = await retrieveSession();
  if (!session) redirect('/user');
  return (<>
    {/* <div className="flex min-h-1 flex-col py-2">
      <main className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto gap-4">
        <h1>Hola mundo</h1>
      </main>
    </div> */}
    <ReportsLayout />
  </>);
}