'use client';
import classes from './form.module.css';
import React, { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, CardHeader, Spinner, Typography } from '@material-tailwind/react';
import { useEmailValidation } from '@/hooks/useEmailValidation';

interface LoginFormPropsI {
	onChangeView: () => void;
}


export default function LoginForm({ onChangeView }: LoginFormPropsI) {
	const [state, setState] = useState<{ message: string | null }>({ message: null });
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [passwordValue, setPasswordValue] = useState<string>('');
	const isValidPassword = Boolean(passwordValue !== '');
	const [emailValue, setEmailValue] = useState<string>('');
	const isEmailValid = useEmailValidation(emailValue);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handleEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = ev.target.value as string;
		setEmailValue(newValue);
	};

	const handlePasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = ev.target.value as string;
		setPasswordValue(newValue);
	};


	const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!emailRef.current || !passwordRef.current) return;
		setSubmitting(true);
		const enteredEmail = emailRef.current.value;
		const enteredPassword = passwordRef.current.value;

		const result = await signIn('credentials', {
			redirect: false,
			email: enteredEmail,
			password: enteredPassword
		});
		if (result.error) {
			setState({ message: result.error });
			setSubmitting(false);
		}
		else router.replace('/dashboard');
	}

	return (<>
		<div className="w-full min-h-[300px] p-2">
			<Card className="mt-5">
				<CardHeader floated={false} shadow={false}  >
					<Typography variant="h3">
						{`Login`}
					</Typography>
				</CardHeader>
				<CardBody>
					<form className={classes.form} onSubmit={submitHandler}>
						<p>
							<label htmlFor="email">Correo electrónico</label>
							<input type="email" id="email" name="email" ref={emailRef} value={emailValue} onChange={handleEmailChange} className={!isEmailValid && emailValue != '' ? classes.error : ''} required />
							{!isEmailValid && emailValue != '' && (<span className={classes.warning}>{`The format for email is invalid`} </span>)}
						</p>
						<p>
							<label htmlFor="title">Contraseña</label>
							<input type="password" id="title" name="password" minLength={6} ref={passwordRef} value={passwordValue} onChange={handlePasswordChange} required />
						</p>

						{state.message && <span className={classes.warning}>{state.message}</span>}
						{/* <p className={classes.actions}>
							<button disabled={submitting}>
								{submitting ? 'Iniciando sesión...' : 'Inicia sesión'}
							</button>
						</p> */}
						<div className={classes.actions} >
							<Button type="submit" variant="filled" color="blue" className="flex min-w-[100px] justify-center hover:bg-blue-600" disabled={!emailValue || !isEmailValid || !isValidPassword || submitting}>
								{!submitting && `Sign in`}
								{submitting && (<Spinner />)}
							</Button>
						</div>
					</form>

				</CardBody>
				<CardFooter>
					<div className={classes.changeView}>
						<Typography variant="paragraph">{`Don't have an account? `} </Typography>
						<Button variant="text" onClick={() => onChangeView()} >
							<Typography variant="paragraph">{`Sign up here`} </Typography>
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>


	</>);
}
