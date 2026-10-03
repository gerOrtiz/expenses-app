'use client';

import { Button, Spinner } from "@material-tailwind/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./demoLogin.module.css";

interface DefaultLoginProps {
	type: 'filled' | 'outlined' | 'text';
	classes?: string;
}


export default function DemoLogin({ type, classes }: DefaultLoginProps) {
	const [loginStatus, setLoginStatus] = useState<{ status: 'idle' | 'submitting' | 'error', message: string | null }>({ status: 'idle', message: null });
	const router = useRouter();

	const handleDemoLogin = async () => {
		setLoginStatus({ ...loginStatus, status: 'submitting' });
		const result = await signIn('credentials', {
			redirect: false,
			email: process.env.NEXT_PUBLIC_DEMO_USER,
			password: process.env.NEXT_PUBLIC_DEMO_PASSWORD
		});
		if (!result.error) { router.replace('/dashboard'); setLoginStatus({ status: 'idle', message: null }); }
		else setLoginStatus({ status: 'error', message: result.error });
	};

	return (
		<div className="flex flex-col gap-1">
			<Button
				variant={type}
				className={`${classes ?? ''} ${type !== 'text' ? type : `${styles.bounce} p-0`} flex items-center gap-3 text-sm`}
				onClick={handleDemoLogin}
				disabled={loginStatus.status === 'submitting'}
			>
				{type === 'text' ?
					(<span className="underline underline-offset-4 text-blue-700 text-base">{`Try the demo`}</span>) :
					(<>{`Try the demo`}</>)
				}

				{loginStatus.status === 'submitting' && (<Spinner aria-label="loading spinner" className="h-4 w-4" />)}
			</Button>

			{loginStatus.status === 'error' && loginStatus.message && (
				<span role="alert" className="text-red-500 text-sm text-center">{loginStatus.message}</span>
			)}

		</div>

	);
}
