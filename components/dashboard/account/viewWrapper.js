'use client';
import { getUser } from "@/lib/user/user";
import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import BalanceView from "./balance";
import CummulativeView from "./cumulative";
import ExpensesView from "./expenses";
import IncomeView from "./income";
import SavingPotsView from "./saving-pots";
import WithdrawalsView from "./withdrawals";

export default function AccountWrapper({ accountMovements }) {
  const [account, setAccount] = useState(accountMovements);
  const [showCumulative, setShowCumulative] = useState(false);

  async function retrieveSession() {
    const session = await getUser();
    if (!session) return;
    if (session.user.email == 'gerson.ortiz@t1paginas.com') setShowCumulative(true);
  };

  useEffect(() => {
    retrieveSession();
  }, []);

  return (
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <div className="grid grid-cols-3 grid-flow-col gap-3">
          <section className="flex flex-col col-span-2">
            <BalanceView accountData={account} />
            <IncomeView accountData={account} dataHandler={setAccount} />
            <ExpensesView accountData={account} dataHandler={setAccount} />
          </section>
          <section className="flex flex-col">
            <Typography variant="h6" className="text-right mb-3" >
              Fecha de inicio: {new Date(account.sDate).toLocaleDateString()}
            </Typography>
            <SavingPotsView accountData={account} dataHandler={setAccount} />
            <WithdrawalsView accountData={account} dataHandler={setAccount} />
            {showCumulative && <CummulativeView accountData={account} />}
          </section>
        </div>
      </div>
    </main>
  );
}