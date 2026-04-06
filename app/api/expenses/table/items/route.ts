/**
app/api/expenses/table/items/route.ts
	POST   → addExpense
	PUT    → updateExpense
	DELETE → deleteExpense

app/api/expenses/table/pending/route.ts
	POST   → addPendingExpense
 */

import { ExpenseItemI, ExpensesTableI } from "@/interfaces/expenses";
import { convertToObjectId } from "@/lib/db";
import { setInitialValues } from "@/lib/user/simple-expenses";
import { processAddNewExpense, processDeleteExpenses, processUpdateExpenses } from "@/services/expenses-calculator";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// function sanitizeDocument(currentTable_id: string, updatedTable: ExpensesTableI) {
// 	updatedTable.id = currentTable_id;
// 	delete updatedTable._id;
// }


export async function POST(request: Request) {
	try {
		const body = await request.json() as { currentTable_id: string | ObjectId, newClientExpense: ExpenseItemI };
		if (!body.currentTable_id || isNaN(body.newClientExpense.amount)) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const table_id = convertToObjectId(body.currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id, user_id: session.user.email }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		let updatedTable: ExpensesTableI = await processAddNewExpense(body.newClientExpense, existingTable);
		await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				expenses: updatedTable.expenses,
				totals: updatedTable.totals,
				remaining: updatedTable.remaining,
				pending: updatedTable.pending,
				lastModified: new Date().getTime()
			},
		});
		await client.close();
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json() as { currentTable_id: string | ObjectId, clientExpense: ExpenseItemI };
		if (!body.currentTable_id || isNaN(body.clientExpense.amount)) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const table_id = convertToObjectId(body.currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id, user_id: session.user.email }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processUpdateExpenses(body.clientExpense, existingTable);
		await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				expenses: updatedTable.expenses,
				totals: updatedTable.totals,
				remaining: updatedTable.remaining,
				lastModified: new Date().getTime()
			},
		});
		await client.close();
		// sanitizeDocument(body.currentTable_id, updatedTable);
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	try {
		const body = await request.json() as { currentTable_id: string | ObjectId, clientExpenseId: string };
		if (!body.currentTable_id || !body.clientExpenseId) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const table_id = convertToObjectId(body.currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id, user_id: session.user.email }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processDeleteExpenses(body.clientExpenseId, existingTable);
		await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				expenses: updatedTable.expenses,
				totals: updatedTable.totals,
				remaining: updatedTable.remaining,
				pending: updatedTable.pending,
				lastModified: new Date().getTime()
			}
		});
		await client.close();
		// sanitizeDocument(body.currentTable_id, updatedTable);
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

	}
}
