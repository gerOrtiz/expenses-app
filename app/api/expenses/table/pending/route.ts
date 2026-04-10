import { ExpensesTableI, PendingExpenseI } from "@/interfaces/expenses";
import { setInitialValues } from "@/lib/user/simple-expenses";
import { processAddPending, processDeletePendingExpense, processUpdatePendingExpenses } from "@/services/expenses-calculator";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json() as { newPendingExpense: PendingExpenseI };
		if (isNaN(body.newPendingExpense.amount) || !body.newPendingExpense.description) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		// const table_id = typeof body.currentTable_id === 'string' ? convertToObjectId(body.currentTable_id) : body.currentTable_id;
		const existingTable: ExpensesTableI = await collection.findOne({ status: 'active', user_id: session.user.email }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processAddPending(body.newPendingExpense, existingTable);
		await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: { pending: updatedTable.pending, totals: updatedTable.totals, lastModified: new Date().getTime() },
		});
		await client.close();
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json() as { pendingExpense: PendingExpenseI };
		if (isNaN(body.pendingExpense.amount)) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		// const table_id = convertToObjectId(body.currentTable_id);
		const existingTable: ExpensesTableI = await collection.findOne({ status: 'active', user_id: session.user.email }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processUpdatePendingExpenses(body.pendingExpense, existingTable);
		await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				pending: updatedTable.pending,
				totals: updatedTable.totals,
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

export async function DELETE(request: NextRequest) {
	try {
		const pendingExpenseId = request.nextUrl.searchParams.get('id');
		if (!pendingExpenseId || typeof pendingExpenseId !== 'string') return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const existingTable: ExpensesTableI = await collection.findOne({ user_id: session.user.email, status: 'active' }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processDeletePendingExpense(pendingExpenseId, existingTable);
		await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				expenses: updatedTable.expenses,
				pending: updatedTable.pending,
				totals: updatedTable.totals,
				lastModified: new Date().getTime()
			}
		});
		await client.close();
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
