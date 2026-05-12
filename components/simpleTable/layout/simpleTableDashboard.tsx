'use client';
import {
	Button,
	Card,
	CardBody
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
import { Text } from "@/components/ui/Text";




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
		<div className="grid grid-flow-row gap-y-5 lg:gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 p-4 lg:p-0">
			<section className="flex flex-col overflow-hidden gap-6 md:col-span-2 xl:col-span-2">
				{tableData.expenses && tableData.expenses.length > 0 && <SimpleTable expenses={tableData.expenses} />}
				{(!tableData.expenses || tableData.expenses.length <= 0) && (
					<div className="p-3 mt-2">
						<Card className="mb-1 w-full border border-blue-gray-100 shadow-sm">
							<CardBody className="w-full flex flex-col items-center justify-center gap-5">
								<Text variant="h3" >{`Period expenses`}</Text>
								<div className="w-full">
									<div className=" flex items-center justify-center justify-self-center w-20 h-20 text-blue-700 border-2 border-blue-700 rounded-full shadow-md ">
										<FontAwesomeIcon icon={faFileInvoiceDollar} size="3x" />
									</div>
								</div>
								<Text variant="body">{`You still haven't add any new expenses. Try adding a new one to start taking control of your finances`}</Text>
								<Button aria-haspopup={true} variant="outlined" className="outlined transition ease-in-out hover:-translate-y-1 duration-200"
									onClick={handleExpenseOpen}>
									{`Add expense`}
								</Button>
								{expenseDialogOpen && <AddExpensesDialog isPending={false} isOpen={expenseDialogOpen} handleOpen={handleExpenseOpen} />}
							</CardBody>
						</Card>
					</div>
				)}
			</section>
			<div className="flex flex-col overflow-hidden gap-6 md:col-span-1 xl:col-span-1 p-0 lg:p-3 mt-0 lg:mt-2">
				{Boolean((tableData.expenses && tableData.expenses.length > 0) || (tableData.pending && tableData.pending.length > 0)) && (
					<div className="w-full">
						{tableData.totals && <TotalsTables data={tableData.totals} />}
					</div>
				)}
				{tableData.pending && tableData.pending.length > 0 && <PendingExpensesTable pendingArray={tableData.pending} />}
				{(!tableData.pending || tableData.pending.length <= 0) && (
					<section>
						<Card className="border border-blue-gray-100 shadow-sm mb-1 w-full">
							<CardBody className="w-full flex flex-col items-center justify-center gap-5">
								{/* <Typography color="blue-gray" variant="lead" className="mb-3">{`Pending expenses`}</Typography> */}
								<Text variant="h3">{`Pending expenses`}</Text>
								<div className="w-full">
									<div className=" flex items-center justify-center justify-self-center w-20 h-20 text-blue-700 border-2 border-blue-700 rounded-full shadow-md ">
										<FontAwesomeIcon icon={faClockRotateLeft} size="3x" />
									</div>
								</div>
								<Text variant="body">{`Add expected payments. You can then have expenses budget`}</Text>
								<Button aria-haspopup={true} variant="outlined"
									className="outlined transition ease-in-out hover:-translate-y-1 duration-200" onClick={handlePendingOpen}>
									{`Add pending expense`}
								</Button>
								{pendingDialogOpen && <AddExpensesDialog isPending={true} isOpen={pendingDialogOpen} handleOpen={handlePendingOpen} />}
							</CardBody>
						</Card>
					</section>

				)}
			</div>

		</div>

	</>);
}
