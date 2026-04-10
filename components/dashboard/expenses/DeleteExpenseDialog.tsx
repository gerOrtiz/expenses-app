'use client';
// import { useActiveTableId } from "@/hooks/useActiveTableId";
import { useDeleteExpense } from "@/hooks/useDeleteExpense";
import { useDeletePendingExpense } from "@/hooks/useDeletePendingExpense";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { ExpenseItemI, PendingExpenseI } from "@/interfaces/expenses";
import { faTimes, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, Dialog, DialogBody, DialogFooter, IconButton, Typography } from "@material-tailwind/react";
import { useState } from "react";

interface DeleteDialogPropsI {
	expense: ExpenseItemI | PendingExpenseI;
	date?: number;
	isPending?: boolean;
	onCancel: () => void;
}

export default function DeleteExpenseDialog({ expense, date, isPending, onCancel }: DeleteDialogPropsI) {
	// const tableId = useActiveTableId();
	const { formatValue } = useMoneyFilter();
	const [open, setOpen] = useState(true);
	const dialogRef = useStableDialogA11y(open, 'delete-expense-label', 'delete-expense-description');
	const { mutation: expenseMutation } = useDeleteExpense();
	const { mutation: pendingMutation } = useDeletePendingExpense();


	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	const handleOpen = () => {
		setOpen(op => !op);
		onCancel();
	}

	const cancelHandler = () => {
		setOpen(false);
		onCancel();
	}

	const deleteExpenseHandler = async () => {
		let res: Response;
		if (isPending) res = await pendingMutation.mutateAsync({ pendingExpenseId: expense.id });
		else res = await expenseMutation.mutateAsync({ clientExpenseId: expense.id });
		if (res.ok) {
			cancelHandler();
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
							{`Delete expense`}
						</Typography>
						<IconButton variant="text" aria-label={`Close edit dialog`} size="sm" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} color="blue-gray" />
						</IconButton>
					</div>
					<Typography color="blue-gray" variant="paragraph" id="delete-expense-description">
						{isPending ? `You're about to delete this expense` : `You're about to delete this pending expense`}:
					</Typography>
					<Card className="shadow-sm border border-blue-gray-100">
						<CardBody className="p-4">
							<div className="flex justify-between items-center">
								<div className="flex flex-col">
									<Typography variant="small" color="blue-gray" className="font-medium">
										{expense.description}
									</Typography>
									{date && <Typography variant="small" color="gray" className="text-xs">
										{formatDate(date)}
									</Typography>}
								</div>
								<div className="flex items-end gap-1">
									<Typography variant="small" color="blue-gray" className="font-normal">
										{expense.type === 'cash' ? 'Cash' : 'Card'}:
									</Typography>
									<Typography
										variant="small"
										className="font-semibold text-blue-gray-800"
									>
										{formatValue(expense.amount)}
									</Typography>
								</div>
							</div>
						</CardBody>
					</Card>
					<div role="alert" className="flex w-full p-4 bg-red-100 rounded-md gap-4 items-center">
						<FontAwesomeIcon aria-label="warning icon" icon={faTriangleExclamation} size="lg" color="yellow" />
						<Typography className="font-semibold" color="blue-gray" variant="small" >
							{isPending ?
								`If there are linked payments to this pending expense, it will affect totals and reports. This action can't be undone.`
								: `This action can't be undone.`}
						</Typography>
					</div>
					<Typography className="text-center" color="blue-gray" variant="small" >
						{`Do you wish to continue?`}
					</Typography>
				</div>
			</DialogBody>
			<DialogFooter>
				<div className="flex flex-row gap-4">
					<Button variant="filled" className="filled" onClick={deleteExpenseHandler} loading={expenseMutation.isPending || pendingMutation.isPending}>{`Delete`}</Button>
					<Button variant="outlined" className="outlined" disabled={expenseMutation.isPending} onClick={cancelHandler}>{`Cancel`}</Button>
				</div>
			</DialogFooter>
		</Dialog>
	);
}
