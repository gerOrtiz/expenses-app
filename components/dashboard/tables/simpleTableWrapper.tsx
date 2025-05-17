'use client';
import SimpleExpensesContext from "@/components/providers/simple-expenses-context";
import {
	Button,
	Card,
	CardBody,
	Typography
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import ExpensesForm from "../expenses/expenses-form";
import PendingExpenses from "./pending-expenses";
import RemainingIncome from "./remaining-income";
import SimpleTable from "./simple-table";
import TotalsTables from "./totals-table";
import { ExpensesTableI } from "@/interfaces/expenses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";

interface TableWrapperPropsI {
	data: ExpensesTableI;
}

export default function TableWrapper({ data }: TableWrapperPropsI) {
	// const { data } = props;
	//const { remaining } = data;
	const [pendingDialogOpen, setPendingDialogOpen] = useState(false);
	const [expenseDialogOpen, setExpenseDilogOpen] = useState(false);
	const [tableData, setTableData] = useState<ExpensesTableI>(data);
	const tableCtx = useContext(SimpleExpensesContext);
	const handlePendingOpen = () => setPendingDialogOpen((cur) => !cur);
	const handleExpenseOpen = () => setExpenseDilogOpen((cur) => !cur);

	useEffect(() => {
		tableCtx.updateExpensesTable(tableData);
	}, [tableData, tableCtx]);

	const handleTableDataChange = (data: ExpensesTableI) => {
		setTableData(data);
	};

	return (<>
		<section className="flex flex-col w-full items-center mt-3 p-4 lg:p-1">
			<Typography variant="h3" color="blue-gray" >{`Summary`}</Typography>
			<RemainingIncome remaining={tableData.remaining} totals={tableData.totals} tableId={tableData.id} added={tableData.added} dataCallback={handleTableDataChange} />
			{Boolean((tableData.expenses && tableData.expenses.length > 0) || (tableData.pending && tableData.pending.length > 0)) && (
				<section className="lg:w-[80%] w-full grid grid-flow-row grid-cols-1 lg:grid-cols-3 mb-4 gap-x-6">
					{tableData.totals && <TotalsTables data={tableData.totals} />}
				</section>
			)}
		</section>
		<section className="grid grid-flow-row gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
			<section className="flex flex-col overflow-hidden gap-6 md:col-span-2 xl:col-span-2">
				{tableData.expenses && tableData.expenses.length > 0 && <SimpleTable expenses={tableData.expenses} tableId={tableData.id} dataCallback={setTableData} />}
				{(!tableData.expenses || tableData.expenses.length <= 0) && (
					<section className="p-3 mt-2">
						<Card className="mb-1 w-full">
							<CardBody>
								{/* <Typography variant="h6" color="blue-gray" className="mb-2">Aún no hay gastos agregados</Typography> */}
								<Typography color="blue-gray" variant="lead" className="mb-3">{`Period expenses`}</Typography>
								<div className="mb-4 text-blue-500">
									<FontAwesomeIcon icon={faFileInvoiceDollar} size="3x" />
								</div>
								<Typography color="blue-gray" variant="paragraph" className="mb-3">{`You still haven't add any new expenses. Try adding a new one to start taking control of your finances`}</Typography>
								<Button color="blue" variant="filled" onClick={handleExpenseOpen}>{`Add new expense`}</Button>
								{expenseDialogOpen && <ExpensesForm isPending={false} tableId={tableData.id}
									currentExpenses={[]} updateTableHandler={handleTableDataChange} isOpen={expenseDialogOpen} handleOpen={handleExpenseOpen} />}
							</CardBody>
						</Card>
					</section>
				)}
			</section>
			<section className="flex-col overflow-hidden gap-6 md:col-span-1 xl:col-span-1 p-3 mt-2">
				{tableData.pending && tableData.pending.length > 0 && <PendingExpenses tableId={tableData.id} pending={tableData.pending} dataCallback={setTableData} />}
				{(!tableData.pending || tableData.pending.length <= 0) && (
					<Card className="mb-1 w-full">
						<CardBody>
							<Typography color="blue-gray" variant="lead" className="mb-3">{`Pending expenses`}</Typography>
							<div className="mb-4 text-blue-500">
								<FontAwesomeIcon icon={faClockRotateLeft} size="3x" />
							</div>
							<Button color="blue" variant="filled" onClick={handlePendingOpen}>{`Add pending expense`}</Button>
							{pendingDialogOpen && <ExpensesForm isPending={true} tableId={tableData.id} currentExpenses={[]}
								updateTableHandler={handleTableDataChange}
								isOpen={pendingDialogOpen}
								handleOpen={handlePendingOpen}
							/>}
						</CardBody>
					</Card>
				)}
			</section>

		</section>

	</>);
}
