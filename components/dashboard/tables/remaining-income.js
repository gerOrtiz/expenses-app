import {
  Card,
  CardBody,
  Typography
} from "@material-tailwind/react";

export default function RemainingIncome({ remaining, totals }) {

  const totalPending = totals.pending_remain.cash + totals.pending_remain.card;
  const positiveBalance = (remaining.cash + remaining.card) - totalPending;

  return (<>

    <Card className="border border-blue-gray-100 shadow-sm">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Saldo restante
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Typography variant="h6" color="blue-gray" className="mb-2 text-right">
              Efectivo:
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mb-2 text-left">
              ${remaining.cash}
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Typography variant="h6" color="blue-gray" className="mb-2 text-right">
              Tarjeta:
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mb-2 text-left">
              ${remaining.card}
            </Typography>
          </div>
        </div>
        <Typography variant="lead" color="blue-gray" className="mb-2">
          Saldo total
        </Typography>
        <Typography variant="lead" color="blue-gray" className="mb-2">
          ${remaining.cash + remaining.card}
        </Typography>
        <Typography variant="lead" color="blue-gray" className="mb-2">
          Saldo despues de previstos
        </Typography>
        <Typography variant="lead" color="blue-gray" className="mb-2">
          ${positiveBalance}
        </Typography>
      </CardBody>
    </Card>
  </>);
}