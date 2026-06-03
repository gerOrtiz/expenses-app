'use client';

import { Text } from "@/components/ui/Text";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { PendingExpenseI } from "@/interfaces/expenses";
import { Card, CardBody } from "@material-tailwind/react";

const TABLE_HEAD = [`Description`, `Initial`, `Remained`, `Paid`, `Method`];
const typeFilter = (type: string): string => {
	return type == 'cash' ? `Cash` : `Card`;
};
export default function PendingReportTable({ pendingExpenses: pending, payments }: { pendingExpenses: PendingExpenseI[], payments: Map<string, number> }) {
	const { formatValue } = useMoneyFilter();
	const pendingExpenses = pending.map((p) => {
		const paid = payments.has(p.id) ? payments.get(p.id) : 0;
		return { ...p, paid };
	});

	return (<>
		<div className="p-0">
			<Card className="mb-1 w-full overflow-x-hidden overflow-y-auto shadow-blue-100 border border-blue-gray-100 ">
				<CardBody className="flex flex-col gap-5 p-2 lg:p-6">
					<Text variant="h3">{`Pending expenses`}</Text>
					<div className="w-full p-1 lg:p-0">
						<table className="flex flex-col w-full text-left">
							<thead className="bg-gradient-to-tr from-white to-blue-50 shadow-md ">
								<tr>
									{TABLE_HEAD.map((title) => (
										<th aria-label={title}
											key={title}
											className="p-2 lg:p-4 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md">
											<Text variant="label" className="hidden lg:block">{title}</Text>
											<Text variant="small" className="p-1 lg:hidden">{title}</Text>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{pendingExpenses.map((p) => (
									<tr key={p.id} className="even:bg-blue-50/50 hover:bg-blue-100/80 group">
										<td className="p-2 lg:p-4 group-last:rounded-bl-md border-b border-blue-50">
											<Text variant="label" className="block text-ellipsis overflow-hidden whitespace-nowrap w-full lg:text-[15px]">{p.description}</Text>
										</td>
										<td className="p-2 lg:p-4 border-b border-blue-50">
											<Text variant="label" className="lg:text-[15px]">	{formatValue(p.originalAmount)}</Text>
										</td>
										<td className="p-2 lg:p-4 border-b border-blue-50">
											<Text variant="label" className="lg:text-[15px]">	{formatValue(p.amount)}</Text>
										</td>
										<td className="p-2 lg:p-4 border-b border-blue-50">
											<Text variant="label" className="lg:text-[15px]">	{formatValue(p.paid)}</Text>
										</td>
										<td className="p-2 lg:p-4 border-b border-blue-50">
											<Text variant="label" className="lg:text-[15px]">{typeFilter(p.type)}</Text>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardBody>
			</Card>
		</div>
	</>);
}
