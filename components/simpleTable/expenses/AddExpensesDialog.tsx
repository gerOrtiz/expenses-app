'use client';
import { Text } from "@/components/ui/Text";
import { useActiveTable } from "@/hooks/useActiveTable";
import { useAddExpense } from "@/hooks/useAddExpense";
import { useAddPendingExpense } from "@/hooks/useAddPendingExpense";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { ExpenseItemI, PendingExpenseI } from "@/interfaces/expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, Select, Option, Checkbox, DialogBody, IconButton } from "@material-tailwind/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";


interface ExpensesFormPropsI {
	isPending: boolean;
	//updateTableHandler?: (data: ExpensesTableI) => void;
	isOpen: boolean;
	handleOpen: () => void;
}

type ExpenseFormType = Omit<ExpenseItemI, 'date' | 'isPending'>;

const hasTypePendingExpenses = (pendingExpenses: PendingExpenseI[], type: string): Boolean => {
	return pendingExpenses.some(t => t.type === type);
}

export default function AddExpensesDialog({ isPending, isOpen, handleOpen }: ExpensesFormPropsI) {
	const message = isPending ? `Enter a pending to pay expense` : `Enter a new expense to add it to the table`;
	const { data } = useActiveTable();
	const { formatValue } = useMoneyFilter();
	const currentTable = data.data;
	const [isPendingPayment, setIsPendingPayment] = useState(false);
	const [hasPendingExpenses, setHasPendingExpenses] = useState<boolean>(false);
	const maxAmount = useRef<number>(isPending ? Infinity : currentTable ? currentTable.remaining.cash : Infinity);
	const dialogRef = useStableDialogA11y(isOpen, 'expense-label', 'expense-description');
	const { register, handleSubmit, control, reset, watch, trigger, setValue, formState: { isValid, isSubmitting, errors } } =
		useForm<ExpenseFormType>({ mode: 'onTouched', values: { description: '', type: 'cash', amount: 1, pending_id: '' } });
	const { mutation: pendingMutation } = useAddPendingExpense();
	const { mutation: expenseMutation } = useAddExpense();

	const onSubmit: SubmitHandler<ExpenseFormType> = async (data) => {
		let res: Response;
		if (isPending) {
			const newPendingExpense: PendingExpenseI =
				{ description: data.description, amount: data.amount, originalAmount: data.amount, type: data.type, fulfilled: false };
			// console.log({ currentTable_id: currentTable._id, newPendingExpense });
			res = await pendingMutation.mutateAsync({ newPendingExpense });
		}
		else {
			let expenseObj: ExpenseItemI = {
				description: data.description, amount: data.amount, type: data.type, date: new Date().getTime(), isPending: false, pending_id: undefined
			};
			if (isPendingPayment && data.pending_id) {
				expenseObj.isPending = true;
				expenseObj.pending_id = data.pending_id;
			}
			setIsPendingPayment(false);
			res = await expenseMutation.mutateAsync({ newClientExpense: expenseObj });
		}
		if (res.ok) {
			handleOpen();
			reset();
		}
	};

	const handlePendingFlag = () => setIsPendingPayment((val) => !val);
	const watchType = watch('type');


	const filteredPending = useMemo<PendingExpenseI[]>(() => {
		if (isPending) return [];
		if (!currentTable || !currentTable.pending) return [];
		if (currentTable.pending.length === 0) return [];
		const typeHasPending = hasTypePendingExpenses(currentTable.pending, watchType);
		if (!typeHasPending) return [];
		const newArray = currentTable.pending.filter((pendingExpense) => pendingExpense.type === watchType && !pendingExpense.fulfilled);
		return newArray;
	}, [isPending, watchType, currentTable]);

	useEffect(() => {
		if (isPending) return;
		if (!currentTable) return;
		maxAmount.current = currentTable.remaining[watchType];
		trigger('amount');
		if (!currentTable.pending || currentTable.pending.length === 0) return;
		const hasPending = hasTypePendingExpenses(currentTable.pending, watchType);
		if (!hasPending) {
			setHasPendingExpenses(false);
			setIsPendingPayment(false);
		} else {
			setHasPendingExpenses(true);
			setValue('pending_id', filteredPending[0].id);
		}
	}, [isPending, currentTable, watchType, filteredPending, setValue, trigger]);

	useEffect(() => {
		if (expenseMutation.isError) throw expenseMutation.error;
		else if (pendingMutation.isError) throw pendingMutation.error;
	}, [expenseMutation.isError, pendingMutation.isError]);


	return (<>
		<Dialog
			size="xs"
			open={isOpen}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
		>
			<DialogBody ref={dialogRef} className="w-full  p-4">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Text variant="h4" id="expense-label">{isPending ? `Add Pending` : `Add expense`}</Text>
						<IconButton variant="text" aria-label="close" size="sm" onClick={handleOpen} >
							<FontAwesomeIcon icon={faTimes} color="blue" />
						</IconButton>
					</div>
					<Text variant="body" id="expense-description" >{message}</Text>

					<form className="mt-2 mb-2" onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-1 flex flex-col gap-3">
							<div className="flex flex-col items-left">
								<label htmlFor="description" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Description'}</label>
								<input id="description" name="description" type="text" className={`formInput ${errors.description ? 'inputError' : ''}`} {...register('description', { required: true, minLength: 3 })} />
								{errors.description && errors.description.type === 'required' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
								{errors.description && errors.description.type === 'minLength' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Description requires at least 3 characters`}</span>)}
							</div>
							<div className="flex flex-col items-left">
								<label htmlFor="amount" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Amount'}</label>
								<input id="amount" name="amount" type="number" className={`formInput ${errors.amount ? 'inputError' : ''}`} step={0.01}
									{...register('amount', {
										required: true,
										min: { value: 0.1, message: 'Amount must be a positive number' },
										valueAsNumber: true,
										validate: (value) => value <= maxAmount.current || 'Amount surpasses budget for current method'
									})} />
								{errors.amount && errors.amount.type === 'required' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
								{errors.amount && errors.amount.message &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{errors.amount.message}</span>)}
							</div>
							<div className="flex flex-col items-left">
								<label htmlFor="method-select" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Method'}</label>
								<Controller name="type"
									control={control}
									rules={{ required: true }}
									render={({ field }) =>
										<Select
											id="method-select"
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
								{errors.type && errors.type.type === 'required' &&
									(<span role="alert" className="text-sm text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
							</div>


							{!isPending && hasPendingExpenses && (
								<div className="flex gap-2 items-center">
									<Checkbox id="payment"
										containerProps={{ 'aria-label': 'Check if it is a payment' }}
										color="blue"
										defaultChecked={isPendingPayment}
										onChange={handlePendingFlag}
										crossOrigin={undefined} />
									<Text id="payment-label" variant="label" className="text-blue-gray-900 font-light">{`Is a pending payment?`}</Text>
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
							<Button variant="filled" aria-disabled={isSubmitting || !isValid} className=" filled" type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid}>
								{`Add`}
							</Button>
							<Button variant="outlined" className="outlined" disabled={isSubmitting} onClick={handleOpen}	>
								{`Cancel`}
							</Button>
						</div>

						{(expenseMutation.isError || pendingMutation.isError) && (
							<span role="alert" className="text-sm text-red-700 font-normal mt-1 text-left">{`Something went wrong, please try again later`}</span>
						)}
					</form>
				</div>
			</DialogBody>

		</Dialog>
	</>);
}
