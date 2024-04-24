'use client';

import AccountDataContext from "@/components/providers/account-recurrent-context";
import { setNewAccount } from "@/lib/user/account-movements";
import { Button, Card, CardBody, CardFooter, Input } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import Joyride from "react-joyride";
import AccountHeader from "./header";
import AccountWrapper from "./viewWrapper";


export default function AccountLayout({ data }) {
  const accountRecurrentCtx = useContext(AccountDataContext);
  const [account, setAccount] = useState(data.accountMovements);
  const [initialAmount, setInitialAmount] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: '#init-card',
      content: 'Ingresa un saldo inicial de tu cuenta aquí',
      disableBeacon: true,
      title: 'Aún no cuentas con datos para comenzar'
    },
    {
      target: '#add-categories',
      content: 'No olvides ingresar también categorías para llevar mejor control en futuros reportes',
      disableBeacon: true
    },
    {
      target: '#close-period',
      content: 'Cierra el período aquí una vez que se haya concluido',
      disableBeacon: true
    }
  ];

  useEffect(() => {
    if (data.recurrentData) accountRecurrentCtx.updateAccountData(data.recurrentData);
    if (!data.recurrentData && !data.accountMovements) setRun(true);
  }, [data, accountRecurrentCtx]);

  async function initilizeAccount() {
    if (isNaN(initialAmount)) return;
    setIsPosting(true);
    let newAccountData = await setNewAccount(parseFloat(initialAmount));
    setAccount(newAccountData);
  }

  return (<>
    {!data.recurrentData && !data.accountMovements &&
      <Joyride steps={steps} run={run} continuous showProgress showSkipButton locale={{ back: 'Atrás', close: 'Cerrar', last: 'Cerrar', next: 'Siguiente' }} />}
    <AccountHeader />
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">

        {account && <section> <AccountWrapper accountMovements={account} /></section>}
        {!account &&
          <section className="flex items-center justify-center">
            <Card id="init-card" className="w-96">
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