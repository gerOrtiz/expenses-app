'use client';
import classes from './form.module.css';
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button, Spinner } from '@material-tailwind/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import PasswordInput from '../ui/PasswordInput';
import { SignupCredentials } from '@/interfaces/auth';



export default function LoginForm() {
	const [loginStatus, setLoginStatus] = useState<{ message: string | null }>({ message: null });
	const router = useRouter();
	const { register,
		formState: { errors, isSubmitting, isValid },
		handleSubmit,
	} = useForm<SignupCredentials>({ mode: 'onTouched' });

	const onSubmit: SubmitHandler<SignupCredentials> = async (data) => {
		if (!isValid) return;
		if (!data.email || !data.password) return;
		const enteredEmail = data.email;
		const enteredPassword = data.password;

		const result = await signIn('credentials', {
			redirect: false,
			email: enteredEmail,
			password: enteredPassword
		});
		if (result.error) {
			setLoginStatus({ message: result.error });
		}
		else router.replace('/dashboard');
	}

	return (<>

		<form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor="email" className="formLabel">{`Email`}</label>
				<input type="email" id="email" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
					className={`formInput ${errors.email ? 'inputError' : ''}`} />
				{errors.email && errors.email.type === 'pattern' && (<span role="alert" className={classes.warning}>{`The format for email is invalid`} </span>)}
				{errors.email && errors.email.type === 'required' && (<span role="alert" className={classes.warning}>{`Email is required`} </span>)}

			</div>
			<div>
				<PasswordInput register={register} name="password" options={{ required: true }} errors={errors} />
				{errors.password && (<span role="alert" className={classes.warning}>{`Password is required`} </span>)}
			</div>
			{loginStatus.message && <span role="alert" className={classes.warning}>{loginStatus.message}</span>}

			<div className={classes.actions} >
				<Button aria-label={`Sign in`} type="submit" variant="filled" className="filled flex min-w-[100px] justify-center " aria-disabled={isSubmitting} disabled={isSubmitting}>
					{!isSubmitting && `Sign in`}
					{isSubmitting && (<Spinner />)}
				</Button>
			</div>
		</form>

	</>);
}
