'use client';

import SimpleExpensesContext from "@/components/providers/simple-expenses-context";
import { addNewIncome } from "@/lib/user/simple-expenses";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Typography,
	Dialog,
	Input,
	Tabs,
	TabsHeader,
	Tab,
	TabsBody,
	TabPanel
} from "@material-tailwind/react";
import { Dispatch, SetStateAction, useContext, useState } from "react";

interface IncomeFormPropsI {
	tableId: string;
	isOpen: boolean;
	handleOpen: Dispatch<SetStateAction<boolean>>;
	dataCallback?: () => void;
}


export default function IncomeForm({ tableId, isOpen, handleOpen }: IncomeFormPropsI) {
	const [cashRef, setCashRef] = useState<string>('');
	const [cardRef, setCardRef] = useState<string>('');
	const [pending, setPending] = useState<boolean>(false);
	const [isWithdrawalView, setIsWithdrawalView] = useState<boolean>(true);
	// const [open, setOpen] = useState<boolean>(true);
	const tableContext = useContext(SimpleExpensesContext);


	// const handleOpen = () => setOpen((cur) => !cur);

	const switchView = (isWithdrawal: boolean) => {
		setIsWithdrawalView(isWithdrawal);
		if (isWithdrawal) setCardRef('');
		setCashRef('');
	};

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending(true);
		const newIncome = {
			cash: isNaN(parseFloat(cashRef)) ? 0 : parseFloat(cashRef),
			card: isNaN(parseFloat(cardRef)) ? 0 : parseFloat(cardRef),
			isWithdrawal: isWithdrawalView,
			date: new Date().getTime()
		};

		const newData = await addNewIncome(tableId, newIncome);
		setPending(false);
		handleOpen(false);
		// if (newData && dataCallback) dataCallback(newData);
		if (newData) tableContext.updateExpensesTable(newData);
	}

	const newIncome = (<>
		<div className="flex flex-col gap-3">
			<Typography variant="h4" color="blue-gray">
				{`New income`}
			</Typography>
			<Typography variant="small" color="blue-gray">
				{`Add a new income for either cash or card`}
			</Typography>
			<div className="flex flex-col items-left">
				<label htmlFor="cash" className="text-xs text-gray-800 font-semibold">{'Cash'}</label>
				<Input
					id="cash" name="cash"
					aria-label="cash"
					labelProps={{ className: 'hidden' }}
					className="!rounded-lg !border-blue-600 !border-2 p-3"
					color="blue"
					type="number"
					min={0.1}
					step={0.01}
					value={cashRef}
					onChange={event => setCashRef(event.target.value)}
					size="lg" crossOrigin={undefined} />
			</div>
			<div className="flex flex-col items-left">
				<label htmlFor="card" className="text-xs text-gray-800 font-semibold">{'Card'}</label>
				<Input
					id="card"
					name="card"
					aria-label="card"
					labelProps={{ className: 'hidden' }}
					className="!rounded-lg !border-blue-600 !border-2 p-3"
					color="blue"
					type="number"
					min={0}
					step={0.01}
					value={cardRef}
					onChange={event => setCardRef(event.target.value)}
					size="lg" crossOrigin={undefined} />
			</div>



		</div>

	</>);

	const newWithdrawal = (<>
		<div className="flex flex-col gap-3">
			<Typography variant="h4" color="blue-gray">
				{`Withdrawal`}
			</Typography>
			<Typography variant="small" color="blue-gray">
				{`This amount will be taken from your card income and goes to cash income.`}
			</Typography>
			<div className="flex flex-col items-left">
				<label htmlFor="amount" className="text-xs text-gray-800 font-semibold">{'Amount'}</label>
				<Input
					id="amount" name="amount"
					type="number"
					className="!rounded-lg !border-blue-600 !border-2 p-3"
					color="blue"
					labelProps={{ className: 'hidden' }}
					min={0}
					step={0.01}
					value={cashRef}
					onChange={event => setCashRef(event.target.value)}
					size="lg" crossOrigin={undefined} />
			</div>

		</div>

	</>);

	return (<>
		<Dialog
			size="xs"
			open={isOpen}
			handler={() => handleOpen(false)}
			className="bg-transparent shadow-none min-w-[90%]"
		>
			<form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={submitHandler} >
				<Card className="mx-auto w-full max-w-[24rem]">
					<CardBody className="flex flex-col gap-4">
						{/* <Button onClick={switchView} variant="outlined" className="flex items-center gap-3 justify-center">
							{isWithdrawalView && 'Cambia a ingreso de capital'}
							{!isWithdrawalView && 'Cambia a retiro de efectivo'}
							<FontAwesomeIcon icon={faExchangeAlt} />
						</Button> */}
						<Tabs value="withdrawal">
							<TabsHeader>
								<Tab value="withdrawal" onClick={() => switchView(true)}>
									{`Withdrawal`}
								</Tab>
								<Tab value="income" onClick={() => switchView(false)}>
									{`Income`}
								</Tab>
							</TabsHeader>
							<TabsBody>
								<TabPanel value="withdrawal" className="w-full">
									{newWithdrawal}
								</TabPanel>
								<TabPanel value="income" className="w-full">
									{newIncome}
								</TabPanel>
							</TabsBody>
						</Tabs>
					</CardBody>
					<CardFooter className="pt-0">
						<div className="flex w-full justify-end gap-4">
							<Button variant="filled" color="blue" className="hover:bg-blue-600" loading={pending} disabled={pending || (!cardRef && !cashRef)} type="submit">
								{`Add`}
							</Button>
							<Button variant="outlined" color="blue" className="hover:bg-blue-600 hover:text-white" onClick={() => handleOpen(false)}>
								{`Cancel`}
							</Button>
						</div>

					</CardFooter>
				</Card>
			</form>
		</Dialog>
	</>);
}
