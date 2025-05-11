import { useEffect, useState } from "react";

export function useEmailValidation(emailValue: string) {
	const [isEmailValid, setIsEmailValid] = useState(false);

	const validateEmail = (email: string) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};


	useEffect(() => {
		const timer = setTimeout(() => {
			if (emailValue != '') setIsEmailValid(validateEmail(emailValue));
			else setIsEmailValid(false);
		}, 500);

		return () => { clearTimeout(timer); }
	}, [emailValue]);

	return isEmailValid;

}
