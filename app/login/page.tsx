import LoginLayout from '@/components/login/loginLayout';
import { getServerSession } from 'next-auth';
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import logoImg from '@/assets/transparent-logo.png';

async function retrieveSession() {
	const session = await getServerSession(authOptions);
	return session;
}

export default async function UserFormPage() {
	const session = await retrieveSession();
	if (session) redirect('/dashboard');
	return (
		<>
			<main className="container flex flex-col py-2 justify-self-center justify-between items-center min-h-[90vh]">
				<h1 className="sr-only">Login screen</h1>
				<div className="lg:w-1/2 w-full text-center flex flex-col p-0 lg:mx-6 mx-4 lg:my-10 my-2 items-center overflow-auto">
					<LoginLayout />
				</div>
				<div className="flex justify-center items-center w-3/4 lg:w-full my-4 lg:my-10">
					<Image src={logoImg} alt="Expenses app logo" width={400} className="opacity-40" />
				</div>
			</main>
		</>
	);
}
