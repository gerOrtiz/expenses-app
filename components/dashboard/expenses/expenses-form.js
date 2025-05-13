'use client';
import SimpleExpensesContext from "@/components/providers/simple-expenses-context";
import { updateExpenses, addPendingExpense } from "@/lib/user/simple-expenses";
import { Button, Card, Dialog, Input, Typography, Select, Option, Checkbox } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";


function filterPendingByType(typeSelected, pendingArray) {
  const newArray = pendingArray.filter((pendingExpense) => pendingExpense.type == typeSelected);
  return newArray;
}

export default function ExpensesForm({ isPending, tableId, currentExpenses, callback, updateTableHandler, setParentOpen }) {
  const message = isPending ? 'Ingresa un gasto pendiente por pagar' : 'Ingresa un gasto para agregarlo a la tabla';
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState('cash');
  const [open, setOpen] = useState(true);
  const [pendingArray, setPendingArray] = useState([]);
  const [filteredPending, setFilteredArray] = useState([]);
  const [isPendingPayment, setIsPendingPayment] = useState(false);
  const [pending_id, setPendingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tableCtx = useContext(SimpleExpensesContext);
  const handleOpen = () => {
    setOpen((cur) => !cur);
    if (setParentOpen) setParentOpen(false);
  };
  const handlePendingFlag = () => setIsPendingPayment((val) => !val);

  async function submitHandler(event) {
    event.preventDefault();
    setIsSubmitting(true);
    let newData;
    let expenseObj = {
      description, amount, type
    };
    expenseObj.amount = parseFloat(expenseObj.amount);
    currentExpenses.push(expenseObj);

    if (isPending) {
      currentExpenses[currentExpenses.length - 1].id = currentExpenses.length + 1;
      newData = await addPendingExpense(tableId, currentExpenses);
    } else {
      //add simple expense to bd 
      currentExpenses[currentExpenses.length - 1].date = new Date().getTime();
      if (isPendingPayment && pending_id) {
        currentExpenses[currentExpenses.length - 1].isPending = true;
        currentExpenses[currentExpenses.length - 1].pending_id = pending_id;
      }
      newData = await updateExpenses(tableId, currentExpenses);
    }
    setOpen(false);
    setPendingId('');
    setIsPendingPayment(false);
    if (newData && callback) callback(newData);
    if (newData && updateTableHandler) updateTableHandler(newData.expenses);
    if (setParentOpen) setParentOpen(false);
  }

  function selectType(val) {
    const pendingyByType = filterPendingByType(val, pendingArray);
    setFilteredArray(pendingyByType);
    setPendingId(val);
  }

  useEffect(() => {
    const expensesTable = tableCtx.getCurrentExpenses();
    setPendingArray(expensesTable.pending);
    const pendingyByType = filterPendingByType(type, expensesTable.pending);
    setFilteredArray(pendingyByType);
  }, [isPending, tableCtx, type])

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
              step={0.01}
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
            {!isPending && <Checkbox label="¿Es gasto previsto?" defaultChecked={isPendingPayment} onChange={handlePendingFlag} />}
            {isPendingPayment &&
              <Select label="Gasto previsto" value={pending_id} onChange={(val) => setPendingId(val)}>
                {filteredPending.map(pending => (
                  <Option key={pending.id} value={pending.id + ''}>
                    <span>{pending.description}: </span><span>${pending.amount.toFixed(2)} </span><span>({pending.type == 'cash' ? 'Efectivo' : 'Tarjeta'})</span>
                  </Option>
                ))}
              </Select>}
          </div>
          <Button className="mt-6" fullWidth type="submit" disabled={(!type && !amount && !description) || isSubmitting} loading={isSubmitting}>
            Agregar
          </Button>
        </form>
      </Card>
    </Dialog>
  </>);
}