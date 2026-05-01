'use server';

import { signIn } from "next-auth/react";
// import { redirect } from "next/navigation";
import { hashPassword } from "../auth/password";
import { UserAuthInfoI, UserI } from "@/interfaces/users";
import { connectToDB } from "../db";
import { SignupCredentials } from "@/interfaces/auth";

interface SignUpResult {
	message: string;
	user?: UserAuthInfoI;
}

export async function signUpUser(formData: SignupCredentials): Promise<SignUpResult> {
	const { name, email, password, captchaToken } = formData;
	if (!captchaToken) return { message: 'Captcha required' };

	const verify = await fetch('https://api.hcaptcha.com/siteverify',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${captchaToken}`
		});
	const res = await verify.json();
	if (!res.success) return { message: 'Invalid token' };


	if (!email?.includes('@') ||
		!name?.trim() ||
		!password?.trim() || password.length <= 6)
		return { message: 'Invalid input' };

	const userData: Omit<UserI, '_id'> = {
		name,
		email,
		password,
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime()
	};

	const { client, db } = await connectToDB();
	const usersCollection = db.collection('users');

	try {
		const existingUser = await usersCollection.findOne({ email });
		if (existingUser) return { message: 'Error: User already exists!' };


		const plainPassword = userData.password;
		userData.password = await hashPassword(userData.password || '');
		await usersCollection.insertOne(userData);

		client.close();
		return {
			message: 'User saved!',
			user: {
				email: userData.email,
				password: plainPassword
			}
		};
	}
	catch (error) {
		client.close();
		throw new Error('Error: Could not save user, please try again later');
	}
}

export async function loginUser(credentials: UserAuthInfoI): Promise<{ success: boolean; error?: string }> {
	try {
		const result = await signIn('credentials', {
			redirect: false,
			email: credentials.email,
			password: credentials.password
		});

		if (result?.error) {
			return { success: false, error: result.error };
		}
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
