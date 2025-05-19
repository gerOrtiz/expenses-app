'use server';

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "../authOptions";
import {
	processAddPending,
	processAddNewExpense,
	processUpdateExpenses,
	processDeleteExpenses,
	processAddIncome,
	//  setPending, 
	//  updateRemaining 
} from "@/services/expenses-calculator";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDB, convertToObjectId, disconnectFromDB } from "../db";
import { AddedIncomeI, ExpenseItemI, ExpensesTableI, IncomeI, PendingExpenseI } from "@/interfaces/expenses";
import { ObjectId } from "mongodb";

async function setInitialValues() {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/login');

	try {
		const { client, db } = await connectToDB();
		// const db = client.db();
		const collection = db.collection('expensesTables');
		return { session, client, db, collection };
	} catch (error) {
		throw new Error('Error: Could not connect to DB');
	}
}

export async function createNewTable(initialValues: IncomeI): Promise<{ success: boolean }> {
	const { session, client, collection } = await setInitialValues();
	const initialTableValues: Omit<ExpensesTableI, 'id' | '_id'> = {
		user_id: session.user.email,
		status: 'active',
		income: { ...initialValues },
		sDate: new Date().getTime(),
		totals: {
			total_expenses: { cash: 0, card: 0 },
			total_pending: { cash: 0, card: 0 },
			total_payments_made: { cash: 0, card: 0 }
		},
		pending: [],
		expenses: [],
		added: [],
		fDate: 0,
		remaining: { ...initialValues }
	};
	try {
		await collection.insertOne(initialTableValues);
		await client.close();
		// await disconnectFromDB();
		revalidatePath('/dashboard/simple-table');
		return { success: true };
	} catch (error) {
		console.error(error);
		//return { error: 'Something went wrong, please try again' };
		throw new Error('Something went wrong, please try again');
	}
}

export async function getActiveTable(): Promise<ExpensesTableI | { error: string }> {
	const { session, client, collection } = await setInitialValues();
	try {
		console.log('getting table');
		const existingTable = await collection.findOne({ user_id: session.user.email, status: 'active' });
		if (!existingTable) { await client.close(); return { error: 'No hay ninguna tabla de gastos activa' }; }
		const simpleData = {
			...existingTable,
			id: existingTable._id.toString()
		} as ExpensesTableI;
		delete simpleData._id;

		await client.close();
		// await disconnectFromDB();
		// setCurrentExpenses(simpleData);
		return simpleData;
	} catch (error) {
		await client.close();
		// await disconnectFromDB();
		throw new Error('Could not connect to database');
		//return { error: 'Could not connect to database' };
	}
}

export async function addPendingExpense(currentTable_id: string, newPendingExpense: PendingExpenseI) {
	const { client, collection } = await setInitialValues();
	try {
		const table_id = convertToObjectId(currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id }) as ExpensesTableI;
		const updatedTable = await processAddPending(newPendingExpense, existingTable);
		const res = await collection.updateOne({ _id: table_id }, {
			$set: { pending: updatedTable.pending, totals: updatedTable.totals, lastModified: new Date().getTime() },
		});
		client.close();
		if (!res) throw new Error('Something went wrong, please try again');
		if (res.modifiedCount <= 0) throw new Error('Something went wrong, please try again');
		updatedTable.id = currentTable_id;
		delete updatedTable._id;
		// throwCache();
		// console.log(updatedTable);
		return updatedTable;
	} catch (error) {
		if (client) client.close();
		throw error instanceof Error ? error : new Error(String(error));
	}

}

export async function addExpense(currentTable_id: string, newClientExpense: ExpenseItemI): Promise<ExpensesTableI> {
	const { client, collection } = await setInitialValues();
	try {
		const table_id = convertToObjectId(currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) throw new Error('Mismatched table, try again');

		let updatedTable = await processAddNewExpense(newClientExpense, existingTable);
		const res = await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				expenses: updatedTable.expenses,
				totals: updatedTable.totals,
				remaining: updatedTable.remaining,
				pending: updatedTable.pending,
				lastModified: new Date().getTime()
			},
			// $currentDate: { lastModified: {$type:'timestamp'} }
		});
		client.close();
		if (!res) throw new Error('Something went wrong, please try again');
		if (res.modifiedCount <= 0) throw new Error('Something went wrong, please try again');
		updatedTable.id = currentTable_id;
		delete updatedTable._id;
		// throwCache();
		// console.log(updatedTable);
		return updatedTable;
	} catch (error) {
		if (client) client.close();
		throw error instanceof Error ? error : new Error(String(error));
	}
}

export async function updateExpenses(currentTable_id: string, clientExpense: ExpenseItemI) {
	const { client, collection } = await setInitialValues();
	try {
		const table_id = convertToObjectId(currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) throw new Error('Mismatched table, try again');
		const updatedTable = await processUpdateExpenses(clientExpense, existingTable);
		const res = await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				expenses: updatedTable.expenses,
				totals: updatedTable.totals,
				remaining: updatedTable.remaining,
				lastModified: new Date().getTime()
			},
		});
		client.close();
		if (!res) throw new Error('Something went wrong, please try again');
		if (res.modifiedCount <= 0) throw new Error('Something went wrong, please try again');
		updatedTable.id = currentTable_id;
		delete updatedTable._id;
		// throwCache();
		// console.log(updatedTable);
		return updatedTable;
	} catch (error) {
		if (client) client.close();
		throw error instanceof Error ? error : new Error(String(error));
	}
}

export async function deleteExpenses(currentTable_id: string, clientExpenseId: number) {
	const { client, collection } = await setInitialValues();
	try {
		const table_id = convertToObjectId(currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) throw new Error('Mismatched table, try again');
		const updatedTable = await processDeleteExpenses(clientExpenseId, existingTable);
		const res = await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				expenses: updatedTable.expenses,
				totals: updatedTable.totals,
				remaining: updatedTable.remaining,
				pending: updatedTable.pending,
				lastModified: new Date().getTime()
			}
		});
		client.close();
		if (!res) throw new Error('Something went wrong, please try again');
		if (res.modifiedCount <= 0) throw new Error('Something went wrong, please try again');
		updatedTable.id = currentTable_id;
		delete updatedTable._id;
		// throwCache();
		return updatedTable;
	} catch (error) {
		if (client) client.close();
		throw error instanceof Error ? error : new Error(String(error));
	}
}

export async function addNewIncome(currentTable_id: string, newIncomeData: AddedIncomeI): Promise<ExpensesTableI> {
	const { client, collection } = await setInitialValues();
	try {
		const table_id = convertToObjectId(currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) throw new Error('Mismatched table, try again');
		const updatedTable = await processAddIncome(newIncomeData, existingTable);
		const res = await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: { remaining: updatedTable.remaining, added: updatedTable.added, lastModified: new Date().getTime() },
		});
		client.close();
		if (!res || res.modifiedCount <= 0) throw new Error('Something went wrong, please try again');
		updatedTable.id = currentTable_id;
		// console.log(updatedTable);
		delete updatedTable._id;
		return updatedTable;
	} catch (error) {
		if (client) client.close();
		throw error instanceof Error ? error : new Error(String(error));
	}
}

export async function closeExpensesTable(currentTable: ExpensesTableI): Promise<{ message: string, error: string }> {
	const { client, collection } = await setInitialValues();
	if (!currentTable) return { message: '', error: 'No table data sent' };
	try {
		const table_id = convertToObjectId(currentTable.id);
		const res = await collection.updateOne({ _id: table_id }, {
			$set: { status: "closed", fDate: new Date().getTime(), lastModified: new Date().getTime() },
			// $currentDate: { lastModified: true }
		});
		client.close();
		// await disconnectFromDB();
		throwCache();
		if (!res || res.modifiedCount <= 0) throw new Error('Something went wrong, please try again');
		return { message: 'Tabla de gastos cerrada con éxito', error: '' };

	} catch (error) {
		throw new Error('Something went wrong, please try again');
	}
}

export async function throwCache() {
	revalidatePath('/dashboard');
	revalidatePath('/dashboard/simple-table');

}
