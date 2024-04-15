'use client';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  IconButton,
  Typography,

} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import IncomeForm from "../income/income-form";


export default function RemainingIncome({ remaining, totals, added, tableId, dataCallback }) {
  const totalPending = totals.pending_remain.cash + totals.pending_remain.card;
  const positiveBalance = (remaining.cash + remaining.card) - totalPending;
  const [lastAdded, setLastAdded] = useState('');
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);

  useEffect(() => {
    if (added) {
      const cash = added[added.length - 1].cash > 0 ? `Efectivo: $${added[added.length - 1].cash} ` : '';
      const card = added[added.length - 1].card > 0 ? `Tarjeta: $${added[added.length - 1].card}` : '';
      setLastAdded(cash + card);
    }
  }, [added]);

  return (<>

    <Card className="border border-blue-gray-100 shadow-sm">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Saldo restante
        </Typography>
        <div className="grid grid-cols-2 mb-2 gap-4">
          <div className="grid grid-cols-2  gap-4">
            <Typography variant="paragraph" color="blue-gray" className="mb-2 text-right">
              Efectivo:
            </Typography>
            <Typography variant="h6" color={remaining.cash > 1 ? "green" : "red"} className="mb-2 text-left">
              ${remaining.cash}
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Typography variant="paragraph" color="blue-gray" className="mb-2 text-right">
              Tarjeta:
            </Typography>
            <Typography variant="h6" color={remaining.cash > 1 ? "green" : "red"} className="mb-2 text-left">
              ${remaining.card}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col col-span-2 mb-2 gap-4">
          <div className="grid grid-cols-3 gap-4">
            <Typography variant="paragraph" color="blue-gray" className="col-span-2 mb-2 text-center">
              Saldo total:
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mb-2 text-left">
              ${remaining.cash + remaining.card}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col col-span-2 gap-4">
          <div className="grid grid-cols-3 gap-4">
            <Typography variant="paragraph" color="blue-gray" className="col-span-2 mb-2 text-center">
              Saldo despues de previstos:
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mb-2 text-left">
              ${positiveBalance}
            </Typography>
          </div>
        </div>

        {added && lastAdded &&
          <div className="flex flex-col">

            <Typography variant="small" color="blue-gray" className="col-span-1 mb-2 text-center">
              Último ingreso agregado :
            </Typography>
            <div className="grid grid-cols-2  gap-4">
              <Typography variant="small" color="blue-gray" className="mb-2 col-span-2 text-center">
                {lastAdded}
              </Typography>
            </div>
          </div>
        }
        <div className="flex min-w-[100%] justify-center gap-4">
          <IconButton className="rounded-full xl:hidden" variant="outlined" size="sm" onClick={() => setOpenIncomeDialog((cur) => !cur)} >
            {/* <i className="fa fa-plus" /> */}
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
          <Button variant="outlined" onClick={() => setOpenIncomeDialog((cur) => !cur)}>Agregar ingreso</Button>
        </div>
      </CardBody>
    </Card>
    {openIncomeDialog && <IncomeForm tableId={tableId} dataCallback={dataCallback} />}
  </>);
}