'use client';

import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { PendingExpenseI } from "@/interfaces/expenses";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const TABLE_HEAD = [`Description`, `Amount`, `Method`];
const typeFilter = (type: string): string => {
	return type == 'cash' ? `Cash` : `Card`;
};
export default function PendingReportTable({ pendingExpenses }: { pendingExpenses: PendingExpenseI[] }) {
	const { formatValue } = useMoneyFilter();

	return (<>
		<div className="p-0">
			<Card className="mb-1 w-full overflow-x-hidden overflow-y-auto shadow-blue-100 border border-blue-gray-100 ">
				<CardBody className="flex flex-col gap-5 p-2 lg:p-6">
					<Typography variant="h4" className="text-blue-gray-600">{`Pending expenses`}</Typography>
					<div className="w-full p-1 lg:p-0">
						<table className="table w-full table-auto text-left">
							<thead className="bg-gradient-to-tr from-white to-blue-50 shadow-md ">
								<tr>
									{TABLE_HEAD.map((title) => (
										<th aria-label={title ? title : `Edit column`}
											key={title}
											className="p-2 lg:p-4 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md">
											<span
												className="text-xs lg:text-sm text-blue-gray-800 font-semibold leading-none opacity-70"
											>
												{title}
											</span>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{pendingExpenses.map((pending) => (
									<tr key={pending.id} className="even:bg-blue-50/50 hover:bg-blue-100/80 group">
										<td className="p-4 group-last:rounded-bl-md">
											<Typography variant="small" color="blue-gray" className="text-[13px] lg:text-[15px]">
												{pending.description}
											</Typography>
										</td>
										<td className="p-4">
											<Typography variant="small" color="blue-gray" className="text-[13px] lg:text-[15px]">
												{formatValue(pending.amount)}
											</Typography>
										</td>
										<td className="p-4">
											<div className="w-full flex flex-col lg:flex-row items-center justify-start  gap-2">
												<Typography variant="small" color="blue-gray" className="text-[13px] lg:text-[15px]">
													{typeFilter(pending.type)}
												</Typography>
											</div>
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
