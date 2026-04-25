'use client';

import { faPencil, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Card,
	CardBody,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	IconButton,
	Tooltip,
	Typography
} from "@material-tailwind/react";
import { useState } from "react";
import ExpensesForm from "../expenses/AddExpensesDialog";
import { PendingExpenseI } from "@/interfaces/expenses";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import DeleteExpenseDialog from "../expenses/DeleteExpenseDialog";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { EditPendingExpenseDialog } from "../expenses/EditPendingExpenseDialog";

interface PendingExpensesTablePropsI {
	pendingArray: PendingExpenseI[];

	dataCallback?: () => void;
}

export default function PendingExpensesTable({ pendingArray }: PendingExpensesTablePropsI) {
	const [openAddPending, setOpenAddPending] = useState<boolean>(false);
	const [selectedExpense, setSelectedExpense] = useState<PendingExpenseI | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
	const dialogRef = useStableDialogA11y(openOptionsDialog, 'pending-options-label', 'pending-options-description');

	const { formatValue } = useMoneyFilter();

	const handleOpenAddPending = () => setOpenAddPending((cur) => !cur);

	const handleDeleteClick = (pending: PendingExpenseI) => {
		setSelectedExpense(pending);
		setIsDeleting(true);
	};

	const handleEditClick = (pending: PendingExpenseI) => {
		setSelectedExpense(pending);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setSelectedExpense(null);
		setIsDeleting(false);
		setIsEditing(false);
		if (openOptionsDialog) setOpenOptionsDialog(false);
	};

	const handleOpenChoiceDialog = (pending: PendingExpenseI) => {
		setSelectedExpense(pending);
		setOpenOptionsDialog(true);
	};

	const handleChoiceClick = (isEdit: boolean) => {
		if (isEdit) setIsEditing(true);
		else setIsDeleting(true);
		setOpenOptionsDialog(false);
	}

	const TABLE_HEAD = [`Description`, `Amount`, `Paymethod`, ""];

	const typeFilter = (type: string) => {
		return type == 'cash' ? `Cash` : `Card`;
	}

	return (<>
		<Card className="mb-1 w-full overflow-y-auto overflow-x-hidden shadow-blue-100 border border-blue-gray-100">
			<CardBody className="p-6 lg:p-4">
				<div className="relative flex flex-col">
					<div className="w-full flex justify-between items-center mb-3">
						<Typography color="blue-gray" variant="lead" className="text-lg lg:text-xl">{`Pending expenses`}</Typography>
						<Button aria-label={`Add pending expense`} variant="outlined" className="hidden outlined lg:block hover:-translate-y-1" size="sm" onClick={handleOpenAddPending}>
							{`Add`}
						</Button>
						<IconButton aria-label={`Add pending expense`} variant="outlined" size="sm" className="lg:hidden block  outlined" onClick={handleOpenAddPending}>
							<FontAwesomeIcon aria-label={`Plus symbol`} icon={faPlus} size="lg" />
						</IconButton>
					</div>
					<table className="w-full max-w-full table-auto text-left">
						<thead className="rounded-lg  bg-blue-50">
							<tr>
								{TABLE_HEAD.map((title, index) => (
									<th key={title}
										aria-label={title ? title : `Edit column`}
										className={`p-2 lg:p-4 ${index == 0 ? 'rounded-tl-lg rounded-bl-lg' : ''} ${index == TABLE_HEAD.length - 1 ? 'rounded-tr-lg rounded-br-lg' : ''}`}>
										<Typography
											variant="small"
											color="blue-gray"
											className="hidden lg:block font-semibold leading-none opacity-70"
										>
											{title}
										</Typography>
										<Typography
											variant="small"
											color="blue-gray"
											className="lg:hidden font-semibold leading-none opacity-70 text-xs "
										>
											{title}
										</Typography>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{pendingArray.map((p) => (
								<tr key={p.id} className="even:bg-blue-50/50 hover:bg-blue-100/80">
									<td className="p-2 lg:p-4">
										<Typography variant="small" color="blue-gray" className="text-xs lg:text-[15px]">
											{p.description}
										</Typography>
									</td>
									<td className="p-2 lg:p-4">
										<Typography variant="small" color="blue-gray" className="text-xs lg:text-[15px]">
											{formatValue(p.amount)}
										</Typography>
									</td>
									<td className="p-2 lg:p-4">
										<Typography variant="small" color="blue-gray" className="text-xs lg:text-[15px]">
											{typeFilter(p.type)}
										</Typography>
									</td>
									<td className="p-2 lg:p-4">
										<div className="flex lg:hidden gap-1">
											<IconButton aria-label={`Edit pending expense`} variant="text" color="blue" size="sm" onClick={() => handleEditClick(p)}>
												<FontAwesomeIcon icon={faPencil} />
											</IconButton>
											<IconButton aria-label={`Open delete dialog`} variant="text" size="sm" color="blue" className="rounded-full" onClick={() => handleDeleteClick(p)} >
												<FontAwesomeIcon icon={faTrash} />
											</IconButton>
										</div>
										<Tooltip content={`Open dialog to see options`}>
											<IconButton aria-label={`Open edition option dialog`}
												className="hidden lg:block hover:-translate-y-1"
												variant="text" color="blue" size="sm"
												onClick={() => handleOpenChoiceDialog(p)}>
												<FontAwesomeIcon icon={faPencil} />
											</IconButton>
										</Tooltip>

									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardBody>
		</Card>
		{openAddPending && <ExpensesForm isPending={true} isOpen={openAddPending} handleOpen={handleOpenAddPending} />}
		{isEditing &&
			<EditPendingExpenseDialog pending={selectedExpense} isOpen={isEditing} handleOpen={handleCancel} />}
		{isDeleting && (<DeleteExpenseDialog expense={selectedExpense} onCancel={handleCancel} isPending={true} />)}
		{openOptionsDialog && (
			<Dialog ref={dialogRef} size="sm" open={openOptionsDialog} handler={handleCancel} >
				<DialogHeader className="flex flex-col gap-4">
					<div className="flex w-full justify-between items-center">
						<Typography variant="h5" className="text-blue-800" id="pending-options-label">
							{`Pending expense edit options`}
						</Typography>
						<IconButton variant="text" aria-label={`Close edit dialog`} size="sm" onClick={handleCancel}>
							<FontAwesomeIcon icon={faTimes} color="blue-gray" />
						</IconButton>
					</div>
				</DialogHeader>
				<DialogBody className="p-2 text-center">
					<Typography color="blue-gray" variant="paragraph" id="pending-options-description">
						{`Choose action to perform: `}
					</Typography>
				</DialogBody>
				<DialogFooter className="flex flex-row justify-center gap-4">
					<Button variant="outlined" className="outlined" onClick={() => handleChoiceClick(true)} >{`Edit`}</Button>
					<Button variant="outlined" className="outlined" onClick={() => handleChoiceClick(false)}>{`Delete`}</Button>
				</DialogFooter>
			</Dialog>
		)}
	</>);
}
