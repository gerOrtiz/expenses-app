'use client';
import SimpleExpensesContext from "@/components/providers/simple-expenses-context";
import { ExpenseItemI } from "@/interfaces/expenses";
import { updateExpenses } from "@/lib/user/simple-expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, Input, Typography, Select, Option, DialogBody, IconButton } from "@material-tailwind/react";
import { useState, useEffect, useContext } from "react";

interface EditExpenseDialogPropsI {
	expense: ExpenseItemI | null;
	isOpen: boolean;
	handleOpen: () => void;
	onSave?: (updatedExpense: ExpenseItemI) => void;
}

export default function EditExpenseDialog({ expense, isOpen, handleOpen, onSave }: EditExpenseDialogPropsI) {
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState<string>('');
	const [type, setType] = useState<string>('cash');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const tableContext = useContext(SimpleExpensesContext);

	const handleAmountChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const value = ev.target.value;
		if (!isNaN(parseFloat(value))) setAmount(value);
		else setAmount('');
	};

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!expense) return;

		setIsSubmitting(true);

		const editedRow: ExpenseItemI = {
			...expense,
			description,
			amount: parseFloat(amount),
			type
		};

		const newData = await updateExpenses(tableContext.expensesTable.id, editedRow);

		tableContext.updateExpensesTable(newData);

		if (onSave) onSave(editedRow);

		setIsSubmitting(false);
		handleOpen();
	}

	// Populate form when expense changes
	useEffect(() => {
		if (expense) {
			setDescription(expense.description || '');
			setAmount(expense.amount?.toString() || '');
			setType(expense.type || 'cash');
		}
	}, [expense]);

	return (
		<Dialog
			size="xs"
			open={isOpen}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
		>
			<DialogBody className="w-full p-4">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Typography variant="h4" color="blue-gray">
							Edit Expense
						</Typography>
						<IconButton variant="text" aria-label="close" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} size="lg" color="blue-gray" />
						</IconButton>
					</div>

					<Typography color="gray" variant="paragraph" className="mt-1 font-normal">
						Update the expense details
					</Typography>

					<form className="mt-2 mb-2" onSubmit={submitHandler}>
						<div className="mb-1 flex flex-col gap-3">
							<div className="flex flex-col items-left">
								<label htmlFor="edit-description" className="text-xs text-gray-800 font-semibold">
									Description
								</label>
								<Input
									id="edit-description"
									name="description"
									className="!rounded-lg !border-blue-600 !border-2 p-3"
									color="blue"
									labelProps={{ className: 'hidden' }}
									value={description}
									type="text"
									onChange={event => setDescription(event.target.value)}
									crossOrigin={undefined}
								/>
							</div>

							<div className="flex flex-col items-left">
								<label htmlFor="edit-amount" className="text-xs text-gray-800 font-semibold">
									Amount
								</label>
								<Input
									id="edit-amount"
									name="amount"
									className="!rounded-lg !border-blue-600 !border-2 p-3"
									color="blue"
									labelProps={{ className: 'hidden' }}
									type="number"
									min={0.1}
									step={0.01}
									value={amount}
									onChange={handleAmountChange}
									crossOrigin={undefined}
								/>
							</div>

							<div className="flex flex-col items-left">
								<label htmlFor="edit-paymethod" className="text-xs text-gray-800 font-semibold">
									{`Paymethod`}
								</label>
								<Select
									id="edit-paymethod"
									name="paymethod"
									className="!rounded-lg !border-blue-600 !border-2 p-3 !text-base"
									color="blue"
									labelProps={{ className: 'hidden' }}
									value={type}
									onChange={(val) => setType(val)}
								>
									<Option value="cash">Efectivo</Option>
									<Option value="card">Tarjeta</Option>
								</Select>
							</div>
						</div>

						<div className="flex gap-3 mt-6">
							<Button
								variant="filled"
								color="blue"
								className="flex-1 hover:bg-blue-600"
								type="submit"
								disabled={(!type || !amount || !description) || isSubmitting}
								loading={isSubmitting}
							>
								Save Changes
							</Button>
							<Button
								variant="outlined"
								color="blue"
								className="flex-1"
								onClick={handleOpen}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
						</div>
					</form>
				</div>
			</DialogBody>
		</Dialog>
	);
}
