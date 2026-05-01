'use client';

import { TotalsI } from "@/interfaces/expenses";
import { memo } from "react";
import { Bar, BarChart, BarShapeProps, CartesianGrid, Legend, Pie, PieChart, Rectangle, RenderableText, ResponsiveContainer, Tooltip, TooltipValueType, XAxis, YAxis } from "recharts";

function TotalsCharts({ totals }: { totals: TotalsI }) {
	const totalExpensesAmount = totals.total_expenses.card + totals.total_expenses.cash;
	const totalPercentagesArray = [{ name: 'Card', value: ((totals.total_expenses.card / totalExpensesAmount) * 100), fill: '#845ec2' },
	{ name: 'Cash', value: ((totals.total_expenses.cash / totalExpensesAmount) * 100), fill: '#296073' }];

	const totalExpensesArray = [{ name: 'Card', value: totals.total_expenses.card }, { name: 'Cash', value: totals.total_expenses.cash }];
	const totalPaymentsArray = [{ name: 'Card', value: totals.total_payments_made.card }, { name: 'Cash', value: totals.total_payments_made.cash }];

	const colors = ['#8884d8', '#82ca9d'];

	const formatPercentages = (val: RenderableText | TooltipValueType) => {
		return `${Number(val).toFixed(2)}%`
	};

	const formatAmounts = (val: RenderableText | TooltipValueType) => {
		return `$${Number(val).toFixed(2)}`;
	};

	const TotalExpensesRectangle = (props: BarShapeProps) => {
		return <Rectangle {...props} fill={colors[props.index]} radius={[10, 10, 0, 0]} stroke={colors[props.index]} strokeWidth={1} />;
	};
	const TotalPaymentsRectangle = (props: BarShapeProps) => {
		const index = props.index - 1;
		return <Rectangle {...props} fill={colors.at(index)} radius={[10, 10, 0, 0]} stroke={colors[props.index]} strokeWidth={1} />;
	};

	return (<div className="w-full flex flex-wrap justify-center gap-4 lg:gap-0">
		<div className="flex flex-col basis-full lg:basis-[30%] items-center gap-2">
			<span className="text-blue-gray-600 antialiased text-base font-semibold">{`Total expenses`}</span>
			<ResponsiveContainer width="80%" height={325} >
				<BarChart data={totalExpensesArray} style={{ aspectRatio: undefined, padding: '10px' }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" fontSize={13} />
					<YAxis width="auto" fontSize={13} />
					<Tooltip contentStyle={{ backgroundColor: '#220862', borderRadius: 8, color: 'white' }} formatter={formatAmounts} />
					<Bar dataKey="value" fill="#ffffff" isAnimationActive={true} shape={TotalExpensesRectangle} barSize={75} />
				</BarChart>
			</ResponsiveContainer>
		</div>
		<div className="flex basis-full lg:basis-2/5">
			<ResponsiveContainer width="100%" height={370} >
				<PieChart >
					<Pie data={totalPercentagesArray} dataKey="value" fontSize={13}
						label={({ percent }) => `${((percent ?? 0) * 100).toFixed(2)}%`}
						nameKey="name" isAnimationActive={true} animationEasing="ease-in-out" />
					<Tooltip contentStyle={{ borderRadius: 8, backgroundColor: 'whitesmoke' }} formatter={formatPercentages} />
					<Legend verticalAlign="bottom" />
				</PieChart>
			</ResponsiveContainer>
		</div>
		<div className="flex flex-col basis-full lg:basis-[30%] items-center gap-2">
			<span className="text-blue-gray-600 antialiased text-base font-semibold">{`Total paid`}</span>
			<ResponsiveContainer width="80%" height={325} >
				<BarChart data={totalPaymentsArray} style={{ aspectRatio: undefined, padding: '10px' }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" fontSize={13} />
					<YAxis width="auto" fontSize={13} />
					<Tooltip contentStyle={{ backgroundColor: '#220862', borderRadius: 8, color: 'white' }} formatter={formatAmounts} />
					<Bar dataKey="value" fill="#ffffff" isAnimationActive={true} shape={TotalPaymentsRectangle} barSize={75} />
				</BarChart>
			</ResponsiveContainer>
		</div>

	</div>);
}

export default memo(TotalsCharts);
