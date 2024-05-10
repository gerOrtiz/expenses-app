'use client';

import { updateSavingPots } from "@/lib/user/account-movements";
import { faInfoCircle, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardFooter, CardHeader, IconButton, Input, Spinner, Tooltip, Typography } from "@material-tailwind/react";
import { useState } from "react";

export default function SavingPotsView({ accountData, dataHandler }) {
  const table_head = ['Nombre', 'Monto', ''];
  const [savingPots, setSavingPots] = useState(accountData.saving_pots || []);
  const [totalSavings, setTotalSavings] = useState(accountData.total_savingPots || 0);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const addSavingPot = async (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);
    const savingsObj = {
      name, amount: parseFloat(amount)
    };
    let newSavingPotsArray = [...savingPots];
    newSavingPotsArray.push(savingsObj);
    const response = await updateSavingPots(newSavingPotsArray, accountData);
    if (dataHandler && response) dataHandler(response);
    if (response.total_savingPots) setTotalSavings(response.total_savingPots);
    setSavingPots(newSavingPotsArray);
    setAmount(0);
    setName('');
    setIsSubmitting(false);
  };
  const deleteSavingPot = async (index) => {
    setIsDeleting(true);
    let newSavingPotsArray = [...savingPots];
    newSavingPotsArray.splice(index, 1);
    const response = await updateSavingPots(newSavingPotsArray, accountData);
    if (dataHandler && response) dataHandler(response);
    setSavingPots(newSavingPotsArray);
    setIsDeleting(false);
  };


  return (<>
    <section className="flex mb-4">
      <Card className="relative w-full">
        <CardHeader className="m-0 text-right" color="amber">
          <Typography variant="h6" className="mr-2">
            Apartados
            <Tooltip content="Apartados de dinero, manten parte de tus ingresos fuera del saldo disponible. Al ingresar un apartado, se descuenta del saldo actual">
              <FontAwesomeIcon className="ml-2 cursor-pointer" icon={faInfoCircle} />
            </Tooltip>
          </Typography>

        </CardHeader>
        <CardBody className="flex flex-col">
          <div className="flex-col mb-4">
            <form className="flex flex-row gap-4 justify-center" onSubmit={addSavingPot}>
              <Input type="text" label="Nombre" containerProps={{ className: "min-w-[24px] max-w-[160px] flex" }}
                value={name} onChange={(ev) => setName(ev.target.value)} />
              <Input type="number" label="Monto" min={0.01} step={0.01} containerProps={{ className: "min-w-[24px] max-w-[100px] flex" }}
                value={amount} onChange={(ev) => setAmount(ev.target.value)} />
              {!isSubmitting && <IconButton variant="outlined" type="submit" disabled={amount <= 0 || !name}>
                <FontAwesomeIcon icon={faPlus} />
              </IconButton>}
              {isSubmitting && <Spinner className="h-6 w-6" />}
            </form>
          </div>
          <div className="gap-3">
            <table className="w-full min-w-max table-auto text-center" >
              <thead>
                <tr>
                  {table_head.map((head) => (
                    <th key={head} className="border-b p-2 border-amber-600 bg-amber-200">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {savingPots.map((pot, index) => (
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className="border-b p-2 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {pot.name}
                      </Typography>
                    </td>
                    <td className="border-b p-2 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        ${pot.amount}
                      </Typography>
                    </td>
                    <td className="border-b p-2 border-blue-gray-50">
                      <IconButton variant="text" onClick={() => deleteSavingPot(index)} disabled={isSubmitting || isDeleting}>
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
        <CardFooter className="p-0 mb-3">
          <Typography variant="paragraph" color="blue-gray" className="font-bold text-center" >
            Total de apartados: ${totalSavings}
          </Typography>
        </CardFooter>
      </Card>
    </section>
  </>);
}