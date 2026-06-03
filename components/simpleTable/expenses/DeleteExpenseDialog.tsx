'use client';
import { Text } from "@/components/ui/Text";
import { useDeleteExpense } from "@/hooks/useDeleteExpense";
import { useDeletePendingExpense } from "@/hooks/useDeletePendingExpense";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { ExpenseItemI, PendingExpenseI } from "@/interfaces/expenses";
import { faTimes, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, Dialog, DialogBody, DialogFooter, IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";

interface DeleteDialogPropsI {
	expense: ExpenseItemI | PendingExpenseI;
	date?: number;
	isPending?: boolean;
	onCancel: () => void;
}

export default function DeleteExpenseDialog({ expense, date, isPending, onCancel }: DeleteDialogPropsI) {
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

	useEffect(() => {
		if (expenseMutation.isError) throw expenseMutation.error;
		else if (pendingMutation.isError) throw pendingMutation.error;
	}, [expenseMutation, pendingMutation])

	return (
		<Dialog
			size="xs"
			open={open}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
		>
			<DialogBody ref={dialogRef} className="w-full p-4 pb-0">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Text variant="h4" id="delete-expense-label">{`Delete expense`}</Text>
						<IconButton variant="text" aria-label={`Close edit dialog`} size="sm" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} color="blue" />
						</IconButton>
					</div>
					<Text variant="body" id="delete-expense-description">
						{!isPending ? `You're about to delete this expense` : `You're about to delete this pending expense`}:
					</Text>
					<Card className="shadow-sm border border-blue-gray-100">
						<CardBody className="p-4">
							<div className="flex justify-between items-center">
								<div className="flex flex-col">
									<Text variant="label" className="font-medium">{expense.description}</Text>
									{date && <Text variant="small">{formatDate(date)}</Text>}
								</div>
								<div className="flex items-end gap-1">
									<Text variant="label">{expense.type === 'cash' ? 'Cash' : 'Card'}:</Text>
									<Text variant="label" className="font-semibold">{formatValue(expense.amount)}</Text>
								</div>
							</div>
						</CardBody>
					</Card>
					<div role="alert" className="flex w-full p-4 bg-red-100 rounded-md gap-4 items-center">
						<FontAwesomeIcon aria-label="warning icon" icon={faTriangleExclamation} size="lg" color="yellow" />
						<Text variant="label" className="font-semibold text-blue-gray-700">
							{isPending ?
								`If there are linked payments to this pending expense, it will affect totals and reports. This action can't be undone.`
								: `This action can't be undone.`}
						</Text>
					</div>
					<Text variant="label" className="text-center">
						{`Do you wish to continue?`}
					</Text>
					{/* <span className="text-blue-gray-800 font-semibold text-sm lg:text-base text-center">
						
					</span> */}
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
