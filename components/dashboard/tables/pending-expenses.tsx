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
import { PendingExpenseI } from "@/interfaces/expenses";

interface PendingExpensesTablePropsI {
	pendingArray: PendingExpenseI[];
	tableId: string;
	dataCallback?: () => void;
}

export default function PendingExpensesTable({ pendingArray, tableId, dataCallback }: PendingExpensesTablePropsI) {
	const [isOpen, setOpen] = useState<boolean>(false);
	const [selectedExpense, setSelectedExpense] = useState<PendingExpenseI | null>(null);
	const handleOpen = () => setOpen((cur) => !cur);

	const TABLE_HEAD = [`Description`, `Amount`, `Paymethod`, ""];

	const typeFilter = (type: string) => {
		return type == 'cash' ? `Cash` : `Card`;
	}

	const handleCancelResetAmount = () => {
		setSelectedExpense(null);
	};

	const moneyFilter = (value: number) => {
		const formattedValue = value.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
		return formattedValue;
	};

	return (<>
		<Card className="mb-1 w-full overflow-y-auto overflow-x-hidden shadow-blue-100 border border-blue-gray-100">
			<CardBody>
				<div className="relative flex flex-col">
					<div className="w-full flex justify-between items-center mb-3">
						<Typography color="blue-gray" variant="lead" className="text-lg lg:text-xl">{`Pending expenses`}</Typography>
						<Button variant="filled" color="blue" className="hidden lg:block hover:bg-blue-600" size="sm" onClick={handleOpen}>
							{`Add pendig expense`}
						</Button>
						<Button className="lg:hidden block text-[11px] hover:bg-blue-500 hover:text-white" variant="text" color="blue" size="sm" onClick={handleOpen}>
							{`Add pending expense`}
						</Button>
					</div>
					{/* <Typography variant="lead">Gastos previstos</Typography> */}
					<table className="w-full min-w-max table-auto text-left">
						<thead className="rounded-lg  bg-blue-50">
							<tr>
								{TABLE_HEAD.map((title, index) => (
									<th key={title} className={`p-2 lg:p-4 ${index == 0 ? 'rounded-tl-lg rounded-bl-lg' : ''} ${index == TABLE_HEAD.length - 1 ? 'rounded-tr-lg rounded-br-lg' : ''}`}>
										<Typography
											variant="small"
											color="blue-gray"
											className="hidden lg:block font-normal leading-none opacity-70"
										>
											{title}
										</Typography>
										<Typography
											variant="small"
											color="blue-gray"
											className="lg:hidden font-normal leading-none opacity-70 text-xs "
										>
											{title}
										</Typography>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{pendingArray.map((p, index) => (
								<tr key={p.id} className="even:bg-blue-50/50 hover:bg-blue-100/80">
									<td className="p-2 lg:p-4">
										<Typography variant="small" color="blue-gray" className="text-xs lg:text-[15px]">
											{p.name}
										</Typography>
									</td>
									<td className="p-2 lg:p-4">
										<Typography variant="small" color="blue-gray" className="text-xs lg:text-[15px]">
											{moneyFilter(p.amount)}
										</Typography>
									</td>
									<td className="p-2 lg:p-4">
										<Typography variant="small" color="blue-gray" className="text-xs lg:text-[15px]">
											{typeFilter(p.type)}
										</Typography>
									</td>
									<td className="p-2 lg:p-4">
										<Tooltip content={`Clear this expense amount`}>
											<IconButton variant="text" color="blue" size="sm" onClick={() => setSelectedExpense(p)}>
												<FontAwesomeIcon icon={faPencil} />
											</IconButton>
										</Tooltip>

									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardBody>
			{/* <CardFooter>
				<Button onClick={handleOpen}>Agregar gasto previsto</Button>

			</CardFooter> */}
		</Card>
		{isOpen && <ExpensesForm isPending={true} tableId={tableId} isOpen handleOpen={handleOpen} />}
		{selectedExpense &&
			<ResetAmountDialog tableId={tableId} pendingArray={pendingArray} selectedItem={selectedExpense} onCancel={handleCancelResetAmount} />}
	</>);
}

interface ResetAmountDialogPropsI {
	pendingArray: PendingExpenseI[];
	tableId: string;
	selectedItem: PendingExpenseI;
	onCancel: () => void;
}

const ResetAmountDialog: React.FC<ResetAmountDialogPropsI> = ({ pendingArray, tableId, selectedItem, onCancel }) => {
	const [isOpen, setIsOpen] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleOpen = () => {
		setIsOpen(false);
		if (onCancel) onCancel();
	};

	async function editPendingTable() {
		setIsSubmitting(true);
		let newPendingArray = [...pendingArray];
		const index = newPendingArray.findIndex(e => e.id == selectedItem.id);
		if (index == -1) return;
		newPendingArray[index].amount = 0;
		// const response = await addPendingExpense(tableId, newPendingArray);
		// if (response) {
		// 	if (dataCallback) dataCallback(response);
		// 	setIsSubmitting(false);
		// }
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
					<span>{selectedItem.name}</span>
					<span>${selectedItem.amount.toFixed(2)}</span>
					<span>{selectedItem.type == 'cash' ? `Cash` : `Card`}</span>
				</Typography>
			</DialogBody>
			<DialogFooter className="flex flex-row justify-center gap-4">
				<Button variant="outlined" color="red" onClick={handleOpen} disabled={isSubmitting}>{`Cancel`}</Button>
				<Button variant="outlined" onClick={editPendingTable} loading={isSubmitting}>{`Confirm`}</Button>
			</DialogFooter>
		</Dialog>
	</>);
}
