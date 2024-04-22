'use client';

import AccountDataContext from "@/components/providers/account-recurrent-context";
import { setNewAccount } from "@/lib/user/account-movements";
import { Button, Card, CardBody, CardFooter, Input } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import AccountHeader from "./header";
import AccountWrapper from "./viewWrapper";

export default function AccountLayout({ data }) {
  const accountRecurrentCtx = useContext(AccountDataContext);
  const [account, setAccount] = useState(data.accountMovements);
  const [initialAmount, setInitialAmount] = useState(0);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (data.recurrentData) accountRecurrentCtx.updateAccountData(data.recurrentData);
  }, [data, accountRecurrentCtx]);

  async function initilizeAccount() {
    if (isNaN(initialAmount)) return;
    setIsPosting(true);
    let newAccountData = await setNewAccount(parseFloat(initialAmount));
    setAccount(newAccountData);
  }

  return (<>
    <AccountHeader />
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">

        {account && <section> <AccountWrapper accountMovements={account} /></section>}
        {!account &&
          <section className="flex items-center justify-center">
            <Card className="w-96">
              <CardBody className="flex flex-col gap-4">
                No cuentas con saldo anterior. Ingresa saldo inicial para poder continuar
                <Input label="Saldo inicial" type="number" step={0.01} value={initialAmount} onChange={(event) => setInitialAmount(event.target.value)} />
              </CardBody>
              <CardFooter>
                <Button color="green" onClick={initilizeAccount} loading={isPosting}>Ingresa saldo</Button>
              </CardFooter>
            </Card>
          </section>
        }

      </div>
    </main>
  </>);
}