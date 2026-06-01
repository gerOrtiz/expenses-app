import { AddedIncomeI, ExpensesTableI, IncomeI } from "@/interfaces/expenses";
import { setInitialValues } from "@/lib/user/simple-expenses";
import { processAddIncome, processStartNewPeriod } from "@/services/expenses-calculator";
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

export async function POST(request: Request) { //Create new table
	try {
		const initialIncome = await request.json() as IncomeI;
		if (typeof initialIncome.cash !== 'number' || typeof initialIncome.card !== 'number') {
			return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		}
		const { session, client, collection } = await setInitialValues();
		const lastClosedQuery: { user_id: string, status: 'closed' } = { user_id: session.user.email, status: 'closed' };
		const lastClosed = await collection.findOne(lastClosedQuery, { sort: { fDate: -1 } });
		const initialTableValues = await processStartNewPeriod(lastClosed, session, initialIncome);

		await collection.insertOne(initialTableValues);
		await client.close();
		return NextResponse.json({ data: initialTableValues }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: Request) { //Add Income
	try {
		const body = await request.json() as { newIncomeData: AddedIncomeI };
		if ((isNaN(body.newIncomeData.cash) && isNaN(body.newIncomeData.card)))
			return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		// const table_id = typeof body.currentTable_id === 'string' ? convertToObjectId(body.currentTable_id) : body.currentTable_id;
		const existingTable: ExpensesTableI = await collection.findOne({ status: 'active', user_id: session.user.email }) as ExpensesTableI;
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

export async function PATCH() { //close table 
	try {
		// const currentTableId = await request.json() as string | ObjectId;
		// if (!currentTableId) return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
		const { session, client, collection } = await setInitialValues();
		// const table_id: ObjectId = typeof currentTableId === 'string' ? convertToObjectId(currentTableId) : currentTableId;
		await collection.updateOne({ status: 'active', user_id: session.user.email }, {
			$set: { status: "closed", fDate: new Date().getTime(), lastModified: new Date().getTime() },
		});
		await client.close();
		return NextResponse.json({ data: 'Expenses table closed successfully!' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err || 'Internal server error' }, { status: 500 });
	}
}


