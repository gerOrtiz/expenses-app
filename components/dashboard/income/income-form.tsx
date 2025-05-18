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
	Input
} from "@material-tailwind/react";
import { useContext, useState } from "react";

interface IncomeFormPropsI {
	tableId: string;
	dataCallback?: () => void;
}


export default function IncomeForm({ tableId, dataCallback }: IncomeFormPropsI) {
	const [cashRef, setCashRef] = useState<string>('');
	const [cardRef, setCardRef] = useState<string>('');
	const [pending, setPending] = useState<boolean>(false);
	const [isWithdrawalView, setIsWithdrawalView] = useState<boolean>(true);
	const [open, setOpen] = useState<boolean>(true);
	const tableContext = useContext(SimpleExpensesContext);


	const handleOpen = () => setOpen((cur) => !cur);

	const switchView = () => {
		setIsWithdrawalView((current) => !current);
		if (isWithdrawalView) setCardRef('');
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
		setOpen(false);
		// if (newData && dataCallback) dataCallback(newData);
		if (newData) tableContext.updateExpensesTable(newData);
	}

	const newIncome = (<>
		<Typography variant="h4" color="blue-gray">
			Nuevo ingreso
		</Typography>
		<Typography className="-mb-2" variant="h6">
			Efectivo
		</Typography>
		<Input
			label="Cantidad"
			id="cash" name="cash"
			type="number"
			min={0.1}
			step={0.01}
			value={cashRef}
			onChange={event => setCashRef(event.target.value)}
			size="lg" crossOrigin={undefined} />
		<Typography className="-mb-2" variant="h6">
			Tarjeta
		</Typography>
		<Input
			label="Cantidad"
			id="card"
			name="card"
			type="number"
			min={0}
			step={0.01}
			value={cardRef}
			onChange={event => setCardRef(event.target.value)}
			size="lg" crossOrigin={undefined} />
	</>);

	const newWithdrawal = (<>
		<Typography variant="h4" color="blue-gray">
			Retiro de Tarjeta
		</Typography>
		<Typography variant="small" color="blue-gray">
			Esta cantidad se retira de tarjeta y se agrega a efectivo
		</Typography>
		<Typography className="-mb-2" variant="h6">
			Retiro
		</Typography>
		<Input
			label="Cantidad"
			id="cash" name="cash"
			type="number"
			min={0}
			step={0.01}
			value={cashRef}
			onChange={event => setCashRef(event.target.value)}
			size="lg" crossOrigin={undefined} />
	</>);

	return (<>
		<Dialog
			size="xs"
			open={open}
			handler={handleOpen}
			className="bg-transparent shadow-none"
		>
			<form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={submitHandler} >
				<Card className="mx-auto w-full max-w-[24rem]">
					<CardBody className="flex flex-col gap-4">
						<Button onClick={switchView} variant="outlined" className="flex items-center gap-3 justify-center">
							{isWithdrawalView && 'Cambia a ingreso de capital'}
							{!isWithdrawalView && 'Cambia a retiro de efectivo'}
							<FontAwesomeIcon icon={faExchangeAlt} />
						</Button>

						{isWithdrawalView && newWithdrawal}
						{!isWithdrawalView && newIncome}
					</CardBody>
					<CardFooter className="pt-0">
						<Button variant="gradient" loading={pending} type="submit">
							Aceptar
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Dialog>
	</>);
}
