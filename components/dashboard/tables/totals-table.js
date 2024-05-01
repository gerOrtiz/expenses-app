'use client';
import {
  Card,
  CardBody,
  Typography
} from "@material-tailwind/react";

function SingleTable({ tableTitle, data }) {
  const headTitles = ['Método de pago', 'Total'];
  return (
    <Card className="mb-1 w-full overflow-hidden">
      <CardBody>
        <section className="relative flex flex-col">
          <Typography variant="h6" color="blue-gray" className="font-normal">{tableTitle}</Typography>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {headTitles.map(title => (
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
              <tr className="even:bg-blue-gray-50/50">
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    Efectivo
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {'$' + data.cash}
                  </Typography>
                </td>
              </tr>
              <tr className="even:bg-blue-gray-50/50">
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    Tarjeta
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {'$' + data.card.toFixed(2)}
                  </Typography>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="p-4">
                  <Typography variant="small" color="black" className="font-normal">
                    Total
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="black" className="font-normal">
                    $ {data.card + data.cash}
                  </Typography>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </CardBody>
    </Card>
  );
}

export default function TotalsTables({ data }) {
  return (
    <section className="relative flex overflow-hidden gap-4 xl:col-span-3 md:col-span-2 sm:col-span-1">
      {data && (<>
        <SingleTable tableTitle="Total gastado" data={data.expenses} />
        <SingleTable tableTitle="Pendientes de pago" data={data.pending_remain} />
        <SingleTable tableTitle="Gastos previstos (pagados)" data={data.pending_paid} />
      </>)
      }
    </section>
  );
}