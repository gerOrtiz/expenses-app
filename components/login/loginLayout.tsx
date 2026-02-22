'use client';

import { useState } from "react";
import SignUpForm from "./signUpForm";
import LoginForm from "./loginForm";
import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";

export default function LoginLayout() {
	const [isSigningUp, setIsSigningUp] = useState(false);

	const onChangeView = () => {
		setIsSigningUp(!isSigningUp);
	}

	return (<>
		<h2 className="sr-only">{isSigningUp ? `Sign in` : `Create an account`}</h2>
		<div className="w-full min-h-[300px] p-2">
			<Card className="mt-5">
				<CardHeader floated={false} shadow={false}  >
					<Typography variant="h3" >{isSigningUp ? `Sign up` : `Login`}</Typography>
				</CardHeader>
				<CardBody>
					{isSigningUp && <SignUpForm />}
					{!isSigningUp && <LoginForm />}
				</CardBody>
				<CardFooter>
					<div className="flex flex-col lg:flex-row justify-center items-center gap-3" >
						<Typography variant="paragraph">{isSigningUp ? `Already have an account?` : `Don't have an account?`} </Typography>
						<Button variant="text" onClick={onChangeView} className="p-0 group hover:bg-transparent">
							<Typography variant="paragraph" className="normal-case underline-offset-4 group-hover:underline transiton-all duration-100">{isSigningUp ? `Login here` : `Sign up here`} </Typography>
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>

	</>);
}
