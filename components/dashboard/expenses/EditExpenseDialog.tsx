'use client';
import { useEditExpense } from "@/hooks/useEditExpense";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { ExpenseItemI } from "@/interfaces/expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, Typography, Select, Option, DialogBody, IconButton } from "@material-tailwind/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface EditExpenseDialogPropsI {
	expense: ExpenseItemI | null;
	isOpen: boolean;
	handleOpen: () => void;
}

type ExpenseFormType = Omit<ExpenseItemI, 'date' | 'isPending'>;

export default function EditExpenseDialog({ expense, isOpen, handleOpen }: EditExpenseDialogPropsI) {
	const dialogRef = useStableDialogA11y(isOpen, 'edit-expense-label', 'edit-expense-description');
	const { register, handleSubmit, control, reset, formState: { errors, isValid, isSubmitting } } =
		useForm<ExpenseFormType>({ mode: 'onTouched', values: { description: expense.description, amount: expense.amount, type: expense.type } });
	const { mutation } = useEditExpense();

	const onSubmit: SubmitHandler<ExpenseFormType> = async (data) => {

		const editedRow: ExpenseItemI = {
			...expense,
			description: data.description,
			amount: data.amount,
			type: data.type
		};

		const res = await mutation.mutateAsync({ clientExpense: editedRow });
		if (res.ok) {
			reset();
			handleOpen();
		}
	}

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
							Edit Expense
						</Typography>
						<IconButton variant="text" aria-label={`Close edit dialog`} size="sm" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} color="blue-gray" />
						</IconButton>
					</div>

					<Typography color="blue-gray" variant="paragraph" id="edit-expense-description">
						Update the expense details
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
