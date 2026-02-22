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
			{/* <header className={classes.header}>
        <h1 className="text-5xl mb-4 text-blue-900">
          Registrate o incia sesión
        </h1>
        <p className="text-blue-950">{isSigningUp ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?'} <span className={classesNames} onClick={setSigningHandler}>{isSigningUp ? 'Inicia sesión' : 'Registrate'}</span></p>
      </header>
      <main className={classes.main}>
        {isSigningUp && <SignUpForm></SignUpForm>}
        {!isSigningUp && <LoginForm></LoginForm>}
      </main> */}
			<main className="container flex flex-col py-2 justify-self-center justify-between items-center min-h-[90vh]">
				<h1 className="sr-only">Login screen</h1>
				<div className="lg:w-2/4 w-full text-center flex flex-col p-0 lg:mx-6 mx-4 my-6 items-center overflow-auto">
					<LoginLayout />
				</div>
				<div className="flex justify-center items-center w-full my-8">
					<Image src={logoImg} alt="Expenses app logo" width={400} className="opacity-40" />
				</div>
			</main>
		</>
	);
}
