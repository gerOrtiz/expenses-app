'use client';
import { Button, Card, CardBody, CardFooter, Checkbox, Typography } from '@material-tailwind/react';
import { useState } from 'react';
import ExpensesForm from '../expenses/expenses-form';

const TABLE_HEAD = ["Descripción", "Monto", "Método pago", "Fecha", "Gasto previsto"];

function typeFilter(type) {
  return type == 'cash' ? 'Efectivo' : 'Tarjeta';
}

function dateFilter(date) {
  return new Date(date).toLocaleDateString();
}

export default function SimpleTable({ expenses, tableId, dataCallback }) {
  const [isOpen, setOpen] = useState();
  const handleOpen = () => setOpen((cur) => !cur);

  return (<>
    <Card className="mb-1 w-full overflow-x-hidden overflow-y-auto">
      <CardBody>
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
            {expenses.map((expense, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {expense.description}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {'$' + expense.amount}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {typeFilter(expense.type)}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {dateFilter(expense.date)}
                  </Typography>
                </td>
                <td className="p-4">
                  <div className="ml-3">
                    <Checkbox disabled={true} defaultChecked={expense.isPending} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter>
        <Button onClick={handleOpen}>Agregar gasto</Button>
        {isOpen && <ExpensesForm isPending={false} tableId={tableId} currentExpenses={expenses} callback={dataCallback} />}
      </CardFooter>
    </Card>

  </>);
}