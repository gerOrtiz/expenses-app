'use server';

import { authOptions } from "../authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDB } from "../db";
import { ExpensesTableI } from "@/interfaces/expenses";


export async function setInitialValues() {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/login');

	try {
		const { client, db } = await connectToDB();
		// const db = client.db();
		const collection = db.collection<ExpensesTableI | null>('expensesTables');
		return { session, client, db, collection };
	} catch (error) {
		throw new Error('Error: Could not connect to DB');
	}
}
