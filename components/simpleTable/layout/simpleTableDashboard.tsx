'use client';
import {
	Button,
	Card,
	CardBody,
	Typography
} from "@material-tailwind/react";
import { useState } from "react";
import AddExpensesDialog from "../expenses/AddExpensesDialog";
import PendingExpensesTable from "../tables/PendingExpensesTable";
import RemainingIncome from "../income/RemainingIncome";
import SimpleTable from "../tables/SimpleTable";
import TotalsTables from "../tables/TotalsTables";
import { ExpensesTableI } from "@/interfaces/expenses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";




interface TableWrapperPropsI {
	tableData: ExpensesTableI;
}

export default function SimpleTableDashboard({ tableData }: TableWrapperPropsI) {
	const [pendingDialogOpen, setPendingDialogOpen] = useState(false);
	const [expenseDialogOpen, setExpenseDilogOpen] = useState(false);
	const handlePendingOpen = () => setPendingDialogOpen((cur) => !cur);
	const handleExpenseOpen = () => setExpenseDilogOpen((cur) => !cur);


	return (<>
		<section className="flex flex-col w-full items-center mt-3 mb-3 p-4 lg:p-1">
			<RemainingIncome remaining={tableData.remaining} totals={tableData.totals} added={tableData.added} />
		</section>
		<section className="grid grid-flow-row gap-y-3 lg:gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
			<section className="flex flex-col overflow-hidden gap-6 md:col-span-2 xl:col-span-2">
				{tableData.expenses && tableData.expenses.length > 0 && <SimpleTable expenses={tableData.expenses} />}
				{(!tableData.expenses || tableData.expenses.length <= 0) && (
					<section className="p-3 mt-2">
						<Card className="mb-1 w-full">
							<CardBody>
								<Typography color="blue-gray" variant="h5" className="mb-3">{`Period expenses`}</Typography>
								<div className="mb-4 text-blue-700">
									<FontAwesomeIcon icon={faFileInvoiceDollar} size="3x" />
								</div>
								<Typography color="blue-gray" variant="paragraph" className="mb-3">{`You still haven't add any new expenses. Try adding a new one to start taking control of your finances`}</Typography>
								<Button aria-haspopup={true} variant="filled" className="filled hover:-translate-y-1" onClick={handleExpenseOpen}>{`Add expense`}</Button>
								{expenseDialogOpen && <AddExpensesDialog isPending={false} isOpen={expenseDialogOpen} handleOpen={handleExpenseOpen} />}
							</CardBody>
						</Card>
					</section>
				)}
			</section>
			<section className="flex flex-col overflow-hidden gap-6 md:col-span-1 xl:col-span-1 p-3 mt-0 lg:mt-2">
				{Boolean((tableData.expenses && tableData.expenses.length > 0) || (tableData.pending && tableData.pending.length > 0)) && (
					<div className="w-full">
						{tableData.totals && <TotalsTables data={tableData.totals} />}
					</div>
				)}
				{tableData.pending && tableData.pending.length > 0 && <PendingExpensesTable pendingArray={tableData.pending} />}
				{(!tableData.pending || tableData.pending.length <= 0) && (
					<Card className="border border-blue-gray-100 shadow-sm mb-1 w-full">
						<CardBody>
							<Typography color="blue-gray" variant="lead" className="mb-3">{`Pending expenses`}</Typography>
							<div className="mb-4 text-blue-700">
								<FontAwesomeIcon icon={faClockRotateLeft} size="3x" />
							</div>
							<Button aria-haspopup={true} className="filled hover:-translate-y-1" variant="filled" onClick={handlePendingOpen}>{`Add pending expense`}</Button>
							{pendingDialogOpen && <AddExpensesDialog isPending={true} isOpen={pendingDialogOpen} handleOpen={handlePendingOpen} />}
						</CardBody>
					</Card>
				)}
			</section>

		</section>

	</>);
}
