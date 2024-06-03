'use client';
import classes from './tables.module.css'
import { faCheck, faPencil, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardBody, CardFooter, Checkbox, IconButton, Input, Option, Select, Typography } from '@material-tailwind/react';
import { useState } from 'react';
import ExpensesForm from '../expenses/expenses-form';
import DeleteDialog from '../expenses/delete-dialog';
import { updateExpenses } from '@/lib/user/simple-expenses';

const TABLE_HEAD = ["Descripción", "Monto", "Método pago", "Fecha", "Gasto previsto", "Acciones"];

function typeFilter(type) {
  return type == 'cash' ? 'Efectivo' : 'Tarjeta';
}

function dateFilter(date) {
  return new Date(date).toLocaleDateString();
}

export default function SimpleTable({ expenses, tableId, dataCallback }) {
  const [expensesList, setExpensesList] = useState(expenses);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [indexBeingEdited, setIndexBeingEdited] = useState(-1);

  const [descriptionRef, setDescriptionRef] = useState('');
  const [amountRef, setAmountRef] = useState(0);
  const [typeRef, setTypeRef] = useState('');
  const [isPendingRef, setIsPendingPayment] = useState(false);
  const handlePendingFlag = () => setIsPendingPayment((val) => !val);

  const [isOpen, setOpen] = useState();


  const handleOpen = () => setOpen((cur) => !cur);

  function editRow(index, expense) {
    setIsEditing(true);
    setIndexBeingEdited(index);
    setDescriptionRef(expense.description);
    setAmountRef(expense.amount);
    setTypeRef(expense.type);
    setIsPendingPayment(expense.isPending);
  }

  async function saveChanges(index) {
    let newExpensesList = expensesList;
    const editedRow = {
      description: descriptionRef,
      amount: parseFloat(amountRef), type: typeRef, isPending: isPendingRef, date: newExpensesList[index].date
    };
    newExpensesList[index] = editedRow;
    console.log(newExpensesList[index]);
    setExpensesList(newExpensesList);
    setIndexBeingEdited(-1);
    setIsEditing(false);
    const newData = await updateExpenses(tableId, newExpensesList);
    dataCallback(newData);
  }

  function deleteExpense(index) {
    setIndexBeingEdited(index);
    setIsDeleting(true);
  }

  function cancelChanges() {
    setIndexBeingEdited(-1);
    setIsEditing(false);
    setIsDeleting(false);
  }

  return (<>
    <Card className="mb-1 w-full overflow-x-hidden overflow-y-auto">
      <CardBody>
        <Typography variant="lead">Gastos del período</Typography>
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map(title => (
                <th key={title} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="black"
                    className="font-normal leading-none opacity-70"
                  >
                    {title}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expensesList.map((expense, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                <td className="p-4">
                  {indexBeingEdited != index && <Typography variant="small" color="black" className="font-normal">
                    {expense.description}
                  </Typography>}
                  {isEditing && indexBeingEdited == index &&
                    <input label="Descripción"
                      className={`max-w-24 font-sans ${classes.control}`}
                      type="text"
                      value={descriptionRef}
                      onChange={event => setDescriptionRef(event.target.value)}
                    />}
                </td>
                <td className="p-4">
                  {indexBeingEdited != index && <Typography variant="small" color="black" className="font-normal">
                    {'$' + expense.amount}
                  </Typography>}
                  {isEditing && indexBeingEdited == index &&
                    <input label="Monto"
                      className={`max-w-20 font-sans ${classes.control}`}
                      type="number"
                      min={1}
                      step={0.01}
                      value={amountRef}
                      onChange={event => setAmountRef(event.target.value)}
                    />}
                </td>
                <td className="p-4">
                  {indexBeingEdited != index && <Typography variant="small" color="black" className="font-normal">
                    {typeFilter(expense.type)}
                  </Typography>}
                  {isEditing && indexBeingEdited == index &&
                    <select
                      label="Método de pago"
                      className={`font-sans ${classes.control}`}
                      defaultValue={expense.type}
                      onChange={(event) => setTypeRef(event.target.value)}>
                      <option value="cash" >Efectivo</option>
                      <option value="card" >Tarjeta</option>
                    </select>
                  }
                </td>
                <td className="p-4">
                  <Typography variant="small" color="black" className="font-normal">
                    {dateFilter(expense.date)}
                  </Typography>
                </td>
                <td className="p-4">
                  <div className="ml-3">
                    <Checkbox disabled={indexBeingEdited != index} defaultChecked={expense.isPending} onChange={handlePendingFlag} />
                  </div>
                </td>
                <td className="p-4">
                  <div className="grid-cols-2 ">
                    {indexBeingEdited != index && <>
                      <IconButton variant="text" size="sm" className="rounded-full mr-1" onClick={() => editRow(index, expense)}>
                        <FontAwesomeIcon icon={faPencil} />
                      </IconButton>
                      <IconButton variant="text" size="sm" className="rounded-full" onClick={() => deleteExpense(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </>}
                    {isEditing && indexBeingEdited == index && <>
                      <IconButton variant="text" size="sm" className="rounded-full mr-1" onClick={() => saveChanges(index)}>
                        <FontAwesomeIcon icon={faCheck} />
                      </IconButton>
                      <IconButton variant="text" size="sm" className="rounded-full" onClick={cancelChanges}>
                        <FontAwesomeIcon icon={faX} />
                      </IconButton>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter>
        <Button onClick={handleOpen}>Agregar gasto</Button>
        {isOpen && <ExpensesForm isPending={false} tableId={tableId} currentExpenses={expenses} callback={dataCallback} updateTableHandler={setExpensesList} setParentOpen={setOpen} />}
      </CardFooter>
    </Card>
    {isDeleting && <DeleteDialog
      dataCallback={dataCallback} expensesList={expensesList} isPendingPayment={false} index={indexBeingEdited}
      undoChanges={cancelChanges}
    />}
  </>);
}