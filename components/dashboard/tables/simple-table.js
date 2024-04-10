'use client';
import { Card, Typography } from '@material-tailwind/react';

const TABLE_HEAD = ["Descripción", "Monto", "Método pago", "Pendiente"];

export default function SimpleTable() {
  const table_rows = [];
  return (<>
    <Card className="h-full w-full overflow-scroll">
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
          {table_rows.map((expense, index) => (
            <tr key={expense} className="even:bg-blue-gray-50/50">
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
                  {expense.type}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  Is pending
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>

  </>);
}