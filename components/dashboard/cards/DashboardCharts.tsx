'use client';

import { ExpensesTableI } from "@/interfaces/expenses";
import { Typography } from "@material-tailwind/react";
import { Bar, BarChart, CartesianGrid, Label, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardCharts({ data }: { data: ExpensesTableI | null }) {
	if (!data) return null;

	const charts = ['Budget', 'Total Spent', 'Pending status'];

	const budgetData = [{ category: 'Income', cash: data.income.cash, card: data.income.card },
	{ category: 'Spent', cash: data.totals.total_expenses.cash, card: data.totals.total_expenses.card },
	{ category: 'Pending', cash: data.totals.total_pending.cash, card: data.totals.total_pending.card },
	{ category: 'Remaining', cash: data.remaining.cash, card: data.remaining.card }
	];
	const spentData = [{ name: 'Cash', value: data.totals.total_expenses.cash, fill: '#845ec2' },
	{ name: 'Card', value: data.totals.total_expenses.card, fill: '#296073' }
	];
	const pendingSummary = [{ status: 'Paid', cash: data.totals.total_payments_made.cash, card: data.totals.total_payments_made.card },
	{ status: 'Remaining', cash: data.totals.total_pending.cash, card: data.totals.total_pending.card }
	];

	return (
		<section className="w-full items-center grid grid-cols-3 gap-4" aria-label={`Charts`}>
			{charts.map((title, index) => (
				<div key={title} className="col-span-3 lg:col-span-1 border border-blue-gray-500 shadow rounded-lg w-full h-auto flex flex-col gap-4 justify-center items-center">
					<Typography variant="h5" className="text-blue-800 mt-2">{title}</Typography>
					<ResponsiveContainer width="100%" height={300}>
						{index === 0 && (
							<BarChart
								data={budgetData}
								style={{ aspectRatio: undefined, padding: '8px' }}

							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="category" />
								<YAxis width="auto" />
								<Tooltip contentStyle={{ backgroundColor: '#220862', borderRadius: 8 }} labelStyle={{ color: "white" }} />
								{/* <Legend /> */}
								<Bar dataKey="cash" fill="#8884d8" isAnimationActive={true} radius={[10, 10, 0, 0]} activeBar={{ stroke: 'blue' }} />
								<Bar dataKey="card" fill="#82ca9d" isAnimationActive={true} radius={[10, 10, 0, 0]} activeBar={{ stroke: 'green' }} />
							</BarChart>
						)}
						{index === 1 && (
							<PieChart >
								<Pie data={spentData} dataKey="value" nameKey="name" outerRadius="80%" innerRadius="50%" isAnimationActive={true} animationEasing="ease-in-out" />
								<Label position="center" fill="#666">{title}</Label>
								<Tooltip contentStyle={{ borderRadius: 8, backgroundColor: 'whitesmoke' }} />
								<Legend verticalAlign="top" />
							</PieChart>
						)}
						{index === 2 && (
							<BarChart
								data={pendingSummary}
								style={{ aspectRatio: undefined, padding: '8px' }}

							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="status" />
								<YAxis width="auto" />
								<Tooltip contentStyle={{ backgroundColor: '#220862', borderRadius: 8 }} labelStyle={{ color: "white" }} />

								{/* <Legend /> */}
								<Bar dataKey="cash" fill="#6ea1c7" isAnimationActive={true} radius={[10, 10, 0, 0]} activeBar={{ stroke: 'purple' }} />
								<Bar dataKey="card" fill="#ed7485" isAnimationActive={true} radius={[10, 10, 0, 0]} activeBar={{ stroke: 'red' }} />
							</BarChart>
						)}
					</ResponsiveContainer>
				</div>
			))}
		</section>);
}
