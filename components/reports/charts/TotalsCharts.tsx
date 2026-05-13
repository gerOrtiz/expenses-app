'use client';

import { TotalsI } from "@/interfaces/expenses";
import { memo } from "react";
import { bars, chartColors, chartLabel, tooltipColors } from "@/lib/constants/chartColors";
import { Bar, BarChart, BarShapeProps, CartesianGrid, Legend, Pie, PieChart, Rectangle, RenderableText, ResponsiveContainer, Tooltip, TooltipValueType, XAxis, YAxis } from "recharts";
import { Text } from "@/components/ui/Text";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";

function TotalsCharts({ totals }: { totals: TotalsI }) {
	const { formatValue } = useMoneyFilter();
	const totalExpensesAmount = totals.total_expenses.card + totals.total_expenses.cash;
	const totalPercentagesArray = [{ name: 'Card', value: ((totals.total_expenses.card / totalExpensesAmount) * 100), fill: chartColors.card },
	{ name: 'Cash', value: ((totals.total_expenses.cash / totalExpensesAmount) * 100), fill: chartColors.cash }];

	const totalExpensesArray = [{ name: 'Card', value: totals.total_expenses.card }, { name: 'Cash', value: totals.total_expenses.cash }];
	const totalPaymentsArray = [{ name: 'Card', value: totals.total_payments_made.card }, { name: 'Cash', value: totals.total_payments_made.cash }];

	const colors = [chartColors.card, chartColors.cash];
	const strokes = [bars.cardStroke, bars.cashStroke];

	const formatPercentages = (val: RenderableText | TooltipValueType) => {
		return `${Number(val).toFixed(2)}%`
	};

	const formatAmounts = (val: RenderableText | TooltipValueType) => {
		return formatValue(Number(val));
	};

	const TotalExpensesRectangle = (props: BarShapeProps) => {
		return <Rectangle {...props} fill={colors[props.index]} radius={[10, 10, 0, 0]} stroke={strokes[props.index]} strokeWidth={1} />;
	};
	const TotalPaymentsRectangle = (props: BarShapeProps) => {
		const index = props.index;
		return <Rectangle {...props} fill={colors.at(index)} radius={[10, 10, 0, 0]} stroke={strokes[props.index]} strokeWidth={1} />;
	};

	return (<div className="w-full flex flex-wrap justify-center gap-4 lg:gap-0">
		<div className="flex flex-col basis-full lg:basis-[30%] items-center gap-2">
			<Text variant="h5">{`Total expenses`}</Text>
			<ResponsiveContainer width="80%" height={325} >
				<BarChart data={totalExpensesArray} style={{ aspectRatio: undefined, padding: '10px' }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" fontSize={13} />
					<YAxis width="auto" fontSize={13} />
					<Tooltip cursor={{ fill: tooltipColors.cursor }}
						contentStyle={{ border: tooltipColors.border, borderRadius: 8, textTransform: 'capitalize' }}
						labelStyle={{ color: tooltipColors.label }}
						itemStyle={{ color: tooltipColors.items }} formatter={formatAmounts} />
					<Bar dataKey="value" fill="#ffffff" isAnimationActive={true} shape={TotalExpensesRectangle} barSize={75} />
				</BarChart>
			</ResponsiveContainer>
		</div>
		<div className="flex flex-col basis-full lg:basis-[30%] items-center gap-2">
			<Text variant="h5" >{`Total paid`}</Text>
			<ResponsiveContainer width="80%" height={325} >
				<BarChart data={totalPaymentsArray} style={{ aspectRatio: undefined, padding: '10px' }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" fontSize={13} />
					<YAxis width="auto" fontSize={13} />
					<Tooltip cursor={{ fill: tooltipColors.cursor }}
						contentStyle={{ border: tooltipColors.border, borderRadius: 8, textTransform: 'capitalize' }}
						labelStyle={{ color: tooltipColors.label }}
						itemStyle={{ color: tooltipColors.items }} formatter={formatAmounts} />
					<Bar dataKey="value" fill="#ffffff" isAnimationActive={true} shape={TotalPaymentsRectangle} barSize={75} />
				</BarChart>
			</ResponsiveContainer>
		</div>
		<div className="flex basis-full lg:basis-2/5">
			<ResponsiveContainer width="100%" height={370} >
				<PieChart >
					<Pie data={totalPercentagesArray} dataKey="value" fontSize={13}
						label={({ percent }) => `${((percent ?? 0) * 100).toFixed(2)}%`}
						nameKey="name" isAnimationActive={true} animationEasing="ease-in-out" />
					<Tooltip contentStyle={{ border: tooltipColors.border, borderRadius: 8, textTransform: 'capitalize' }}
						labelStyle={{ color: tooltipColors.label }}
						itemStyle={{ color: tooltipColors.items }} formatter={formatPercentages} />
					<Legend verticalAlign="bottom" labelStyle={{ color: chartLabel.fill }} />
				</PieChart>
			</ResponsiveContainer>
		</div>

	</div>);
}

export default memo(TotalsCharts);
