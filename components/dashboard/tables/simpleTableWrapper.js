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
  const [isOpen, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const tableCtx = useContext(SimpleExpensesContext);
  const handleOpen = () => setOpen((cur) => !cur);

  useEffect(() => {
    tableCtx.updateExpensesTable(tableData);
  }, [tableData]);

  return (<>
    <section className="grid grid-flow-row mb-4 gap-x-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {data.pending && data.pending.length > 0 && <TotalsTables data={tableData.totals} />}
      <RemainingIncome remaining={tableData.remaining} totals={tableData.totals} />
    </section>
    <section className="grid grid-flow-row gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
      <section className="relative flex flex-col overflow-hidden gap-6 md:col-span-2 xl:col-span-2">
        {data.expenses && data.expenses.lenght > 0 && <SimpleTable data={data.expenses} />}
        {(!data.expenses || data.expenses.length <= 0) && (
          <section>
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-2">Aún no hay gastos agregados</Typography>
                <Button>Agregar gasto</Button>
              </CardBody>
            </Card>
          </section>
        )}
      </section>
      {data.pending && data.pending.length > 0 && <PendingExpenses tableId={tableData.id} pending={tableData.pending} dataCallback={setTableData} />}
      {(!data.pending || data.pending.length <= 0) && (
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">Aún no hay gastos pendientes</Typography>
            <Button onClick={handleOpen}>Agregar gasto pendiente</Button>
            {isOpen && <ExpensesForm isPending={true} tableId={data.id} currentExpenses={[]} callback={setTableData} />}
          </CardBody>
        </Card>
      )}
    </section>

  </>);
}