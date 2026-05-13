'use client';

import { useState } from "react";
import SignUpForm from "./signUpForm";
import LoginForm from "./loginForm";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@material-tailwind/react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Text } from "../ui/Text";

export default function LoginLayout() {
	const [isSigningUp, setIsSigningUp] = useState(false);
	const [googleError, setGoogleError] = useState<string | null>(null);

	const onChangeView = () => {
		setIsSigningUp(!isSigningUp);
	};

	const handleGoogleSignIn = async () => {
		setGoogleError(null);
		const result = await signIn('google', { callbackUrl: '/dashboard' });
		if (result?.error) {
			setGoogleError('Google sign in failed. Please try again.');
		}
	}

	return (<>
		<h2 className="sr-only">{isSigningUp ? `Create an account` : `Sign in`}</h2>
		<div className="w-full min-h-[300px] p-2">
			<Card className="mt-5">
				<CardHeader floated={false} shadow={false}  >
					<Text variant="h3">{isSigningUp ? `Sign up` : `Login`}</Text>

				</CardHeader>
				<CardBody className="flex flex-col gap-6">
					<Button
						variant="outlined"
						onClick={handleGoogleSignIn}
						className="outlined w-full lg:w-3/5 flex items-center justify-center self-center gap-3 normal-case text-sm border-blue-gray-200 text-blue-gray-700"
					>
						<FcGoogle size={20} aria-hidden="true" />
						{`Continue with Google`}
					</Button>

					{googleError && (
						<span role="alert" className="text-red-500 text-sm text-center">{googleError}</span>
					)}

					<div className="flex items-center gap-3">
						<hr className="flex-1 border-blue-gray-100" />
						<span className="text-blue-gray-800 text-sm ">{`or continue with email`} </span>
						<hr className="flex-1 border-blue-gray-100" />
					</div>
					{isSigningUp && <SignUpForm />}
					{!isSigningUp && <LoginForm />}
				</CardBody>
				<CardFooter>
					<div className="flex flex-col lg:flex-row justify-center items-center gap-3" >
						<Text variant="body">{isSigningUp ? `Already have an account?` : `Don't have an account?`}</Text>
						<Button variant="text" onClick={onChangeView} className="p-0 group hover:bg-transparent">
							<Text variant="body" className="normal-case underline-offset-4 group-hover:underline transiton-all duration-100">
								{isSigningUp ? `Login here` : `Sign up here`}
							</Text>
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>

	</>);
}
