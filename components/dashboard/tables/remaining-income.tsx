'use client';

import {
	Button,
	Card,
	CardBody,
	IconButton,
	Typography,

} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import IncomeForm from "../income/income-form";
import { AddedIncomeI, ExpensesTableI, TotalsI, TotalsType } from "@/interfaces/expenses";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import BalanceCard from "../cards/balanceCard";
import AddedIncomeDialog from "./addedIncome-dialog";
// import SummaryCard from "../cards/summaryCard";

interface RemainingIncomePropsI {
	remaining: TotalsType;
	totals: TotalsI;
	added: AddedIncomeI[];
	tableId: string;
	dataCallback?: (data: ExpensesTableI) => void;
}


export default function RemainingIncome({ remaining, totals, added, tableId }: RemainingIncomePropsI) {
	const totalPending = totals.total_pending.cash + totals.total_pending.card;
	let positiveBalance = (remaining.cash + remaining.card) - totalPending;
	const [lastAdded, setLastAdded] = useState('');
	const [totalIncome, setTotalIncome] = useState<string>('');
	const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
	const [openAddedIncomeDialog, setOpenAddedIncomeDialog] = useState(false);
	const cashAmountFormatted = useMoneyFilter(added[added.length - 1].cash);
	const cardAmountFormatted = useMoneyFilter(added[added.length - 1].card);

	const handleOpenAddedDialog = () => {
		setOpenAddedIncomeDialog(cur => !cur);
	};

	useEffect(() => {
		if (added && added.length > 0) {
			const cash = added[added.length - 1].cash > 0 ? `${cashAmountFormatted} Cash` : '';
			const card = added[added.length - 1].card > 0 ? `${cardAmountFormatted} Card` : '';
			// const date = added[added.length - 1].date ? new Date(added[added.length - 1].date).toLocaleDateString() : '';
			const lastAddedString = `${cash}  ${card} `;
			let totalAdded = 0;
			added.forEach(income => {
				totalAdded += income.card;
				totalAdded += income.cash;
			});
			const formattedValue = totalAdded.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD'
			});
			setLastAdded(lastAddedString);
			setTotalIncome(formattedValue);
		}
	}, [added]);

	const summaryArray = [{ name: 'Cash', value: remaining.cash }, { name: 'Card', value: remaining.card },
	{ name: 'Total', value: remaining.cash + remaining.card },
	{ name: 'Total after payments', value: positiveBalance }];

	return (<>

		<Card className="border border-blue-gray-100 shadow-sm lg:w-3/4 w-full">
			<CardBody className="w-full p-2 lg:p-4">
				<section className="w-full flex flex-col items-start p-2">
					<div className="flex w-full justify-between mb-2">
						<div>
							<Typography variant="h5" color="blue-gray" className="mb-2 text-lg lg:text-xl">
								{`Balance`}
							</Typography>
						</div>
						<div>
							<Button className="hidden lg:block hover:bg-blue-500 hover:text-white" variant="outlined" color="blue" size="sm" onClick={() => setOpenIncomeDialog((cur) => !cur)}>{`Add income`}</Button>
							<Button className="lg:hidden block text-[11px] hover:bg-blue-500 hover:text-white" variant="text" color="blue" size="sm" onClick={() => setOpenIncomeDialog((cur) => !cur)}>{`Add income`}</Button>
						</div>
					</div>
					<div className="w-full flex lg:flex-nowrap flex-wrap  gap-2 lg:gap-5 justify-center p-0 lg:p-2 mb-2 ">
						{summaryArray.map((item, index) => (
							<BalanceCard key={index} text={item.name} value={item.value} />
						))}
					</div>
					{added && lastAdded &&
						<div className="w-full lg:w-1/2 flex flex-wrap justify-center border border-blue-gray-100 rounded-lg items-center self-center p-5 mt-3 gap-0 lg:gap-3">
							<div className="w-1/2 lg:w-full flex flex-col lg:flex-row items-center lg:gap-5">
								<Typography variant="h6" color="gray" className="col-span-1 text-left lg:text-center text-sm lg:text-base">
									{`Latest income: `}
								</Typography>
								<Typography variant="h6" color="blue-gray" className=" col-span-2 text-left lg:text-center text-sm lg:text-base">
									{new Date(added[added.length - 1].date).toLocaleDateString()}
									&nbsp;
								</Typography>
								<Typography variant="h6" color="blue-gray" className="col-span-2 text-left lg:text-center text-sm lg:text-base">
									{lastAdded}
								</Typography>
							</div>
							<div className="w-1/2 lg:w-full flex flex-col lg:flex-row items-center lg:gap-5">
								<Typography variant="h6" color="gray" className="col-span-1 text-left lg:text-center text-sm lg:text-base">
									{`Total income: `}
								</Typography>
								<Typography variant="h6" color="blue-gray" className=" col-span-2 text-left lg:text-center text-sm lg:text-base">
									{totalIncome}
								</Typography>
							</div>
							<div className="mt-2 lg:mt-0">
								<Button variant="text" color="blue" className="p-1 text-[11px] lg:text-sm " onClick={handleOpenAddedDialog}>
									{`See all incomes`}
								</Button>
							</div>
						</div>
					}
				</section>
			</CardBody>
		</Card>
		{openIncomeDialog && <IncomeForm tableId={tableId} isOpen={openIncomeDialog} handleOpen={setOpenIncomeDialog} />}
		{openAddedIncomeDialog && <AddedIncomeDialog addedIncome={added} isOpen={openAddedIncomeDialog} handleOpen={handleOpenAddedDialog} />}
	</>);
}

