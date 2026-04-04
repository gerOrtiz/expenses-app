import { ExpensesTableI, PendingExpenseI } from "@/interfaces/expenses";
import { convertToObjectId } from "@/lib/db";
import { setInitialValues } from "@/lib/user/simple-expenses";
import { processAddPending } from "@/services/expenses-calculator";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json() as { currentTable_id: string | ObjectId, newPendingExpense: PendingExpenseI };
		if (!body.currentTable_id || isNaN(body.newPendingExpense.amount)) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const table_id = typeof body.currentTable_id === 'string' ? convertToObjectId(body.currentTable_id) : body.currentTable_id;
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id, user_id: session.user.email }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processAddPending(body.newPendingExpense, existingTable);
		await collection.updateOne({ _id: table_id }, {
			$set: { pending: updatedTable.pending, totals: updatedTable.totals, lastModified: new Date().getTime() },
		});
		await client.close();
		// updatedTable.id = body.currentTable_id;
		// delete updatedTable._id;
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
