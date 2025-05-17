'use client';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

interface RemainingIncomePropsI {
	remaining: TotalsType;
	totals: TotalsI;
	added: AddedIncomeI[];
	tableId: string;
	dataCallback: (data: ExpensesTableI) => void;
}


export default function RemainingIncome({ remaining, totals, added, tableId, dataCallback }: RemainingIncomePropsI) {
	const totalPending = totals.total_pending.cash + totals.total_pending.card;
	let positiveBalance = (remaining.cash + remaining.card) - totalPending;
	// positiveBalance = positiveBalance.toFixed(2);
	const [lastAdded, setLastAdded] = useState('');
	const [openIncomeDialog, setOpenIncomeDialog] = useState(false);

	useEffect(() => {
		if (added && added.length > 0) {
			const cash = added[added.length - 1].cash > 0 ? `Efectivo: $${added[added.length - 1].cash} ` : '';
			const card = added[added.length - 1].card > 0 ? `Tarjeta: $${added[added.length - 1].card}` : '';
			const date = added[added.length - 1].date ? new Date(added[added.length - 1].date).toLocaleDateString() : '';
			const lastAddedString = date ? date + ' - ' + cash + card : cash + card;
			setLastAdded(lastAddedString);
		}
	}, [added]);

	return (<>

		<Card className="border border-blue-gray-100 shadow-sm lg:w-3/4 w-full">
			<CardBody className="w-full p-4">
				<section className="w-full flex flex-col items-start p-2">
					<Typography variant="h5" color="blue-gray" className="mb-2">
						{`Remaining balance`}
					</Typography>
					{/* mobile version */}
					<div className="flex lg:hidden flex-col gap-2 items-start">
						<div className="flex w-full gap-3">
							<div className="flex flex-col gap-3">
								<div className="flex m-auto  gap-2">
									<Typography variant="paragraph" color="blue-gray" className=" text-right">
										{`Cash`}:
									</Typography>
									<Typography variant="h6" color={remaining.cash > 1 ? "green" : "red"} className=" text-left">
										${remaining.cash}
									</Typography>
								</div>
							</div>
							<div className="flex flex-col gap-3">
								<div className="flex m-auto gap-2">
									<Typography variant="paragraph" color="blue-gray" className=" text-right">
										{`Card`}:
									</Typography>
									<Typography variant="h6" color={remaining.card > 1 ? "green" : "red"} className=" text-left">
										${remaining.card.toFixed(2)}
									</Typography>
								</div>
							</div>
						</div>
						<div className="flex gap-2">
							<Typography variant="paragraph" color="blue-gray" className="col-span-2  text-center">
								{`Total balance`}:
							</Typography>
							<Typography variant="h6" color="blue-gray" className=" text-left">
								${(remaining.cash + remaining.card).toFixed(2)}
							</Typography>
						</div>
						<div className="flex m-auto gap-2">
							<Typography variant="paragraph" color="blue-gray" className="col-span-2  text-center">
								{`Balance after payments`}:
							</Typography>
							<Typography variant="h6" color="blue-gray" className=" text-left">
								${positiveBalance}
							</Typography>
						</div>
						<div className="flex justify-between m-auto">
							<Button className="hover:bg-blue-500 hover:text-white" variant="text" color="blue" size="sm" onClick={() => setOpenIncomeDialog((cur) => !cur)}>{`Add income`}</Button>
							{added && lastAdded && (<Button className="hover:bg-blue-500 hover:text-white" variant="text" color="blue" size="sm">
								{`See all incomes`}
							</Button>)}
						</div>
					</div>
					{/* Desktop version */}
					<div className="w-full hidden lg:flex gap-5 items-center justify-center">
						<div className="flex m-auto  gap-2">
							<Typography variant="paragraph" color="blue-gray" className=" text-right">
								{`Cash`}:
							</Typography>
							<Typography variant="h6" color={remaining.cash > 1 ? "green" : "red"} className=" text-left">
								${remaining.cash}
							</Typography>
						</div>
						<div className="flex m-auto gap-2">
							<Typography variant="paragraph" color="blue-gray" className=" text-right">
								{`Card`}:
							</Typography>
							<Typography variant="h6" color={remaining.card > 1 ? "green" : "red"} className=" text-left">
								${remaining.card.toFixed(2)}
							</Typography>
						</div>
						<div className="flex m-auto gap-2">
							<Typography variant="paragraph" color="blue-gray" className="col-span-2  text-center">
								{`Total balance`}:
							</Typography>
							<Typography variant="h6" color="blue-gray" className=" text-left">
								${(remaining.cash + remaining.card).toFixed(2)}
							</Typography>
						</div>
						<div className="flex m-auto gap-2">
							<Typography variant="paragraph" color="blue-gray" className="col-span-2  text-center">
								{`Balance after payments`}:
							</Typography>
							<Typography variant="h6" color="blue-gray" className=" text-left">
								${positiveBalance}
							</Typography>
						</div>
						<div className="flex m-auto">
							<Button className="hidden lg:block" variant="outlined" color="blue" onClick={() => setOpenIncomeDialog((cur) => !cur)}>{`Add income`}</Button>
						</div>
					</div>
					{added && lastAdded &&
						<div className="w-full flex justify-around ">

							<Typography variant="small" color="blue-gray" className="col-span-1 mb-2 text-center">
								{`Last income`} :
							</Typography>
							<Typography variant="small" color="blue-gray" className="mb-2 col-span-2 text-center">
								{lastAdded}
							</Typography>
							<Button variant="text" color="blue">
								{`See all incomes`}
							</Button>
						</div>
					}
				</section>
			</CardBody>
		</Card>
		{openIncomeDialog && <IncomeForm tableId={tableId} dataCallback={dataCallback} />}
	</>);
}
