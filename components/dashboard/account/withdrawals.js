'use client';

import { updateWithdrawals } from "@/lib/user/account-movements";
import { faInfoCircle, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardFooter, CardHeader, IconButton, Input, Spinner, Tooltip, Typography } from "@material-tailwind/react";
import { useState } from "react";

export default function WithdrawalsView({ accountData, dataHandler }) {
  const table_head = ['Monto', 'Fecha', ''];
  const [withdrawals, setWithdrawals] = useState(accountData.withdrawals || []);
  const [totalWithdrawals, setTotalWithdrawals] = useState(accountData.total_withdrawals || 0);
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const addWithdrawal = async (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);
    const withdrawalObj = {
      amount: parseFloat(amount),
      date: new Date().getTime()
    };
    let newWithdrawalArray = [...withdrawals];
    newWithdrawalArray.push(withdrawalObj);
    const response = await updateWithdrawals(newWithdrawalArray, accountData);
    if (dataHandler && response) dataHandler(response);
    if (response.total_withdrawals) setTotalWithdrawals(response.total_withdrawals);
    setWithdrawals(newWithdrawalArray);
    setAmount(0);
    setIsSubmitting(false);
  };
  const deleteWithdrawal = async (index) => {
    setIsDeleting(true);
    let newWithdrawalArray = [...withdrawals];
    newWithdrawalArray.splice(index, 1);
    const response = await updateWithdrawals(newWithdrawalArray, accountData);
    if (dataHandler && response) dataHandler(response);
    setWithdrawals(newWithdrawalArray);
    setIsDeleting(false);
  };

  return (
    <section className="flex mb-4">
      <Card className="relative w-full">
        <CardHeader className="m-0 text-right" color="orange">
          <Typography variant="h6" className="mr-2">
            Retiros
            <Tooltip content="Retiros de efectivo. Se descuentan del saldo.">
              <FontAwesomeIcon className="ml-2 cursor-pointer" icon={faInfoCircle} />
            </Tooltip>
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col">
          <div className="flex-col mb-4">
            <form className="flex flex-row gap-4 justify-center" onSubmit={addWithdrawal}>
              <Input type="number" label="Monto" min={0.1} step={0.1} containerProps={{ className: "min-w-[24px] max-w-[100px] flex" }}
                value={amount} onChange={(ev) => setAmount(ev.target.value)} />
              {!isSubmitting && <IconButton variant="outlined" type="submit" disabled={amount <= 0} >
                <FontAwesomeIcon icon={faPlus} />
              </IconButton>}
              {isSubmitting && <Spinner className="text-center items-center h-6 w-6" />}
            </form>
          </div>
          <div className="gap-3">
            <table className="w-full min-w-max table-auto text-center" >
              <thead>
                <tr>
                  {table_head.map((head) => (
                    <th key={head} className="border-b p-2 border-orange-600 bg-orange-200">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal, index) => (
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className="border-b p-2 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        ${withdrawal.amount}
                      </Typography>
                    </td>
                    <td className="border-b p-2 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(withdrawal.date).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="border-b p-2 border-blue-gray-50">
                      <IconButton variant="text" onClick={() => deleteWithdrawal(index)} disabled={isSubmitting || isDeleting}>
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
            Total de retiros: ${totalWithdrawals}
          </Typography>
        </CardFooter>
      </Card>
    </section>
  );
}