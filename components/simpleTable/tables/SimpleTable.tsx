'use client';
import { faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardBody, IconButton } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import AddExpensesDialog from '../expenses/AddExpensesDialog';
import DeleteExpenseDialog from '../expenses/DeleteExpenseDialog';
import { ExpenseItemI } from '@/interfaces/expenses';
import EditExpenseDialog from '../expenses/EditExpenseDialog';
import { useMoneyFilter } from '@/hooks/useMoneyFilter';
import classes from "@/styles/text-stroke.module.css";
import { Text } from '@/components/ui/Text';


interface SimpleTablePropsI {
	expenses: ExpenseItemI[];
	// dataCallback?: (data: ExpensesTableI) => void;
}

const dateFilter = (date: number) => {
	return new Date(date).toLocaleDateString();
}

export default function SimpleTable({ expenses }: SimpleTablePropsI) {
	const [expensesList, setExpensesList] = useState<ExpenseItemI[] | null>(null);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [indexBeingEdited, setIndexBeingEdited] = useState<number>(-1);
	const [isOpen, setOpen] = useState<boolean>(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [expenseToEdit, setExpenseToEdit] = useState<ExpenseItemI | null>(null);
	const { formatValue } = useMoneyFilter();

	const TABLE_HEAD = [`Description`, `Amount`, `Method`, `Date`, ''];
	const MOBILE_TABLE_HEAD = [`Description`, `Amount`, `Method`, ``];

	const typeFilter = (type: string): string => {
		return type == 'cash' ? `Cash` : `Card`;
	};

	const handleOpen = () => setOpen((cur) => !cur);

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
		// setIsEditing(false);
		setIsDeleting(false);
	}

	useEffect(() => {
		if (expenses) {
			const sortedExpenses = expenses.reverse();
			setExpensesList(sortedExpenses);
		}
	}, [expenses]);

	return (<>
		<Card className="mb-1 w-full overflow-x-hidden overflow-y-auto shadow-sm lg:shadow-md shadow-blue-100 border border-blue-gray-100 ">
			<CardBody>
				<div className="w-full flex justify-between items-center mb-3">
					<Text variant="h3">{`Current expenses`}</Text>
					<Button aria-label={`Add expense`} aria-haspopup={true} variant="outlined"
						className="hidden outlined lg:block transition ease-in-out hover:-translate-y-1 duration-200" size="sm"
						onClick={handleOpen}>
						{`Add`}
					</Button>
					<IconButton aria-label={`Add expense`} variant="outlined" size="sm" className="lg:hidden block  outlined" onClick={handleOpen}>
						<FontAwesomeIcon aria-label={`Plus symbol`} icon={faPlus} size="lg" />
					</IconButton>
				</div>
				<table className="lg:hidden w-full min-w-max table-auto text-center">
					<thead className="bg-gradient-to-tr from-white to-blue-50 shadow-md ">
						<tr>
							{MOBILE_TABLE_HEAD.map((title) => (
								<th aria-label={title ? title : `Edit column`}
									key={title}
									className="p-2 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md">
									<Text variant="small" className="p-1">{title}</Text>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{expensesList && expensesList.length > 0 && expensesList.map((expense, index) => (
							<tr key={index} className="even:bg-blue-50/50 hover:bg-blue-100/80">
								<td className="p-2 text-center text-nowrap text-ellipsis group-last:rounded-bl-md border-b border-blue-50">
									<Text variant="small">{expense.description}</Text>
								</td>
								<td className="p-2 border-b border-blue-50">
									<Text variant="small">{formatValue(expense.amount)}</Text>
								</td>
								<td className="p-2 border-b border-blue-50">
									<div className="w-full flex flex-col items-center justify-start gap-2">
										<Text variant="small">{typeFilter(expense.type)}</Text>
										{expense.isPending && (
											<span className={`${classes.activeStroke} text-[10px] text-indigo-400 font-normal`}>{`Pending`}</span>
										)}
									</div>
								</td>
								<td className="p-2 group-last:rounded-br-md border-b border-blue-50">
									<div className="grid-cols-2 ">
										<IconButton aria-haspopup={true} aria-label={`Open edit expense dialog`} variant="text" color="blue" size="sm" className="rounded-full mr-1" onClick={() => editRow(expense)}>
											<FontAwesomeIcon icon={faPencil} />
										</IconButton>
										<IconButton aria-haspopup={true} aria-label={`Open delete expense dialog`} variant="text" size="sm" color="blue" className="rounded-full" onClick={() => deleteExpense(index)}>
											<FontAwesomeIcon icon={faTrash} />
										</IconButton>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<table className="hidden lg:table w-full min-w-max table-auto text-center">
					<thead className="bg-gradient-to-tr from-white to-blue-50 shadow-md ">
						<tr>
							{TABLE_HEAD.map((title) => (
								<th aria-label={title ? title : `Edit column`}
									key={title}
									className="p-4 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md">
									<Text variant="label" >{title}</Text>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{expensesList && expensesList.length > 0 && expensesList.map((expense, index) => (
							<tr key={index} className="even:bg-blue-50/50 hover:bg-blue-100/80 group">
								<td className="p-4 group-last:rounded-bl-md border-b border-blue-50">
									<Text variant="label" className="lg:text-[15px] ">{expense.description}</Text>
								</td>
								<td className="p-4 border-b border-blue-50">
									<Text variant="label" className="lg:text-[15px]">{formatValue(expense.amount)} </Text>
								</td>
								<td className="p-4 border-b border-blue-50">
									<div className="w-full flex items-center justify-center gap-2">
										<Text variant="label" className="lg:text-[15px]">{typeFilter(expense.type)}</Text>
										{expense.isPending && (<PaymentBadge />)}
									</div>
								</td>
								<td className="p-4 border-b border-blue-50" >
									<Text variant="label" className="lg:text-[15px]">{dateFilter(expense.date)}</Text>
								</td>
								<td className="p-4 group-last:rounded-br-md border-b border-blue-50">
									<div className="grid-cols-2 ">
										<IconButton aria-label={`Open edit expense dialog`}
											variant="text" color="blue" size="sm"
											className="rounded-full mr-1 hover:-translate-y-1" onClick={() => editRow(expense)}>
											<FontAwesomeIcon icon={faPencil} size="lg" />
										</IconButton>
										<IconButton aria-label={`Open delete expense dialog`}
											variant="text" size="sm" color="blue"
											className="rounded-full hover:-translate-y-1" onClick={() => deleteExpense(index)}>
											<FontAwesomeIcon icon={faTrash} size="lg" />
										</IconButton>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</CardBody>
		</Card>
		{isDeleting && <DeleteExpenseDialog expense={expensesList[indexBeingEdited]} date={expensesList[indexBeingEdited].date} onCancel={cancelChanges} />}
		{isOpen && <AddExpensesDialog isPending={false} isOpen handleOpen={handleOpen} />}
		{openEditDialog && <EditExpenseDialog expense={expenseToEdit} isOpen={openEditDialog} handleOpen={handleOpenEditDialog} />}
	</>);
}



const PaymentBadge: React.FC = () => {
	return (<>
		<div className="w-2/3 lg:w-1/3 flex justify-center text-center p-1 rounded-xl bg-lime-400">
			<Text variant="small" className="text-indigo-500 text-[10px] lg:text-[11px]">{`Payment`}</Text>
		</div>
	</>);
};
