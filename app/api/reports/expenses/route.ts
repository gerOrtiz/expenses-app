import { setInitialValues } from "@/lib/user/simple-expenses";
import { NextRequest, NextResponse } from "next/server";

type getReportsQueryType = {
	user_id: string,
	status: 'closed',
	sDate?: { $gte: number },
	fDate?: { $lte: number }
};

export async function GET(request: NextRequest) {
	try {
		const startDate = request.nextUrl.searchParams.get('startDate') || null;
		const endDate = request.nextUrl.searchParams.get('endDate') || null;
		const { session, client, collection } = await setInitialValues();
		const query: getReportsQueryType = { user_id: session.user.email, status: 'closed' };
		if (startDate && endDate) {
			query.sDate = { $gte: Number(startDate) };
			query.fDate = { $lte: Number(endDate) };
		}
		const table = await collection.findOne(query, { sort: { fDate: -1 } });
		await client.close();
		if (!table) return NextResponse.json({ data: null }, { status: 204 });
		return NextResponse.json({ data: table }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

	}
}
