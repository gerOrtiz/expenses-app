'use client';

import { useState } from "react";
import SignUpForm from "./signUpForm";
import LoginForm from "./loginForm";

export default function LoginLayout() {
	const [isSigningUp, setIsSigningUp] = useState(false);

	function setSigningHandler() {
		setIsSigningUp(!isSigningUp);
	}

	return (<>
		{isSigningUp && <SignUpForm onChangeView={setSigningHandler} />}
		{!isSigningUp && <LoginForm onChangeView={setSigningHandler} />}
	</>);
}
