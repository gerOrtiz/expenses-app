'use client';
import { signUpUser } from '@/lib/user/actions';
import classes from './form.module.css';
import { Button, Spinner } from "@material-tailwind/react";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { SignupCredentials } from '@/interfaces/auth';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import PasswordInput from '../ui/PasswordInput';



export default function SignUpForm() {
	const router = useRouter();
	const methods = useForm<SignupCredentials>({ mode: 'onTouched' });
	const { register, watch, formState: { errors, isSubmitting, isValid } } = methods;
	const onSubmit: SubmitHandler<SignupCredentials> = async (data) => {
		const signup = await signUpUser(data);
		if (signup.user) {
			const result = await signIn('credentials', {
				redirect: false,
				email: signup.user.email,
				password: signup.user.password
			});
			if (!result.error) return router.replace('/dashboard');
		}
		return;
	};

	const watchPassword = watch('password');
	const watchConfirmPassword = watch('confirmPassword');

	return (<>
		<FormProvider {...methods}>
			<form className={classes.form} onSubmit={methods.handleSubmit(onSubmit)}>
				<div>
					<label htmlFor="name" className="formLabel">{`Name`}</label>
					<input type="text" id="name" {...register('name', { required: true, minLength: 3 })} className={`formInput ${errors.name ? 'inputError' : ''}`} />
					{errors.name && errors.name.type === 'required' && (<span role="alert" className={classes.warning}>{`Name is required`} </span>)}
					{errors.name && errors.name.type === 'minLength' && (<span role="alert" className={classes.warning}>{`Name must have at least 3 characters`} </span>)}

				</div>
				<div>
					<label htmlFor="email" className="formLabel">{`Email`}</label>
					<input type="email" id="email" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
						className={`formInput ${errors.email ? 'inputError' : ''}`} />
					{errors.email && (<span role="alert" className={classes.warning}>{`The format for email is invalid`} </span>)}
				</div>
				<div>
					{/* <label htmlFor="title" className="formLabel">{`Password`}</label> */}
					{/* <input type="password" id="title"{...register('password', { minLength: 7, required: true, validate: validatePassword })}
					className={errors.password ? classes.error : ''} /> */}
					<PasswordInput name="password" errors={errors} options={{ required: true, minLength: 7, validate: true }} />
					{errors.password && errors.password.message && (<span role="alert" className={classes.warning}>{errors.password.message} </span>)}
					{errors.password && errors.password.type === 'minLength' && (<span role="alert" className={classes.warning}>{`Password must be at least 7 characters long`} </span>)}
					{errors.password && errors.password.type === 'required' && (<span role="alert" className={classes.warning}>{`Password is required`} </span>)}
				</div>
				<div>
					<PasswordInput name="confirmPassword" label={`Confirm password`} options={{ required: true }} errors={errors} />
					{(errors.confirmPassword || (watchPassword && watchConfirmPassword && watchPassword !== watchConfirmPassword)) ?
						(<span role="alert" className={classes.warning}>{`Passwords must be the same`} </span>) : null}
				</div>
				<div className={classes.actions}>
					<Button aria-label={`Sign up`} aria-disabled={isSubmitting || !isValid} type="submit" variant="filled" className="filled hover:bg-blue-600 min-w-[100px] flex justify-center" disabled={isSubmitting || !isValid}>
						{!isSubmitting && `Sign up`}
						{isSubmitting && <Spinner />}
					</Button>
				</div>
			</form>
		</FormProvider>

	</>);
}
