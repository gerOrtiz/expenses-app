'use client';

import { Text } from "@/components/ui/Text";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { ExpensesTableI } from "@/interfaces/expenses";
import { bars, chartColors, chartLabel, tooltipColors } from "@/lib/constants/chartColors";
import { Bar, BarChart, CartesianGrid, Label, Legend, Pie, PieChart, RenderableText, ResponsiveContainer, Tooltip, TooltipValueType, XAxis, YAxis } from "recharts";

export default function DashboardCharts({ data }: { data: ExpensesTableI | null }) {
	const { formatValue } = useMoneyFilter();
	if (!data) return null;
	const charts = ['Budget', 'Total Spent', 'Pending status'];

	const budgetData = [{ category: 'Income', cash: data.income.cash, card: data.income.card },
	{ category: 'Spent', cash: data.totals.total_expenses.cash, card: data.totals.total_expenses.card },
	{ category: 'Pending', cash: data.totals.total_pending.cash, card: data.totals.total_pending.card },
	{ category: 'Remaining', cash: data.remaining.cash, card: data.remaining.card }
	];
	const spentData = [{ name: 'Cash', value: data.totals.total_expenses.cash, fill: chartColors.cash },
	{ name: 'Card', value: data.totals.total_expenses.card, fill: chartColors.card }
	];
	const pendingSummary = [{ status: 'Paid', cash: data.totals.total_payments_made.cash, card: data.totals.total_payments_made.card },
	{ status: 'Remaining', cash: data.totals.total_pending.cash, card: data.totals.total_pending.card }
	];

	const formatAmounts = (val: RenderableText | TooltipValueType) => {
		return formatValue(Number(val));
	};

	return (
		<section className="w-full items-center grid grid-cols-3 gap-4" aria-label={`Charts`}>
			{charts.map((title, index) => (
				<div key={title} className="col-span-3 lg:col-span-1 border border-blue-gray-100 shadow rounded-xl w-full h-auto flex flex-col gap-4 justify-center items-center">
					{/* <Typography variant="h5" className="text-blue-800 mt-2">{title}</Typography> */}
					<Text variant="h5" className="mt-2">{title}</Text>
					<ResponsiveContainer width="100%" height={300}>
						{index === 0 && (
							<BarChart
								data={budgetData}
								style={{ aspectRatio: undefined, padding: '8px' }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="category" fontSize={13} />
								<YAxis width="auto" fontSize={13} />
								<Tooltip cursor={{ fill: tooltipColors.cursor }}
									contentStyle={{ border: tooltipColors.border, borderRadius: 8, textTransform: 'capitalize' }}
									labelStyle={{ color: tooltipColors.label }}
									itemStyle={{ color: tooltipColors.items }}
									formatter={formatAmounts}
								/>
								{/* <Legend /> */}
								<Bar dataKey="cash" fill={chartColors.cash} isAnimationActive={true} radius={[10, 10, 0, 0]} activeBar={{ stroke: bars.cashStroke }} />
								<Bar dataKey="card" fill={chartColors.card} isAnimationActive={true} radius={[10, 10, 0, 0]} activeBar={{ stroke: bars.cardStroke }} />
							</BarChart>
						)}
						{index === 1 && (
							<PieChart >
								<Pie data={spentData} dataKey="value" nameKey="name"
									fontSize={13}
									outerRadius="80%" innerRadius="50%" isAnimationActive={true} animationEasing="ease-in-out" />
								<Label position="center" fill={chartLabel.fill}>{title}</Label>
								<Tooltip contentStyle={{ border: tooltipColors.border, borderRadius: 8, textTransform: 'capitalize' }}
									labelStyle={{ color: tooltipColors.label }}
									itemStyle={{ color: tooltipColors.items }} formatter={formatAmounts} />
								<Legend verticalAlign="top" labelStyle={{ color: chartLabel.fill }} />
							</PieChart>
						)}
						{index === 2 && (
							<BarChart
								data={pendingSummary}
								style={{ aspectRatio: undefined, padding: '8px' }}

							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="status" fontSize={13} />
								<YAxis width="auto" fontSize={13} />
								<Tooltip cursor={{ fill: tooltipColors.cursor }}
									contentStyle={{ border: tooltipColors.border, borderRadius: 8, textTransform: 'capitalize' }}
									labelStyle={{ color: tooltipColors.label }}
									itemStyle={{ color: tooltipColors.items }}
									formatter={formatAmounts}
								/>

								{/* <Legend /> */}
								<Bar dataKey="cash" fill={chartColors.cash} isAnimationActive={true} radius={[10, 10, 0, 0]} activeBar={{ stroke: bars.cashStroke }} />
								<Bar dataKey="card" fill={chartColors.card} isAnimationActive={true} radius={[10, 10, 0, 0]} activeBar={{ stroke: bars.cardStroke }} />
							</BarChart>
						)}
					</ResponsiveContainer>
				</div>
			))}
		</section>);
}
