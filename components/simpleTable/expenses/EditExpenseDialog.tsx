'use client';
import { useActiveTable } from "@/hooks/useActiveTable";
import { useEditExpense } from "@/hooks/useEditExpense";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { ExpenseItemI, PendingExpenseI } from "@/interfaces/expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, Typography, Select, Option, DialogBody, IconButton, Checkbox } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface EditExpenseDialogPropsI {
	expense: ExpenseItemI | null;
	isOpen: boolean;
	handleOpen: () => void;
}

type ExpenseFormType = Omit<ExpenseItemI, 'date'>;


const hasTypePendingExpenses = (pendingExpenses: PendingExpenseI[], type: string): Boolean => {
	return pendingExpenses.some(t => t.type === type);
}

export default function EditExpenseDialog({ expense, isOpen, handleOpen }: EditExpenseDialogPropsI) {
	const [hasPendingExpenses, setHasPendingExpenses] = useState(false);
	const [isPendingPayment, setIsPendingPayment] = useState(expense.isPending);
	const dialogRef = useStableDialogA11y(isOpen, 'edit-expense-label', 'edit-expense-description');
	const { formatValue } = useMoneyFilter();
	const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isValid, isSubmitting } } =
		useForm<ExpenseFormType>({
			mode: 'onTouched',
			values: { description: expense.description, amount: expense.amount, type: expense.type, isPending: expense.isPending, pending_id: expense.pending_id }
		});
	const { mutation } = useEditExpense();
	const { data } = useActiveTable();
	const currentTable = data && data.data ? data.data : null;

	const onSubmit: SubmitHandler<ExpenseFormType> = async (data) => {

		const editedRow: ExpenseItemI = {
			...expense,
			description: data.description,
			amount: data.amount,
			type: data.type
		};

		if (isPendingPayment) {
			editedRow.isPending = true;
			editedRow.pending_id = data.pending_id;
		} else {
			editedRow.isPending = false;
			if (editedRow.pending_id) delete editedRow.pending_id;
		}

		const res = await mutation.mutateAsync({ clientExpense: editedRow });
		if (res.ok) {
			reset();
			handleOpen();
		}
	};

	const handlePendingFlag = () => setIsPendingPayment((val) => !val);
	const watchType = watch('type');

	const filteredPending = useMemo<PendingExpenseI[]>(() => {
		if (!currentTable || !currentTable.pending) return [];
		if (currentTable.pending.length === 0) return [];
		const typeHasPending = hasTypePendingExpenses(currentTable.pending, watchType);
		if (!typeHasPending) return [];
		const newArray = currentTable.pending.filter((pendingExpense) => pendingExpense.type === watchType && !pendingExpense.fulfilled);
		return newArray;
	}, [watchType, currentTable]);

	useEffect(() => {
		if (!currentTable || !currentTable.pending) return;
		if (currentTable.pending.length === 0) return;
		const hasPending = hasTypePendingExpenses(currentTable.pending, watchType);
		if (watchType !== expense.type) setIsPendingPayment(false);

		if (!hasPending) {
			setHasPendingExpenses(false);

		} else {
			setHasPendingExpenses(true);
			setValue('pending_id', filteredPending[0].id);
		}
	}, [currentTable, watchType, setValue, filteredPending, expense.type]);

	return (
		<Dialog
			size="xs"
			open={isOpen}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
		>
			<DialogBody ref={dialogRef} className="w-full p-4">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Typography variant="h5" className="text-blue-800" id="edit-expense-label">
							{`Edit Expense`}
						</Typography>
						<IconButton variant="text" aria-label={`Close edit dialog`} size="sm" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} color="blue-gray" />
						</IconButton>
					</div>

					<Typography color="blue-gray" variant="paragraph" id="edit-expense-description">
						{`Update this expense details`}
					</Typography>

					<form className="mt-2 mb-2" onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-1 flex flex-col gap-3">
							<div className="flex flex-col items-left">
								<label htmlFor="description" className="text-xs text-gray-900 font-semibold ml-1">{'Description'}</label>
								<input id="description" name="description" type="text" className={`formInput ${errors.description ? 'inputError' : ''}`} {...register('description', { required: true, minLength: 3 })} />
								{errors.description && errors.description.type === 'required' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
								{errors.description && errors.description.type === 'minLength' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Description requires at least 3 characters`}</span>)}
							</div>
							<div className="flex flex-col items-left">
								<label htmlFor="amount" className="text-xs text-gray-900 font-semibold ml-1">{'Amount'}</label>
								<input id="amount" name="amount" type="number" className={`formInput ${errors.amount ? 'inputError' : ''}`} {...register('amount', { required: true, min: 1, valueAsNumber: true })} />
								{errors.amount && errors.amount.type === 'required' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
								{errors.amount && errors.amount.type === 'min' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero`}</span>)}
							</div>

							<div className="flex flex-col items-left">
								<label htmlFor="paymethod-select" className="text-xs text-gray-900 font-semibold ml-1">{'Paymethod'}</label>
								<Controller name="type"
									control={control}
									rules={{ required: true }}
									render={({ field }) =>
										<Select
											id="paymethod-select"
											className="formInput"
											{...field}
											containerProps={{ className: 'selectContainer' }}
											labelProps={{ className: 'hidden', 'aria-hidden': true, 'aria-label': 'Ignore' }}
											animate={{
												mount: { y: 0 },
												unmount: { y: 25 },
											}}
										>
											<Option value="cash">{`Cash`}</Option>
											<Option value="card">{`Card`}</Option>
										</Select>
									}
								/>
							</div>
							{(hasPendingExpenses) && (
								<div className="flex gap-2 items-center">
									<Checkbox id="payment"
										containerProps={{ 'aria-label': 'Check if it is a payment' }}
										color="blue"
										checked={isPendingPayment}
										onChange={handlePendingFlag}
										crossOrigin={undefined} />
									<Typography id="payment-label" variant="small" className=" text-blue-gray-900 font-light">{`Is a pending payment?`}</Typography>
								</div>

							)
							}
							{isPendingPayment && (<>
								<div className="flex flex-col items-left">
									<label htmlFor="pendingId" className="text-xs text-gray-800 font-semibold">{'Pending expense'}</label>
									<Controller name="pending_id"
										control={control}
										rules={{ required: true }}
										render={({ field: { onChange, value, ...rest } }) =>
											<Select id="pendingId"
												className="formInput"
												containerProps={{ className: 'selectContainer' }}
												{...rest}
												value={value}
												onChange={onChange}
												labelProps={{ className: 'hidden', 'aria-hidden': true, 'aria-label': 'Ignore' }}
												animate={{
													mount: { y: 0 },
													unmount: { y: 25 },
												}} >
												{filteredPending.map(pending => (
													<Option aria-label={`Pending expense id: ${pending.id}`} key={pending.id} value={pending.id}>
														<span>{pending.description}: </span><span>{formatValue(pending.amount)} </span><span>({pending.type.toWellFormed()})</span>
													</Option>
												))}
											</Select>
										}
									/>
								</div>
							</>)}

						</div>
						<div className="flex justify-end gap-3 mt-6">
							<Button
								variant="filled"

								className="filled"
								type="submit"
								disabled={isSubmitting || !isValid}
								loading={isSubmitting}
							>
								{`Save`}
							</Button>
							<Button
								variant="outlined"
								className="outlined"
								onClick={handleOpen}
								disabled={isSubmitting}
							>
								{`Cancel`}
							</Button>
						</div>
					</form>
				</div>
			</DialogBody>
		</Dialog>
	);
}
