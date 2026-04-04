'use server';

import { authOptions } from "../authOptions";
import { getServerSession } from "next-auth";

export async function getUser() {
	const session = await getServerSession(authOptions);
	return session;
} 
