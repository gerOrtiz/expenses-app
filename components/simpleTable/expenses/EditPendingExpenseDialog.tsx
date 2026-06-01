'use client';

import { Text } from "@/components/ui/Text";
import { useActiveExpenses } from "@/hooks/useActiveExpenses";
import { useEditPendingExpense } from "@/hooks/useEditPendingExpense";
import { useFulfillPendingExpense } from "@/hooks/useFulfillPendingExpense";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { PendingExpenseI } from "@/interfaces/expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogBody, DialogHeader, IconButton, Option, Select, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface EditPendingDialogPropsI {
	pending: PendingExpenseI;
	isOpen: boolean;
	handleOpen: () => void;
}

export function EditPendingExpenseDialog({ pending, isOpen, handleOpen }: EditPendingDialogPropsI) {
	const dialogRef = useStableDialogA11y(isOpen, 'edit-pending-label', 'edit-pending-description');
	const expenses = useActiveExpenses();
	const { register, handleSubmit, control, reset, formState: { errors, isValid, isSubmitting } } =
		useForm<PendingExpenseI>({ mode: 'onTouched', values: { description: pending.description, amount: pending.amount, type: pending.type } });
	const { mutation: editMutation } = useEditPendingExpense();
	const { mutation: fulfillMutation } = useFulfillPendingExpense();

	const onSubmit: SubmitHandler<PendingExpenseI> = async (data) => {

		const editedRow: PendingExpenseI = {
			...pending,
			description: data.description,
			amount: hasLinkedExpenses ? pending.amount : data.amount,
			originalAmount: hasLinkedExpenses ? pending.originalAmount : data.amount,
			type: hasLinkedExpenses ? pending.type : data.type
		};
		const res = await editMutation.mutateAsync({ pendingExpense: editedRow });
		if (res.ok) {
			reset();
			handleOpen();
		}
	};

	const onFulfill = async () => {
		const res = await fulfillMutation.mutateAsync({ pendingExpenseId: pending.id });
		if (res.ok) {
			reset();
			handleOpen();
		}
	};

	const hasLinkedExpenses = (expenses.length === 0 ? false : expenses.some(e => e.isPending && e.pending_id && e.pending_id === pending.id));

	useEffect(() => {
		if (editMutation.isError) throw editMutation.error;
		else if (fulfillMutation.isError) throw fulfillMutation.error;
	}, [editMutation.isError, fulfillMutation.isError])

	return (
		<Dialog size="xs"
			open={isOpen}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
			ref={dialogRef}
		>
			<DialogHeader>
				<div className="flex w-full justify-between items-center">
					<Text variant="h4" id="edit-pending-label">{`Edit Pending Expense`}</Text>
					<IconButton variant="text" aria-label={`Close edit dialog`} size="sm" onClick={handleOpen}>
						<FontAwesomeIcon icon={faTimes} color="blue" />
					</IconButton>
				</div>
			</DialogHeader>
			<DialogBody className="p-4">
				<Tabs value="edition">
					<TabsHeader>
						<Tab value="edition" >
							<span className="font-semibold text-blue-800"> {`Edition`}</span>
						</Tab>
						<Tab value="fulfill" >
							<span className="font-semibold text-blue-800">{`Fulfill`}</span>
						</Tab>
					</TabsHeader>
					<TabsBody
						animate={{
							initial: { y: 250 },
							mount: { y: 0 },
							unmount: { y: 250 },
						}}
					>
						<TabPanel value="edition" className="w-full p-0">
							<div className="flex flex-col w-full gap-3 pt-3 px-2">
								<Text variant="body" id="edit-pending-description" >{`Update pending expense details`}</Text>
								{hasLinkedExpenses && (
									<div role="alert" className="flex w-full p-4 bg-red-100 rounded-md items-center">
										<Text variant="small" className="font-semibold text-blue-gray-700">
											{`This pending expense has linked payments and only description can be edited`}
										</Text>
									</div>
								)}
								<form className="mb-2 mt-2" onSubmit={handleSubmit(onSubmit)}>
									<div className="mb-1 flex flex-col gap-3">
										<div className="flex flex-col items-left">
											<label htmlFor="description" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Description'}</label>
											<input id="description" name="description" type="text"
												className={`formInput ${errors.description ? 'inputError' : ''}`}
												{...register('description', { required: true, minLength: 3 })} />
											{errors.description && errors.description.type === 'required' &&
												(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
											{errors.description && errors.description.type === 'minLength' &&
												(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Description requires at least 3 characters`}</span>)}
										</div>
										<div className="flex flex-col items-left">
											<label htmlFor="amount" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Amount'}</label>
											<input id="amount" name="amount" type="number" disabled={hasLinkedExpenses || pending.fulfilled}
												className={`formInput ${errors.amount ? 'inputError' : ''}`} step={0.01}
												{...register('amount', { required: true, min: 1, valueAsNumber: true })} />
											{errors.amount && errors.amount.type === 'required' &&
												(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
											{errors.amount && errors.amount.type === 'min' &&
												(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero`}</span>)}
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
														disabled={hasLinkedExpenses || pending.fulfilled}
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
						</TabPanel>
						<TabPanel value="fulfill" className="w-full p-0">
							<div className="flex flex-col w-full gap-4 p-3 text-center mt-2">
								<Text variant="body" id="edit-pending-description" >{`Mark this pending expense as fulfilled, this action turns its amount to 0`}</Text>
								<div className="w-full flex justify-center">
									<Button variant="outlined" className="outlined" disabled={pending.fulfilled || fulfillMutation.isPending} loading={fulfillMutation.isPending} onClick={onFulfill}>
										{`Fulfill`}
									</Button>
								</div>
							</div>
						</TabPanel>
					</TabsBody>
				</Tabs>
			</DialogBody>
		</Dialog>

	);
}
