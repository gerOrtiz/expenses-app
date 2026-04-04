import { AddedIncomeI, ExpensesTableI, IncomeI } from "@/interfaces/expenses";
import { convertToObjectId } from "@/lib/db";
import { setInitialValues } from "@/lib/user/simple-expenses";
import { processAddIncome } from "@/services/expenses-calculator";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


export async function GET() {
	try {
		const { session, client, collection } = await setInitialValues();
		const table = await collection.findOne({
			user_id: session.user.email,
			status: 'active'
		});
		await client.close();
		if (!table) return NextResponse.json({ data: null }, { status: 200 });
		return NextResponse.json({ data: table }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: Request) { //Add Income
	try {
		const body = await request.json() as { currentTable_id: string | ObjectId, newIncomeData: AddedIncomeI };
		if (!body.currentTable_id || (isNaN(body.newIncomeData.cash) && isNaN(body.newIncomeData.card)))
			return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const table_id = typeof body.currentTable_id === 'string' ? convertToObjectId(body.currentTable_id) : body.currentTable_id;
		const existingTable: ExpensesTableI = await collection.findOne({ _id: table_id, user_id: session.user.email }) as ExpensesTableI;
		if (!existingTable || !existingTable._id) return NextResponse.json({ error: 'No active table found' }, { status: 404 });
		const updatedTable = await processAddIncome(body.newIncomeData, existingTable);
		await collection.updateOne({ _id: existingTable._id as ObjectId }, {
			$set: { remaining: updatedTable.remaining, added: updatedTable.added, lastModified: new Date().getTime() },
		});
		await client.close();
		// updatedTable.id = body.currentTable_id;
		// delete updatedTable._id;
		return NextResponse.json({ data: updatedTable }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request: Request) { //Create new table
	try {
		const initialIncome = await request.json() as IncomeI;
		if (typeof initialIncome.cash !== 'number' || typeof initialIncome.card !== 'number') {
			return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		}
		const { session, client, collection } = await setInitialValues();
		const initialTableValues: Omit<ExpensesTableI, 'id' | '_id'> = {
			user_id: session.user.email,
			status: 'active',
			income: { ...initialIncome },
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
			remaining: { ...initialIncome }
		};
		await collection.insertOne(initialTableValues);
		await client.close();
		return NextResponse.json({ data: initialTableValues }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


export async function PATCH(request: Request) { //close table 
	try {
		const currentTableId = await request.json() as string | ObjectId;
		if (!currentTableId) return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		const table_id: ObjectId = typeof currentTableId === 'string' ? convertToObjectId(currentTableId) : currentTableId;
		await collection.updateOne({ _id: table_id, user_id: session.user.email }, {
			$set: { status: "closed", fDate: new Date().getTime(), lastModified: new Date().getTime() },
		});
		await client.close();
		return NextResponse.json({ data: 'Expenses table closed successfully!' }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}


