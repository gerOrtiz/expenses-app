'use client';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardBody, IconButton, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import ExpensesForm from '../expenses/expenses-form';
import DeleteDialog from '../expenses/delete-dialog';
import { ExpenseItemI, ExpensesTableI } from '@/interfaces/expenses';

import EditExpenseDialog from '../expenses/edit-expenses-form';

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
	const [isOpen, setOpen] = useState<boolean>(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [expenseToEdit, setExpenseToEdit] = useState<ExpenseItemI | null>(null);
	// const tableContext = useContext(SimpleExpensesContext);

	const TABLE_HEAD = [`Description`, `Amount`, `Paymethod`, `Date`, ' '];
	const MOBILE_TABLE_HEAD = [`Description`, `Amount`, `Paymethod`, ` `];

	const typeFilter = (type: string): string => {
		return type == 'cash' ? `Cash` : `Card`;
	}

	const dateFilter = (date: number) => {
		return new Date(date).toLocaleDateString();
	}

	const moneyFilter = (value: number) => {
		const formattedValue = value.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
		return formattedValue;
	};

	const handleOpen = () => setOpen((cur) => !cur);
	// const handlePendingFlag = () => setIsPendingPayment((val) => !val);
	const handleOpenEditDialog = () => {
		setOpenEditDialog(cur => !cur);
	}

	const editRow = (expense: ExpenseItemI) => {
		setExpenseToEdit(expense);
		handleOpenEditDialog();
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

	useEffect(() => {
		if (expenses) {
			const sortedExpenses = expenses.reverse();
			setExpensesList(sortedExpenses);
		}
	}, [expenses]);

	return (<>
		<Card className="mb-1 w-full overflow-x-hidden overflow-y-auto shadow-blue-100 border border-blue-gray-100 ">
			<CardBody>
				<div className="w-full flex justify-between items-center mb-3">
					<Typography color="blue-gray" variant="lead" className="text-lg lg:text-xl">{`Current expenses`}</Typography>
					<Button variant="filled" color="blue" className="hidden lg:block hover:bg-blue-600" size="sm" onClick={handleOpen}>
						{`Add expense`}
					</Button>
					<Button className="lg:hidden block text-[11px] hover:bg-blue-500 hover:text-white" variant="text" color="blue" size="sm" onClick={handleOpen}>
						{`Add expense`}
					</Button>
				</div>
				<table className="lg:hidden w-full min-w-max table-auto text-center">
					<thead className="rounded-lg  bg-blue-50">
						<tr>
							{MOBILE_TABLE_HEAD.map((title, index) => (
								<th key={title} className={`p-2 ${index == 0 ? 'rounded-tl-lg rounded-bl-lg' : ''} ${index == MOBILE_TABLE_HEAD.length - 1 ? 'rounded-tr-lg rounded-br-lg' : ''}`}>
									<Typography
										variant="small"
										color="blue-gray"
										className="font-normal leading-none opacity-70 text-xs p-1"
									>
										{title}
									</Typography>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{expensesList && expensesList.length > 0 && expensesList.map((expense, index) => (
							<tr key={index} className="even:bg-blue-50/50 hover:bg-blue-100/80">
								<td className="p-2">
									<Typography variant="small" color="blue-gray" className="text-xs">
										{expense.description}
									</Typography>
								</td>
								<td className="p-2">
									<Typography variant="small" color="blue-gray" className="text-xs">
										{moneyFilter(expense.amount)}
									</Typography>
								</td>
								<td className="p-2">
									<div className="w-full flex flex-col items-center justify-start gap-2">
										<Typography variant="small" color="blue-gray" className="text-xs">
											{typeFilter(expense.type)}
										</Typography>
										{expense.isPending && (<PaymentBadge />)}
									</div>
								</td>
								<td className="p-2">
									{/* <Typography variant="small" color="blue-gray" className="text-xs">
										{dateFilter(expense.date)}
									</Typography> */}
									<div className="grid-cols-2 ">
										{!expense.isPending && <IconButton variant="text" color="blue" size="sm" className="rounded-full mr-1" onClick={() => editRow(expense)}>
											<FontAwesomeIcon icon={faPencil} />
										</IconButton>}
										<IconButton variant="text" size="sm" color="blue" className="rounded-full" onClick={() => deleteExpense(index)}>
											<FontAwesomeIcon icon={faTrash} />
										</IconButton>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<table className="hidden lg:table w-full min-w-max table-auto text-center">
					<thead className="rounded-lg  bg-blue-50">
						<tr>
							{TABLE_HEAD.map((title, index) => (
								<th key={title} className={`p-4 ${index == 0 ? 'rounded-tl-lg rounded-bl-lg' : ''} ${index == TABLE_HEAD.length - 1 ? 'rounded-tr-lg rounded-br-lg' : ''}`}>
									<Typography
										variant="small"
										color="blue-gray"
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
							<tr key={index} className="even:bg-blue-50/50 hover:bg-blue-100/80">
								<td className="p-4">
									<Typography variant="small" color="blue-gray" className="text-[15px]">
										{expense.description}
									</Typography>
								</td>
								<td className="p-4">
									<Typography variant="small" color="blue-gray" className="text-[15px]">
										{moneyFilter(expense.amount)}
									</Typography>
								</td>
								<td className="p-4">
									<div className="w-full flex items-center justify-center  gap-2">
										<Typography variant="small" color="blue-gray" className="text-[15px]">
											{typeFilter(expense.type)}
										</Typography>
										{expense.isPending && (<PaymentBadge />)}
									</div>

								</td>
								<td className="p-4">

									<Typography variant="small" color="blue-gray" className="text-[15px]">
										{dateFilter(expense.date)}
									</Typography>


								</td>
								<td className="p-4">
									<div className="grid-cols-2 ">
										{!expense.isPending && <IconButton variant="text" color="blue" size="sm" className="rounded-full mr-1" onClick={() => editRow(expense)}>
											<FontAwesomeIcon icon={faPencil} />
										</IconButton>}
										<IconButton variant="text" size="sm" color="blue" className="rounded-full" onClick={() => deleteExpense(index)}>
											<FontAwesomeIcon icon={faTrash} />
										</IconButton>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</CardBody>
		</Card>
		{isDeleting && <DeleteDialog
			expense={expensesList[indexBeingEdited]} isPendingPayment={false} index={indexBeingEdited}
			onCancel={cancelChanges}
		/>}
		{isOpen && <ExpensesForm isPending={false} tableId={tableId} isOpen handleOpen={handleOpen} />}
		{openEditDialog && <EditExpenseDialog expense={expenseToEdit} isOpen={openEditDialog} handleOpen={handleOpenEditDialog} />}
	</>);
}



const PaymentBadge: React.FC = () => {
	return (<>
		<div className="w-3/4 lg:w-1/2 flex justify-center text-center p-1 rounded-xl bg-amber-300">
			<Typography variant="small" color="white" className="text-[10px] lg:text-[11px]">{`Payment`}</Typography>
		</div>
	</>);
};
