'use client';
import SimpleExpensesContext from "@/components/providers/simple-expenses-context";
import { ExpenseItemI, ExpensesTableI, PendingExpenseI } from "@/interfaces/expenses";
import { addExpense, addPendingExpense } from "@/lib/user/simple-expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Dialog, Input, Typography, Select, Option, Checkbox, DialogBody, IconButton } from "@material-tailwind/react";
import { FormEventHandler, useContext, useEffect, useState } from "react";


interface ExpensesFormPropsI {
	isPending: boolean;
	tableId: string;
	updateTableHandler?: (data: ExpensesTableI) => void;
	isOpen: boolean;
	handleOpen: () => void;
}

export default function ExpensesForm({ isPending, tableId, isOpen, handleOpen }: ExpensesFormPropsI) {
	const message = isPending ? `Enter a pending to pay expense` : `Enter a new expense to add it to the table`;
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState<string>('');
	const [type, setType] = useState<string>('cash');
	// const [open, setOpen] = useState(true);
	// const [pendingArray, setPendingArray] = useState<PendingExpenseI[]>([]);
	const [filteredPending, setFilteredArray] = useState<PendingExpenseI[]>([]);
	const [isPendingPayment, setIsPendingPayment] = useState(false);
	const [pending_id, setPendingId] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasPendingExpenses, setHasPendingExpenses] = useState<boolean>(false);
	const tableCtx = useContext(SimpleExpensesContext);
	const expensesTable = tableCtx.expensesTable;
	// const handleOpen = () => {
	// 	setOpen((cur) => !cur);
	// };
	const handlePendingFlag = () => setIsPendingPayment((val) => !val);

	const hanldeAmountChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const value = ev.target.value;
		if (!isNaN(parseFloat(value))) setAmount(value);
		else setAmount('');
	};

	const filterPendingByType = (typeSelected: string, pendingArray: PendingExpenseI[]): PendingExpenseI[] => {
		const newArray = pendingArray.filter((pendingExpense) => pendingExpense.type == typeSelected);
		return newArray;
	}

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		let newData: any;

		if (isPending) {
			// const currentPending: PendingExpenseI[] = expensesTable ? [...expensesTable.pending] : [];
			// currentExpenses[currentExpenses.length - 1].id = currentExpenses.length + 1;
			// const newID = currentPending.length > 0 ? currentPending[currentPending.length - 1].id + 1 : 1;
			const newExpenseObj = { name: description, amount: parseFloat(amount), type, fulfilled: false };
			// currentPending.push(newExpenseObj);
			newData = await addPendingExpense(tableId, newExpenseObj);
		} else {
			let expenseObj = {
				description, amount: parseFloat(amount), type, date: new Date().getTime(), isPending: false, pending_id: undefined
			};
			if (isPendingPayment && pending_id) {
				expenseObj.isPending = true;
				expenseObj.pending_id = pending_id;
			}
			// expensesCopy.push(expenseObj);
			newData = await addExpense(tableId, expenseObj);
		}
		setIsSubmitting(false);
		handleOpen();
		setPendingId('');
		setIsPendingPayment(false);
		// if (newData && updateTableHandler) updateTableHandler(newData);
		if (newData) tableCtx.updateExpensesTable(newData);

	}

	// function selectType(val) {
	//   const pendingyByType = filterPendingByType(val, pendingArray);
	//   setFilteredArray(pendingyByType);
	//   setPendingId(val);
	// }

	useEffect(() => {
		if (!expensesTable) return;
		if (expensesTable.pending && expensesTable.pending.length > 0) {
			setHasPendingExpenses(true);
			const pendingyByType = filterPendingByType(type, expensesTable.pending);
			setFilteredArray(pendingyByType);
		}

	}, [expensesTable])

	return (<>
		<Dialog
			size="xs"
			open={isOpen}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
		>
			<DialogBody className="w-full  p-4">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Typography variant="h4" color="blue-gray">
							{`Expense`}
						</Typography>
						<IconButton variant="text" aria-label="close" onClick={handleOpen} >
							<FontAwesomeIcon icon={faTimes} size="lg" color="blue-gray" />
						</IconButton>
					</div>

					<Typography color="gray" variant="paragraph" className="mt-1 font-normal">
						{message}
					</Typography>
					<form className="mt-2 mb-2" onSubmit={submitHandler}>
						<div className="mb-1 flex flex-col gap-3">
							<div className="flex flex-col items-left">
								<label htmlFor="description" className="text-xs text-gray-800 font-semibold">{'Description'}</label>
								<Input
									id="description"
									name="description"
									className="!rounded-lg !border-blue-600 !border-2 p-3"
									color="blue"
									labelProps={{ className: 'hidden' }}
									value={description}
									type="text"
									onChange={event => setDescription(event.target.value)} crossOrigin={undefined} />
							</div>
							<div className="flex flex-col items-left">
								<label htmlFor="amount" className="text-xs text-gray-800 font-semibold">{'Amount'}</label>
								<Input
									id="amount"
									name="amount"
									className="!rounded-lg !border-blue-600 !border-2 p-3"
									color="blue"
									labelProps={{ className: 'hidden' }}
									type="number"
									min={0.1}
									step={0.01}
									value={amount}
									onChange={hanldeAmountChange} crossOrigin={undefined} />
							</div>
							<div className="flex flex-col items-left">
								<label htmlFor="paymethod" className="text-xs text-gray-800 font-semibold">{'Paymethod'}</label>
								<Select
									id="paymethod"
									name="paymethod"
									className="!rounded-lg !border-blue-600 !border-2 p-3 !text-base"
									color="blue"
									labelProps={{ className: 'hidden' }}
									value={type}
									onChange={(val) => setType(val)}>
									<Option value="cash">Efectivo</Option>
									<Option value="card">Tarjeta</Option>
								</Select>
							</div>


							{!isPending && hasPendingExpenses &&
								<Checkbox label={`Is a pending payment?`} color="blue" labelProps={{ className: 'text-gray-800 font-semibold' }} defaultChecked={isPendingPayment} onChange={handlePendingFlag} crossOrigin={undefined} />}
							{isPendingPayment && (<>
								<div className="flex flex-col items-left">
									<label htmlFor="pending" className="text-xs text-gray-800 font-semibold">{'Pending expense'}</label>
									<Select id="pending" name="pending"
										className="!rounded-lg !border-blue-600 !border-2 p-3 !text-base"
										color="blue"
										labelProps={{ className: 'hidden' }} value={pending_id} onChange={(val) => setPendingId(val)}>
										{filteredPending.map(pending => (
											<Option key={pending.id} value={pending.id + ''}>
												<span>{pending.name}: </span><span>${pending.amount.toFixed(2)} </span><span>({pending.type == 'cash' ? 'Efectivo' : 'Tarjeta'})</span>
											</Option>
										))}
									</Select>
								</div>
							</>)}
						</div>
						<Button variant="filled" color="blue" className="mt-6 hover:bg-blue-600" fullWidth type="submit" disabled={(!type || !amount || !description) || isSubmitting} loading={isSubmitting}>
							{`Add`}
						</Button>
					</form>
				</div>
			</DialogBody>

		</Dialog>
	</>);
}
