import {
  Card,
  CardBody,
  Typography
} from "@material-tailwind/react";

export default function RemainingIncome({ income }) {
  return (<>
    <section className="relative flex flex-col">
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Saldo restante
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <Typography variant="h6" color="blue-gray" className="mb-2 text-right">
              Efectivo:
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mb-2 text-left">
              ${income.cash}
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Typography variant="h6" color="blue-gray" className="mb-2 text-right">
              Tarjeta:
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mb-2 text-left">
              ${income.card}
            </Typography>
          </div>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Saldo total
          </Typography>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            ${income.cash + income.card}
          </Typography>
        </CardBody>
      </Card>
    </section>
  </>);
}