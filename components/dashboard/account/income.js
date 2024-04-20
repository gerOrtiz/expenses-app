'use client';

import { updateIncomeList } from "@/lib/user/bank-account";
import { faCheck, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, CardHeader, IconButton, Input, Spinner, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

async function updateAccountIncomes(list, account) {
  const response = await updateIncomeList(list, account);
  console.log(response);
  return response;
}

function IncomeTable({ incomeList, setListHandler }) {
  const table_head = ['Tipo', 'Fecha', 'Monto', ''];
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteIncome = (index) => {
    const newIncomeArray = [...incomeList];
    newIncomeArray.splice(index);
    setListHandler(newIncomeArray);
  };

  return (
    <table className="w-full min-w-max table-auto text-left" >
      <thead>
        <tr>
          {table_head.map((head) => (
            <th
              key={head}
              className="border-b p-3 border-lime-500 bg-lime-300"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                {head}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {incomeList.map(({ name, amount, date }, index) => {
          const isLast = index === incomeList.length - 1;
          const classes = isLast ? "p-1" : " border-b p-1 border-blue-gray-50";
          return (
            <tr key={index}>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {name}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {new Date(date).toLocaleDateString()}

                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  ${amount}
                </Typography>
              </td>
              <td className={classes}>
                {!isDeleting && <IconButton variant="text" onClick={() => deleteIncome(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>}
                {isDeleting && <Spinner className="h-6 w-6" />}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function IncomeView({ incomeData, accountData, dataHandler }) {
  const [incomeList, setIncomeList] = useState(incomeData);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [descriptionRef, setDescriptionRef] = useState('');
  const [amountRef, setAmountRef] = useState(0);
  const [isUpdatingList, setIsUpdatingList] = useState(false);

  useEffect(() => {
    if (incomeData && incomeData.length > 0) {
      let total = 0;
      incomeData.forEach(income => {
        total += income.amount;
      });
      setIncomeTotal(total);
    }
  }, [incomeData]);

  const cancelEdition = () => {
    setDescriptionRef('');
    setAmountRef(0);
    setShowIncomeForm(false);
    setIsUpdatingList(false);
  };

  const editIncome = async () => {
    setIsUpdatingList(true);
    const newIncomeObj = { name: descriptionRef, amount: parseFloat(amountRef), date: new Date().getTime() };
    let newIncomeArray = [...incomeList];
    newIncomeArray.push(newIncomeObj);
    const res = await updateAccountIncomes(newIncomeArray, accountData);
    setIncomeList(newIncomeArray);
    cancelEdition();
  };


  return (<>
    <section className="flex mb-4">
      <Card className="relative w-full">
        <CardHeader className="m-0 text-right " color="lime">
          <Typography variant="h5">Ingresos</Typography>
        </CardHeader>
        <CardBody className="grid grid-cols-3">
          <div className="flex flex-col mt-3 items-center col-span-2 gap-3">
            <Typography variant="h4">Total ${incomeTotal}</Typography>
            {!showIncomeForm && <Button variant="outlined" className="flex" onClick={() => setShowIncomeForm(true)}>
              Nuevo ingreso
            </Button>}
            {showIncomeForm &&
              <div className="flex flex-row gap-2">
                <Input label="Descripción" type="text" value={descriptionRef} onChange={(ev) => setDescriptionRef(ev.target.value)} />
                <Input label="Monto" type="number" min={1} step={0.01} value={amountRef} onChange={(ev) => setAmountRef(ev.target.value)} />
                {!isUpdatingList && <> <IconButton variant="text" color="green" disabled={!descriptionRef || amountRef <= 0} onClick={editIncome}>
                  <FontAwesomeIcon icon={faCheck} />
                </IconButton>
                  <IconButton variant="text" color="red" onClick={cancelEdition}>
                    <FontAwesomeIcon icon={faTimes} />
                  </IconButton>
                </>}
                {isUpdatingList && <Spinner className="h-4 w-4" />}
              </div>
            }
          </div>
          <div className="gap-3">
            <IncomeTable incomeList={incomeList} setListHandler={setIncomeList} />
          </div>
        </CardBody>
      </Card>
    </section>
  </>);
}