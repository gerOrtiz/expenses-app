'use client';

import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

export default function BalanceView({ accountData }) {
  const [totalExpenses, setTotalExpenses] = useState(accountData ? accountData.total_expenses : null);
  const [remainingIncome, setRemainingIncome] = useState(accountData.remaining);

  useEffect(() => {
    if (accountData.remaining != remainingIncome) setRemainingIncome(accountData.remaining);
    if (accountData.total_expenses && accountData.total_expenses != totalExpenses) setTotalExpenses(accountData.total_expenses);
  }, [accountData, totalExpenses, remainingIncome])

  return (<>
    <div className="grid grid-cols-2 gap-10 flex m-4 p-4">
      <div className="flex flex-col ">
        <Card color="lime">
          <CardBody>
            <Typography variant="h4" color="blue-gray" className="font-medium">
              Saldo Disponible
            </Typography>
            <Typography variant="h3" color="blue-gray">
              ${remainingIncome}
            </Typography>
          </CardBody>
        </Card>
      </div>
      <div className="flex flex-col ">
        <Card color="orange">
          <CardBody>
            <Typography variant="h4" color="blue-gray" className="font-medium">
              Egresos del periodo
            </Typography>
            <Typography variant="h3" color="blue-gray">
              $ {totalExpenses ? totalExpenses : 0}
            </Typography>
          </CardBody>
        </Card>
      </div>
    </div>
  </>);
}