import { addPendingExpense } from "@/lib/user/simple-expenses";
import { Button, Card, Dialog, Input, Typography, Select, Option } from "@material-tailwind/react";
import { useState } from "react";


export default function ExpensesForm({ isPending, tableId, currentExpenses, callback }) {
  const message = isPending ? 'Ingresa un gasto pendiente por pagar' : 'Ingresa un gasto para agregarlo a la tabla';
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState('cash');
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen((cur) => !cur);
  async function submitHandler(event) {
    event.preventDefault();
    let expenseObj = {
      description, amount, type
    };
    if (isPending) expenseObj.id = currentExpenses.length + 1;
    expenseObj.amount = parseFloat(expenseObj.amount);
    currentExpenses.push(expenseObj);
    setOpen(false);
    const newData = await addPendingExpense(tableId, currentExpenses);
    if (newData && callback) callback(newData);
  }

  return (<>
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="border border-blue-gray-100 shadow-sm p-3">
        <Typography variant="h4" color="blue-gray">
          Ingresa un gasto
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          {message}
        </Typography>
        <form className="mt-8 mb-2" onSubmit={submitHandler}>
          <div className="mb-1 flex flex-col gap-6">
            <Input
              label="Descripción"
              value={description}
              onChange={event => setDescription(event.target.value)}
            />
            <Input
              label="Monto"
              type="number"
              min={1}
              value={amount}
              onChange={event => setAmount(event.target.value)}
            />
            <Select
              label="Método de pago"
              value={type}
              onChange={(val) => setType(val)}>
              <Option value="cash">Efectivo</Option>
              <Option value="card">Tarjeta</Option>
            </Select>
          </div>
          <Button className="mt-6" fullWidth type="submit" disabled={!type && !amount && !description}>
            Agregar
          </Button>
        </form>
      </Card>
    </Dialog>
  </>);
}