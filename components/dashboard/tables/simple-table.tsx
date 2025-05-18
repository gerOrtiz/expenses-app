'use client';
import classes from './tables.module.css'
import { faCheck, faPencil, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardBody, CardFooter, Checkbox, IconButton, input, Input, Option, Select, Typography } from '@material-tailwind/react';
import { useContext, useEffect, useState } from 'react';
import ExpensesForm from '../expenses/expenses-form';
import DeleteDialog from '../expenses/delete-dialog';
import { ExpenseItemI, ExpensesTableI } from '@/interfaces/expenses';
import { updateExpenses } from '@/lib/user/simple-expenses';
import SimpleExpensesContext from '@/components/providers/simple-expenses-context';

interface SimpleTablePropsI {
	expenses: ExpenseItemI[];
	tableId: string;
	dataCallback?: (data: ExpensesTableI) => void;
}

export default function SimpleTable({ expenses, tableId }: SimpleTablePropsI) {
	const [expensesList, setExpensesList] = useState<ExpenseItemI[] | null>(null);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [indexBeingEdited, setIndexBeingEdited] = useState<number>(-1);
	const [descriptionRef, setDescriptionRef] = useState<string>('');
	const [amountRef, setAmountRef] = useState<number>(0);
	const [typeRef, setTypeRef] = useState<string>('');
	const [isPendingRef, setIsPendingPayment] = useState<boolean>(false);
	const [isOpen, setOpen] = useState<boolean>(false);
	const [dateRef, setDateRef] = useState<number>();
	const tableContext = useContext(SimpleExpensesContext);

	const TABLE_HEAD = [`Description`, `Amount`, `Paymethod`, `Date`, `Is pending`, ' '];

	const typeFilter = (type: string): string => {
		return type == 'cash' ? `Cash` : `Card`;
	}

	const dateFilter = (date) => {
		return new Date(date).toLocaleDateString();
	}

	const handleOpen = () => setOpen((cur) => !cur);
	const handlePendingFlag = () => setIsPendingPayment((val) => !val);

	const editRow = (index: number, expense: ExpenseItemI) => {
		setIsEditing(true);
		setIndexBeingEdited(index);
		setDescriptionRef(expense.description);
		setAmountRef(expense.amount);
		setTypeRef(expense.type);
		setIsPendingPayment(expense.isPending);
		setDateRef(expense.date);
	}

	function deleteExpense(index: number) {
		setIndexBeingEdited(index);
		setIsDeleting(true);
	}

	function cancelChanges() {
		setIndexBeingEdited(-1);
		setIsEditing(false);
		setIsDeleting(false);
	}
	async function saveChanges(index: number) {
		let newExpensesList = [...expensesList];
		const editedRow: ExpenseItemI = {
			id: newExpensesList[index].id || 1,
			description: descriptionRef,
			amount: amountRef, type: typeRef, isPending: isPendingRef, date: newExpensesList[index].date
		};
		newExpensesList[index] = editedRow;
		console.log(editedRow);
		setExpensesList(newExpensesList);
		setIndexBeingEdited(-1);
		setIsEditing(false);
		const newData = await updateExpenses(tableId, editedRow);
		// dataCallback(newData);
		tableContext.updateExpensesTable(newData);
	}



	useEffect(() => {
		if (expenses) setExpensesList(expenses);
	}, [expenses]);

	return (<>
		<Card className="mb-1 w-full overflow-x-hidden overflow-y-auto">
			<CardBody>
				<Typography color="black" variant="lead">Gastos del período</Typography>
				<table className="w-full min-w-max table-auto text-left">
					<thead>
						<tr>
							{TABLE_HEAD.map(title => (
								<th key={title} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
									<Typography
										variant="small"
										color="black"
										className="font-normal leading-none opacity-70"
									>
										{title}
									</Typography>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{expensesList && expensesList.length > 0 && expensesList.map((expense, index) => (
							<tr key={index} className="even:bg-blue-gray-50/50">
								<td className="p-4">
									{indexBeingEdited != index && <Typography variant="small" color="black" className="font-normal">
										{expense.description}
									</Typography>}
									{isEditing && indexBeingEdited == index &&
										<input
											id="description" name="description"
											className={`max-w-24 font-sans ${classes.control}`}
											type="text"
											value={descriptionRef}
											onChange={event => setDescriptionRef(event.target.value)}
										/>}
								</td>
								<td className="p-4">
									{indexBeingEdited != index && <Typography variant="small" color="black" className="font-normal">
										{'$' + expense.amount}
									</Typography>}
									{isEditing && indexBeingEdited == index &&
										<input id="amount" name="amount"
											className={`max-w-20 font-sans ${classes.control}`}
											type="number"
											min={1}
											step={0.01}
											value={amountRef}
											onChange={event => setAmountRef(parseFloat(event.target.value))}
										/>}
								</td>
								<td className="p-4">
									{indexBeingEdited != index && <Typography variant="small" color="black" className="font-normal">
										{typeFilter(expense.type)}
									</Typography>}
									{isEditing && indexBeingEdited == index &&
										<select
											id="paymethod" name="paymethod"
											className={`font-sans ${classes.control}`}
											defaultValue={expense.type}
											onChange={(event) => setTypeRef(event.target.value)}>
											<option value="cash" >Efectivo</option>
											<option value="card" >Tarjeta</option>
										</select>
									}
								</td>
								<td className="p-4">

									<Typography variant="small" color="black" className="font-normal">
										{dateFilter(expense.date)}
									</Typography>


								</td>
								<td className="p-4">
									<div className="ml-3">
										<Checkbox disabled={indexBeingEdited != index} defaultChecked={expense.isPending} onChange={handlePendingFlag} crossOrigin={undefined} />
									</div>
								</td>
								<td className="p-4">
									<div className="grid-cols-2 ">
										{indexBeingEdited != index && <>
											<IconButton variant="text" size="sm" className="rounded-full mr-1" onClick={() => editRow(index, expense)}>
												<FontAwesomeIcon icon={faPencil} />
											</IconButton>
											<IconButton variant="text" size="sm" className="rounded-full" onClick={() => deleteExpense(index)}>
												<FontAwesomeIcon icon={faTrash} />
											</IconButton>
										</>}
										{isEditing && indexBeingEdited == index && <>
											<IconButton variant="text" size="sm" className="rounded-full mr-1" onClick={() => saveChanges(index)}>
												<FontAwesomeIcon icon={faCheck} />
											</IconButton>
											<IconButton variant="text" size="sm" className="rounded-full" onClick={cancelChanges}>
												<FontAwesomeIcon icon={faX} />
											</IconButton>
										</>}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</CardBody>
			<CardFooter>
				<Button onClick={handleOpen}>Agregar gasto</Button>
				{isOpen && <ExpensesForm isPending={false} tableId={tableId} isOpen handleOpen={handleOpen} />}
			</CardFooter>
		</Card>
		{isDeleting && <DeleteDialog
			expense={expensesList[indexBeingEdited]} isPendingPayment={false} index={indexBeingEdited}
			onCancel={cancelChanges}
		/>}
	</>);
}
