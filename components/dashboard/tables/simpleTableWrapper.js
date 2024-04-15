'use client';
import SimpleExpensesContext from "@/components/providers/simple-expenses-context";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  Typography
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import ExpensesForm from "../expenses/expenses-form";
import PendingExpenses from "./pending-expenses";
import RemainingIncome from "./remaining-income";
import SimpleTable from "./simple-table";
import TotalsTables from "./totals-table";

export default function TableWrapper(props) {
  const { data } = props;
  //const { remaining } = data;
  const [pendingDialogOpen, setPendingDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDilogOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const tableCtx = useContext(SimpleExpensesContext);
  const handlePendingOpen = () => setPendingDialogOpen((cur) => !cur);
  const handleExpenseOpen = () => setExpenseDilogOpen((cur) => !cur);

  useEffect(() => {
    tableCtx.updateExpensesTable(tableData);
    console.log(tableData.remaining);
  }, [tableData]);

  return (<>
    <section className="grid grid-flow-row mb-4 gap-x-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {(tableData.pending.length > 0 || tableData.expenses.length > 0) && <TotalsTables data={tableData.totals} />}
      <RemainingIncome remaining={tableData.remaining} totals={tableData.totals} tableId={tableData.id} added={tableData.added} dataCallback={setTableData} />
    </section>
    <section className="grid grid-flow-row gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
      <section className="flex flex-col overflow-hidden gap-6 md:col-span-2 xl:col-span-2">
        {tableData.expenses && tableData.expenses.length > 0 && <SimpleTable expenses={tableData.expenses} tableId={tableData.id} dataCallback={setTableData} />}
        {(!tableData.expenses || tableData.expenses.length <= 0) && (
          <section>
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-2">Aún no hay gastos agregados</Typography>
                <Button onClick={handleExpenseOpen}>Agregar gasto</Button>
                {expenseDialogOpen && <ExpensesForm isPending={false} tableId={tableData.id} currentExpenses={[]} callback={setTableData} />}
              </CardBody>
            </Card>
          </section>
        )}
      </section>
      <section className="flex-col overflow-hidden gap-6 md:col-span-1 xl:col-span-1">
        {tableData.pending && tableData.pending.length > 0 && <PendingExpenses tableId={tableData.id} pending={tableData.pending} dataCallback={setTableData} />}
        {(!tableData.pending || tableData.pending.length <= 0) && (
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-2">Aún no hay gastos pendientes</Typography>
              <Button onClick={handlePendingOpen}>Agregar gasto pendiente</Button>
              {pendingDialogOpen && <ExpensesForm isPending={true} tableId={tableData.id} currentExpenses={[]} callback={setTableData} />}
            </CardBody>
          </Card>
        )}
      </section>

    </section>

  </>);
}