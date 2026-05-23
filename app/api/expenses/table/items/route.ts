import { ExpenseItemI, ExpensesTableI } from "@/interfaces/expenses";
import { setInitialValues } from "@/lib/user/simple-expenses";
import { processAddNewExpense, processDeleteExpenses, processUpdateExpenses } from "@/services/expenses-calculator";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";


export async function POST(request: Request) {
	try {
		const body = await request.json() as { newClientExpense: ExpenseItemI };
		if (!body.newClientExpense.description || isNaN(body.newClientExpense.amount)) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const existingTable: ExpensesTableI = await collection.findOne({ status: 'active', user_id: session.user.email }) as ExpensesTableI;
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
	} catch (err) {
		return NextResponse.json({ error: err || 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json() as { clientExpense: ExpenseItemI };
		if (isNaN(body.clientExpense.amount)) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const existingTable: ExpensesTableI = await collection.findOne({ status: 'active', user_id: session.user.email }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processUpdateExpenses(body.clientExpense, existingTable);
		await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: {
				expenses: updatedTable.expenses,
				totals: updatedTable.totals,
				pending: updatedTable.pending,
				remaining: updatedTable.remaining,
				lastModified: new Date().getTime()
			},
		});
		await client.close();
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err || 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const clientExpenseId = request.nextUrl.searchParams.get('id');
		if (!clientExpenseId || typeof clientExpenseId !== 'string') return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const existingTable: ExpensesTableI = await collection.findOne({ user_id: session.user.email, status: 'active' }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processDeleteExpenses(clientExpenseId, existingTable);
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
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err || 'Internal server error' }, { status: 500 });

	}
}
