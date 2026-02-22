'use client';

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-tailwind/react";
import { forwardRef, InputHTMLAttributes, useMemo, useState } from "react";
import classes from './passwordInput.module.css';
import { FieldErrors, FieldValues, FormState, InputValidationRules, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { SignupCredentials } from "@/interfaces/auth";

interface InputProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
	register: UseFormRegister<T>;
	name: Path<T>;
	options?: OptionsRegister;
	errors?: FieldErrors<T>;
	label?: string;
}

type OptionsRegister = {
	required: boolean
	minLength?: number
	validate?: boolean
};

const validatePassword = (value: string): string | null => {
	//if (!value) return 'Password is required';
	if (! /[A-Z]/.test(value)) return `Password must contain at least one capital letter`;
	else if (!/\d/.test(value)) return `Password must contain at least one number`;
	return null;
};

const PasswordInput = forwardRef<HTMLInputElement, InputProps<SignupCredentials>>(function PasswordInput({ register, name, options, errors, label }, ref) {
	const [showPassword, setShowPassword] = useState(false);

	const registerOptions: RegisterOptions<SignupCredentials> = !options ? {} : {
		...options,
		validate: options.validate ? validatePassword : null
	};

	return (<div className={classes.passwordInput}>

		<label htmlFor={label ? label : 'password'} className="formLabel">{label ? label : `Password`}</label>
		<div className={`${classes.inputContainer} ${errors && (errors.password || errors.confirmPassword) ? classes.error : ''}`}>
			<input id={label ? label : 'password'} type={showPassword ? 'text' : 'password'} {...register(name, { ...registerOptions })} />
			<IconButton aria-label={showPassword ? `Hide password` : `Show password`} size="lg" variant="text" className="p-0 max-h-6" onClick={() => setShowPassword(!showPassword)} >
				<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} color="gray" />
			</IconButton>
		</div>
	</div>

	);
}
);
export default PasswordInput;
