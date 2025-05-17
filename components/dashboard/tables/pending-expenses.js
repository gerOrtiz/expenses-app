'use client';

import { addPendingExpense } from "@/lib/user/simple-expenses";
import { faCheckCircle, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	IconButton,
	Tooltip,
	Typography
} from "@material-tailwind/react";
import { useState } from "react";
import ExpensesForm from "../expenses/expenses-form";

const TABLE_HEAD = ["Descripción", "Monto", "Método pago", ""];

function typeFilter(type) {
	return type == 'cash' ? 'Efectivo' : 'Tarjeta';
}

export default function PendingExpenses({ pending, tableId, dataCallback }) {
	const [isOpen, setOpen] = useState();
	const [selectedExpense, setSelectedExpense] = useState(null);
	const handleOpen = () => setOpen((cur) => !cur);

	return (<>
		<Card className="mb-1 w-full overflow-y-auto overflow-x-hidden ">
			<CardBody>
				<section className="relative flex flex-col">
					<Typography variant="lead">Gastos previstos</Typography>
					<table className="w-full min-w-max table-auto text-left">
						<thead>
							<tr>
								{TABLE_HEAD.map(title => (
									<th key={title} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
										<Typography
											variant="small"
											color="blue-gray"
											className="font-normal leading-none opacity-70"
										>
											{title}
										</Typography>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{pending.map((p, index) => (
								<tr key={p.id} className="even:bg-blue-gray-50/50">
									<td className="p-4">
										<Typography variant="small" color="blue-gray" className="font-normal">
											{p.name}
										</Typography>
									</td>
									<td className="p-4">
										<Typography variant="small" color="blue-gray" className="font-normal">
											{'$' + p.amount.toFixed(2)}
										</Typography>
									</td>
									<td className="p-4">
										<Typography variant="small" color="blue-gray" className="font-normal">
											{typeFilter(p.type)}
										</Typography>
									</td>
									<td className="p-4">
										<Tooltip content="Edita el valor de este gasto">
											<IconButton variant="text" onClick={() => setSelectedExpense(p)}>
												<FontAwesomeIcon icon={faPencil} />
											</IconButton>
										</Tooltip>

									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			</CardBody>
			<CardFooter>
				<Button onClick={handleOpen}>Agregar gasto previsto</Button>
				{isOpen && <ExpensesForm isPending={true} tableId={tableId} currentExpenses={pending} callback={dataCallback} setParentOpen={setOpen} />}
				{selectedExpense &&
					<ResetAmountDialog tableId={tableId} pending={pending} dataCallback={dataCallback} expense={selectedExpense} setSelectedExpense={setSelectedExpense} />}
			</CardFooter>
		</Card>
	</>);
}

function ResetAmountDialog({ pending, tableId, dataCallback, expense, setSelectedExpense }) {
	const [isOpen, setIsOpen] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleOpen = () => {
		setIsOpen(false);
		if (setSelectedExpense) setSelectedExpense(null);
	};

	async function editPendingTable() {
		setIsSubmitting(true);
		let newPendingArray = [...pending];
		const index = newPendingArray.findIndex(e => e.id == expense.id);
		if (index == -1) return;
		newPendingArray[index].amount = 0;
		const response = await addPendingExpense(tableId, newPendingArray);
		if (response) {
			if (dataCallback) dataCallback(response);
			setIsSubmitting(false);
		}
		handleOpen();

	}

	return (<>
		<Dialog size="sm" open={isOpen} handler={handleOpen} >
			<DialogHeader className="flex flex-col gap-4">
				<Typography variant="h6" color="blue-gray">
					Vas a convertir la cantidad de este gasto en 0
				</Typography>
			</DialogHeader>
			<DialogBody>
				<Typography variant="lead" className=" flex flex-row justify-center gap-6" >
					<span>{expense.description}</span>
					<span>${expense.amount.toFixed(2)}</span>
					<span>{expense.type == 'cash' ? 'Efectivo' : 'Tarjeta'}</span>
				</Typography>
			</DialogBody>
			<DialogFooter className="flex flex-row justify-center gap-4">
				<Button variant="outlined" color="red" onClick={handleOpen} disabled={isSubmitting}>Cancelar</Button>
				<Button variant="outlined" onClick={editPendingTable} loading={isSubmitting}>Continuar</Button>
			</DialogFooter>
		</Dialog>
	</>);
}
