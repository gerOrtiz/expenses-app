'use client';

import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { ExpenseItemI } from "@/interfaces/expenses";
import { Card, CardBody, Input } from "@material-tailwind/react";
import classes from "@/styles/text-stroke.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDeferredValue, useState } from "react";
import { Text } from "@/components/ui/Text";

const TABLE_HEAD = [`Description`, `Amount`, `Method`, `Date`];
const dateFilter = (date: number) => {
	return new Date(date).toLocaleDateString();
}

export default function ExpensesReportTable({ expenses }: { expenses: ExpenseItemI[] }) {
	const expensesRecord: ExpenseItemI[] = JSON.parse(JSON.stringify(expenses));
	const { formatValue } = useMoneyFilter();
	const [searchValue, setSearchValue] = useState('');
	const deferedSearch = useDeferredValue(searchValue);

	const typeFilter = (type: string): string => {
		return type == 'cash' ? `Cash` : `Card`;
	};

	const filteredData = expensesRecord.filter((item) =>
		Object.values(item).some((val) =>
			String(val).toLowerCase().includes(deferedSearch.toLowerCase())
		)
	);


	return (<>
		<div className="p-0">
			<Card className="mb-1 w-full overflow-x-hidden max-h-screen overflow-y-auto shadow-sm lg:shadow-md shadow-blue-100 border border-blue-gray-100">
				<CardBody className="flex flex-col gap-5 p-2 lg:p-6">
					<Text variant="h3">{`Period expenses`}</Text>
					<div className="w-3/4 lg:w-1/2 flex items-center self-center">
						<label htmlFor="search" className="sr-only">{`Search inside expenses table`}</label>
						<Input id="search" type="text" labelProps={{ className: 'hidden', 'aria-hidden': true, 'aria-label': 'Ignore' }}
							containerProps={{ className: 'min-w-[100px]' }}
							className="!border !border-gray-300 rounded-lg  bg-gradient-to-r from-blue-100 to-white !text-blue-gray-800 !text-base "
							icon={<FontAwesomeIcon icon={faSearch} className="text-blue-gray-800" />}
							value={searchValue}
							onChange={(ev) => setSearchValue(ev.target.value)}
							crossOrigin={undefined}
						/>
					</div>
					<div className="w-full p-1 lg:p-0">
						<table className="table w-full table-auto text-left">
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
								{filteredData.length > 0 ? filteredData.map((expense) => (
									<tr key={expense.id} className="even:bg-blue-50/50 hover:bg-blue-100/80 group">
										<td className="p-2 lg:p-4 group-last:rounded-bl-md border-b border-blue-50">
											<Text variant="label" className="lg:text-[15px]">{expense.description}</Text>
										</td>
										<td className="p-2 lg:p-4 border-b border-blue-50">
											<Text variant="label" className="lg:text-[15px]">	{formatValue(expense.amount)}</Text>
										</td>
										<td className="p-2 lg:p-4 border-b border-blue-50">
											<div className="w-full flex flex-col lg:flex-row items-center justify-start  gap-2">
												<Text variant="label">{typeFilter(expense.type)}</Text>
												{expense.isPending && (
													<span className={`${classes.stroke} text-xs lg:text-sm text-indigo-500 font-semibold`}>{`Pending`}</span>
												)}
											</div>
										</td>
										<td className="p-2 lg:p-4 border-b border-blue-50 group-last:rounded-br-md">
											<Text variant="label" className="lg:text-[15px]">	{dateFilter(expense.date)}</Text>
										</td>
									</tr>
								)) :
									(<tr>
										<td colSpan={4} className="text-center p-4 h-64"><Text variant="h4">{`No data found`}</Text></td>
									</tr>)}
							</tbody>
						</table>
					</div>
				</CardBody>
			</Card>
		</div>
	</>);

}
