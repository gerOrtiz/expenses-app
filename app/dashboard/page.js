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
  return (<h1>Welcome to your dashboard {session.user.name}!</h1>);
}