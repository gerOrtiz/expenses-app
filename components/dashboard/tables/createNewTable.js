'use client';
import { Button, Typography, Dialog, Card, CardBody, CardFooter, Input } from "@material-tailwind/react";
import { useState } from "react";


export default function TableView({ submitHandler }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [cashRef, setCashRef] = useState(0);
  const [cardRef, setCardRef] = useState(0);
  const handleOpen = () => setOpen((cur) => !cur);

  function createTable(event) {
    event.preventDefault();
    setPending(true);
    const rawFormData = {
      cash: parseInt(cashRef),
      card: parseInt(cardRef)
    }
    return submitHandler(rawFormData);
  }

  return (<>
    <Typography variant="h1">Aún no cuentas con una tabla de gastos activa.</Typography>
    <Button variant="gradient" color="blue" onClick={handleOpen}>Crear una nueva tabla</Button>
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={createTable}>
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Nueva tabla de gastos
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Ingresa cantidades iniciales para comenzar
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