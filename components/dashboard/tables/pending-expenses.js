'use client';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography
} from "@material-tailwind/react";
import { useState } from "react";
import ExpensesForm from "../expenses/expenses-form";

const TABLE_HEAD = ["Descripción", "Monto", "Método pago"];

function typeFilter(type) {
  return type == 'cash' ? 'Efectivo' : 'Tarjeta';
}

export default function PendingExpenses({ pending, tableId, dataCallback }) {
  let [tableRows, setTableRows] = useState(pending);
  //const [tableData, setTableData] = useState(null);
  const [isOpen, setOpen] = useState();
  const handleOpen = () => setOpen((cur) => !cur);


  return (<>
    <Card className="mb-1 w-full overflow-y-auto overflow-x-hidden ">
      <CardBody>
        <section className="relative flex flex-col">
          <Typography variant="lead">Gastos previstos</Typography>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map(title => (
                  <th key={title} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
              {tableRows.map((pending, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {pending.description}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {'$' + pending.amount}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {typeFilter(pending.type)}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </CardBody>
      <CardFooter>
        <Button onClick={handleOpen}>Agregar gasto previsto</Button>
        {isOpen && <ExpensesForm isPending={true} tableId={tableId} currentExpenses={pending} callback={dataCallback} />}
      </CardFooter>
    </Card>
  </>);
}