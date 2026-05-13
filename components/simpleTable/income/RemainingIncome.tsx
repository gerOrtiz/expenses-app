'use client';

import {
	Button,
	Card,
	CardBody,
	IconButton,
} from "@material-tailwind/react";
import { useMemo, useState } from "react";
import AddIncomeDialog from "../income/AddIncomeDialog";
import { AddedIncomeI, TotalsI, TotalsType } from "@/interfaces/expenses";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import BalanceCard from "../cards/balanceCard";
import AddedIncomeDialog from "./AddedIncome.dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@/components/ui/Text";

interface RemainingIncomePropsI {
	remaining: TotalsType;
	totals: TotalsI;
	added: AddedIncomeI[];
	// dataCallback?: (data: ExpensesTableI) => void;
}


export default function RemainingIncome({ remaining, totals, added }: RemainingIncomePropsI) {
	const totalPending = totals.total_pending.cash + totals.total_pending.card;
	let positiveBalance = (remaining.cash + remaining.card) - totalPending;
	const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
	const [openAddedIncomeDialog, setOpenAddedIncomeDialog] = useState(false);
	const cashAmountFormat = useMoneyFilter();


	const handleOpenAddedDialog = () => {
		setOpenAddedIncomeDialog(cur => !cur);
	};


	const lastAdded: string = useMemo(() => {
		if (!Array.isArray(added) || added.length == 0) return '';
		const cash = added[added.length - 1].cash > 0 ? `${cashAmountFormat.formatValue(added[added.length - 1].cash)} - Cash` : '';
		const card = added[added.length - 1].card > 0 ? `${cashAmountFormat.formatValue(added[added.length - 1].card)} - Card` : '';
		return `${cash}${card ? ', ' + card : ''} `;
	}, [added, cashAmountFormat]);

	const totalIncome = useMemo(() => {
		if (!Array.isArray(added) || added.length == 0) return '$0.00';
		// let totalAdded = 0;
		// added.forEach(income => {
		// 			totalAdded += income.card;
		// 			totalAdded += income.cash;
		// 		});
		const totalAdded = added.reduce((sum, income) => sum + income.card + income.cash, 0);
		return cashAmountFormat.formatValue(totalAdded);
	}, [added, cashAmountFormat]);

	const summaryArray = [{ name: 'Cash', value: remaining.cash }, { name: 'Card', value: remaining.card },
	{ name: 'Total', value: remaining.cash + remaining.card },
	{ name: 'Total after payments', value: positiveBalance }];

	return (<>

		<Card className="border border-blue-gray-100 shadow-sm lg:w-3/4 w-full">
			<CardBody className="w-full p-2 lg:p-4">
				<div className="w-full flex flex-col items-start p-2">
					<div className="flex w-full justify-between mb-2">
						<div>
							<Text variant="h3" className="mb-2">{`Balance`}</Text>
						</div>
						<div>
							<Button aria-label={`Add income`} aria-haspopup={true}
								className="hidden lg:block outlined transition ease-in-out hover:-translate-y-1 duration-200"
								variant="outlined" size="sm" onClick={() => setOpenIncomeDialog((cur) => !cur)}>
								{`Add income`}
							</Button>
							<IconButton aria-label={`Add new income`} aria-haspopup={true}
								variant="outlined"
								className="block lg:hidden outlined"
								onClick={() => setOpenIncomeDialog((cur) => !cur)}
								size="sm">
								<FontAwesomeIcon icon={faPlus} size="lg" />
							</IconButton>
						</div>
					</div>
					<div className="w-full flex lg:flex-nowrap flex-wrap  gap-2 lg:gap-5 justify-center p-0 lg:p-2 mb-2 ">
						{summaryArray.map((item, index) => (
							<BalanceCard key={index} text={item.name} value={item.value} />
						))}
					</div>
					{added && lastAdded &&
						<div data-testid="added" className="w-full lg:w-1/2 flex flex-wrap justify-center border border-blue-gray-100 shadow-sm rounded-lg items-center self-center p-5 mt-3 gap-0 lg:gap-3">
							<div className="w-1/2 lg:w-full flex flex-col lg:flex-row items-center gap-2 lg:gap-5">
								<Text variant="h5" className="text-left lg:text-center text-blue-gray-600">{`Latest income: `}</Text>
								<Text variant="h6" className="text-left lg:text-center ">{lastAdded}</Text>
								<Text variant="h6" className="text-left lg:text-center text-blue-gray-600">{new Date(added[added.length - 1].date).toLocaleDateString()}</Text>
							</div>
							<div className="w-1/2 lg:w-full flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-5">
								<Text variant="h5" className="text-left lg:text-center text-blue-gray-600">{`Total income: `}</Text>
								<Text variant="h6" className="text-left lg:text-center">{totalIncome}</Text>
							</div>
							<div className="mt-4 lg:mt-0">
								<Button aria-label={`Show all income movements`} aria-haspopup={true}
									variant="outlined"
									className="outlined p-2 text-[11px] lg:text-sm transition ease-in-out hover:-translate-y-1 duration-200"
									onClick={handleOpenAddedDialog}>
									{`Show more`}
								</Button>
							</div>
						</div>
					}
				</div>
			</CardBody>
		</Card>
		{openIncomeDialog && <AddIncomeDialog isOpen={openIncomeDialog} handleOpen={setOpenIncomeDialog} cardAmountRemaining={remaining.card} />}
		{openAddedIncomeDialog && <AddedIncomeDialog addedIncome={added} isOpen={openAddedIncomeDialog} handleOpen={handleOpenAddedDialog} />}
	</>);
}

