'use client';
// import { useActiveTableId } from "@/hooks/useActiveTableId";
import { useDeleteExpense } from "@/hooks/useDeleteExpense";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { ExpenseItemI } from "@/interfaces/expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogBody, DialogFooter, IconButton, Typography } from "@material-tailwind/react";
import { useState } from "react";

interface DeleteDialogPropsI {
	expense: ExpenseItemI;
	onCancel: () => void;
}

export default function DeleteExpenseDialog({ expense, onCancel }: DeleteDialogPropsI) {
	// const tableId = useActiveTableId();
	const [open, setOpen] = useState(true);
	const dialogRef = useStableDialogA11y(open, 'delete-expense-label', 'delete-expense-description');
	const { mutation } = useDeleteExpense();
	const handleOpen = () => {
		setOpen(op => !op);
		onCancel();
	}

	function cancel() {
		setOpen(false);
		onCancel();
	}

	const deleteExpenseHandler = async () => {
		const res = await mutation.mutateAsync({ clientExpenseId: expense.id });
		if (res.ok) {
			cancel();
		}
	}
	//Add Expense data for better UX
	return (
		<Dialog
			size="xs"
			open={open}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
		>
			<DialogBody ref={dialogRef} className="w-full p-4">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Typography variant="h5" className="text-blue-800" id="delete-expense-label">
							{`Delete expense?`}
						</Typography>
						<IconButton variant="text" aria-label={`Close edit dialog`} size="sm" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} color="blue-gray" />
						</IconButton>
					</div>
					<Typography color="blue-gray" variant="paragraph" id="delete-expense-description">
						{`This action can't be undone, do you wish to continue?`}
					</Typography>
				</div>
			</DialogBody>
			<DialogFooter>
				<div className="flex flex-row gap-4">
					<Button variant="filled" className="filled" onClick={deleteExpenseHandler} loading={mutation.isPending}>{`Delete`}</Button>
					<Button variant="outlined" className="outlined" disabled={mutation.isPending} onClick={cancel}>{`Cancel`}</Button>
				</div>
			</DialogFooter>
		</Dialog>
	);
}
