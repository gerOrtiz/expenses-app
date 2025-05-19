'use client';

import SimpleExpensesContext from "@/components/providers/simple-expenses-context";
import { ExpenseItemI, ExpensesTableI } from "@/interfaces/expenses";
import { deleteExpenses, updateExpenses } from "@/lib/user/simple-expenses";
import { Button, Card, CardFooter, Dialog, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";

interface DeleteDialogPropsI {
	index: number;
	expense: ExpenseItemI;
	isPendingPayment: boolean;
	onCancel: () => void;
}

export default function DeleteDialog({ index, expense, isPendingPayment, onCancel }: DeleteDialogPropsI) {
	const [open, setOpen] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const tableCtx = useContext(SimpleExpensesContext);
	const handleOpen = () => setOpen((op) => !op);

	function cancel() {
		setOpen(false);
		onCancel();
	}
	async function deleteEntry() {
		// setIsDeleting(true);
		// let newExpensesList = [...expensesList];
		// newExpensesList.splice(index, 1);
		const currentTable = tableCtx.getCurrentExpenses();
		const updatedTable = await deleteExpenses(currentTable.id, expense.id);
		// const attr = isPendingPayment ? 'pending' : 'expenses';
		// currentTable[attr] = newExpensesList;
		// await updateExpenses(currentTable.id, currentTable[attr]);
		tableCtx.updateExpensesTable(updatedTable);
		onCancel();

		// if (dataCallback) dataCallback(currentTable);
	}


	return (
		<Dialog
			size="xs"
			open={open}
			handler={handleOpen}
			className="bg-transparent shadow-none"
		>
			<Card className="border border-blue-gray-100 shadow-sm p-3">
				<Typography variant="h4" color="blue-gray">
					Estás a punto de borrar una entrada
				</Typography>
				<Typography color="gray" className="mt-1 font-normal">
					Esta accion no se puede deshacer, ¿Deseas continuar?
				</Typography>
				<CardFooter>
					<div className="flex flex-row gap-4">
						<Button onClick={deleteEntry} loading={isDeleting}>Continuar</Button>
						<Button variant="outlined" onClick={cancel}>Cancelar</Button>
					</div>
				</CardFooter>
			</Card>
		</Dialog>
	);
}
