'use client';

import { useGroupExpensesData } from "@/hooks/useGroupExpensesData";
import { ExpenseItemI } from "@/interfaces/expenses";
import { Typography } from "@material-tailwind/react";
import { Bar, BarChart, RenderableText, ResponsiveContainer, Tooltip, TooltipPayloadEntry, TooltipValueType, XAxis, YAxis } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";

export default function ExpensesChart({ expenses }: { expenses: ExpenseItemI[] }) {
	const expensesRecord: ExpenseItemI[] = JSON.parse(JSON.stringify(expenses));
	const groupedData = useGroupExpensesData(expensesRecord);

	const formatValues = (val: RenderableText | TooltipValueType, name: NameType, item: TooltipPayloadEntry): string => {
		return `$${val} ${item.payload.type === 'card' ? 'Card' : 'Cash'}`;
	}

	return (<>
		<div className="w-full flex flex-col gap-3 p-0 lg:p-3">
			<Typography variant="h4" className="text-blue-gray-600">{`Top Expenses`}</Typography>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart
					data={groupedData}
					style={{ aspectRatio: undefined, padding: '8px', minHeight: '300px' }}
					layout="vertical"
				>
					<XAxis type="number" height={50} label={{ value: `$ spent`, position: 'insideBottom' }} />
					<YAxis width="auto" type="category" dataKey="description" name="Description" />
					<Bar stackId="description" name="Amount" dataKey="amount" fill="#ed7485" isAnimationActive={true} radius={[0, 5, 5, 0]} activeBar={{ stroke: 'green' }} />
					<Tooltip contentStyle={{ backgroundColor: '#220862', borderRadius: 8 }} labelStyle={{ color: "white" }} formatter={formatValues} />
				</BarChart>
			</ResponsiveContainer>
		</div>

	</>)

}
