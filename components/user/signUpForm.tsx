'use client';
import { signUpUser } from '@/lib/user/actions';
import { useFormState, useFormStatus } from 'react-dom';

import classes from './form.module.css';
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardFooter, CardHeader, Spinner, Typography } from "@material-tailwind/react";
import { useEmailValidation } from "@/hooks/useEmailValidation";

interface SignUpFormPropsI {
	onChangeView: () => void;
}

export default function SignUpForm({ onChangeView }: SignUpFormPropsI) {
	const [state, formAction] = useFormState(signUpUser, { message: null, user: null });
	const [nameValue, setNameValue] = useState<string>('');
	const [passwordValue, setPasswordValue] = useState<string>('');
	const [emailValue, setEmailValue] = useState<string>('');
	const [passwordError, setPasswordError] = useState<string>('');
	const isEmailValid = useEmailValidation(emailValue);
	const router = useRouter();
	const { pending } = useFormStatus();

	const handleNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = ev.target.value as string;
		setNameValue(newValue);
	};

	const handleEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = ev.target.value as string;
		setEmailValue(newValue);
	};

	const handlePasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = ev.target.value as string;
		setPasswordError('');
		setPasswordValue(newValue);
		if (newValue.length < 7) return setPasswordError(`Password must be at least7 characters long`);
		else if (! /[A-Z]/.test(newValue)) return setPasswordError(`Password must contain at least one capital letter`);
		else if (!/\d/.test(newValue)) return setPasswordError(`Password must contain at least one number`);
		else setPasswordError('');
	};

	const validateForm = (): boolean => {
		let disableButton = false;
		const hasName = Boolean(nameValue);
		const hasPassword = Boolean(passwordValue);
		const isPasswordValid = passwordValue.length >= 7 &&
			/[A-Z]/.test(passwordValue) &&
			/\d/.test(passwordValue);
		disableButton = !isEmailValid || !hasName || !hasPassword || !isPasswordValid;
		return disableButton;
	};

	useEffect(() => {
		async function login() {
			if (state.message && state.user) {

				const result = await signIn('credentials', {
					redirect: false,
					email: state.user.email,
					password: state.user.password
				});
				if (!result.error) {
					router.replace('/dashboard');
				}
			}
		}
		login();
	}, [state, router])

	return (<>
		<div className="w-full min-h-[300px] p-2">
			<Card className="mt-5">
				<CardHeader floated={false} shadow={false}  >
					<Typography variant="h3" >{`Sign up`}</Typography>
				</CardHeader>
				<CardBody>
					<form className={classes.form} action={formAction}>
						<p>
							<label htmlFor="name">Nombre</label>
							<input type="text" id="name" name="name" value={nameValue} onChange={handleNameChange} required />
						</p>
						<p>
							<label htmlFor="email">Correo electrónico</label>
							<input type="email" id="email" name="email" value={emailValue} onChange={handleEmailChange}
								className={!isEmailValid && emailValue != '' ? classes.error : ''}
								required />
							{!isEmailValid && emailValue != '' && (<span className={classes.warning}>{`The format for email is invalid`} </span>)}
						</p>
						<p>
							<label htmlFor="title">Contraseña</label>
							<input type="password" id="title" name="password" minLength={7} value={passwordValue} onChange={handlePasswordChange}
								className={passwordError && passwordValue != '' ? classes.error : ''}
								required />
							{passwordError && (<span className={classes.warning}>{passwordError} </span>)}
						</p>

						{state.message && <p>{state.message}</p>}
						{/* <p className={classes.actions}>
							<SubmitButton text="Registrate" />
						</p> */}
						<div className={classes.actions}>
							<Button variant="filled" color="blue" className="hover:bg-blue-600" disabled={pending || validateForm()}>
								{!pending && `Sign up`}
								{pending && <Spinner />}
							</Button>
						</div>
					</form>
				</CardBody>
				<CardFooter>
					<div className={classes.changeView}>
						<Typography variant="paragraph">{`Already have an account?`} </Typography>
						<Button variant="text" onClick={() => onChangeView()}>
							<Typography variant="paragraph">{`Login here`} </Typography>
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>


	</>);
}
