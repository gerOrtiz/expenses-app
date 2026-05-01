'use client';
import { signUpUser } from '@/lib/user/actions';
import classes from './form.module.css';
import { Button, Spinner } from "@material-tailwind/react";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { SignupCredentials } from '@/interfaces/auth';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import PasswordInput from '../ui/PasswordInput';
import { useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';


export default function SignUpForm() {
	const router = useRouter();
	const [captchaToken, setCaptchaToken] = useState(null);
	const [signupError, setSignupError] = useState('');
	const captchaRef = useRef(null);
	const methods = useForm<SignupCredentials>({ mode: 'onTouched' });
	const { register, watch, formState: { errors, isSubmitting, isValid } } = methods;

	const onSubmit: SubmitHandler<SignupCredentials> = async (data) => {
		setSignupError('');
		const formData = { ...data, captchaToken };
		const signup = await signUpUser(formData);
		if (signup.user) {
			const result = await signIn('credentials', {
				redirect: false,
				email: signup.user.email,
				password: signup.user.password
			});
			if (!result.error) {
				if (captchaRef.current) captchaRef.current.resetCaptcha();
				return router.replace('/dashboard');
			} else setSignupError(result.error);
		} else {
			setSignupError(signup && signup.message ? signup.message : 'Error: Something went wrong, please try again');
		}
		return;
	};

	const onLoadCaptcha = () => {
		captchaRef.current.execute();
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
				<div className="flex flex-col gap-5 items-center">
					<HCaptcha sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY} ref={captchaRef} onVerify={setCaptchaToken} onLoad={onLoadCaptcha} />
					<Button aria-label={`Sign up`} aria-disabled={isSubmitting || !isValid} type="submit"
						variant="filled" className="filled hover:bg-blue-600 w-1/2 flex justify-center"
						disabled={isSubmitting || !isValid || !captchaToken}>
						{!isSubmitting && `Sign up`}
						{isSubmitting && <Spinner />}
					</Button>
					{signupError && (<span role="alert" className={classes.warning}>{signupError} </span>)}
				</div>
			</form>
		</FormProvider>

	</>);
}
