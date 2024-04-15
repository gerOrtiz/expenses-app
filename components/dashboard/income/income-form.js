'use client';

import { addNewIncome } from "@/lib/user/simple-expenses";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Dialog,
  Input
} from "@material-tailwind/react";
import { useState } from "react";

export default function IncomeForm({ tableId, dataCallback }) {
  const [cashRef, setCashRef] = useState(0);
  const [cardRef, setCardRef] = useState(0);
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen((cur) => !cur);

  async function submitHandler(event) {
    event.preventDefault();
    setPending(true);
    const newIncome = {
      cash: parseFloat(cashRef),
      card: parseFloat(cardRef)
    };

    const newData = await addNewIncome(tableId, newIncome);
    setPending(false);
    setOpen(false);
    if (newData && dataCallback) dataCallback(newData);
  }

  return (<>
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={submitHandler} >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Nuevo ingreso
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Efectivo
            </Typography>
            <Input
              label="Cantidad"
              id="cash" name="cash"
              type="number"
              min={0}
              value={cashRef}
              onChange={event => setCashRef(event.target.value)}
              size="lg" />
            <Typography className="-mb-2" variant="h6">
              Tarjeta
            </Typography>
            <Input
              label="Cantidad"
              id="card"
              name="card"
              type="number"
              min={0}
              value={cardRef}
              onChange={event => setCardRef(event.target.value)}
              size="lg" />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" loading={pending} type="submit">
              Aceptar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  </>);
}