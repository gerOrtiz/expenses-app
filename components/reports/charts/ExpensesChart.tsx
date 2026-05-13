'use client';

import { Text } from "@/components/ui/Text";
import { useGroupExpensesData } from "@/hooks/useGroupExpensesData";
import { ExpenseItemI } from "@/interfaces/expenses";
import { Bar, BarChart, RenderableText, ResponsiveContainer, Tooltip, TooltipPayloadEntry, TooltipValueType, XAxis, YAxis } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { tooltipColors } from "@/lib/constants/chartColors";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";

export default function ExpensesChart({ expenses }: { expenses: ExpenseItemI[] }) {
	const { formatValue } = useMoneyFilter();
	const expensesRecord: ExpenseItemI[] = JSON.parse(JSON.stringify(expenses));
	const groupedData = useGroupExpensesData(expensesRecord);

	const formatValues = (val: RenderableText | TooltipValueType, name: NameType, item: TooltipPayloadEntry): string => {
		return `${formatValue(Number(val))} ${item.payload.type === 'card' ? 'Card' : 'Cash'}`;
	}

	return (<>
		<div className="w-full flex flex-col gap-3 p-0 lg:p-3">
			<Text variant="h4">{`Top Expenses`}</Text>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart
					data={groupedData}
					style={{ aspectRatio: undefined, padding: '8px', minHeight: '300px' }}
					layout="vertical"
				>
					<XAxis type="number" height={50} label={{ value: `$ spent`, position: 'insideBottom' }} fontSize={13} />
					<YAxis width="auto" type="category" dataKey="description" name="Description" fontSize={13} />
					<Bar stackId="description" name="Amount" dataKey="amount" fill="#48bfe3" isAnimationActive={true} radius={[0, 5, 5, 0]} activeBar={{ stroke: 'gray' }} />
					<Tooltip cursor={{ fill: tooltipColors.cursor }}
						contentStyle={{ border: tooltipColors.border, borderRadius: 8, textTransform: 'capitalize' }}
						labelStyle={{ color: tooltipColors.label }}
						itemStyle={{ color: tooltipColors.items }} formatter={formatValues} />
				</BarChart>
			</ResponsiveContainer>
		</div>

	</>)

}
