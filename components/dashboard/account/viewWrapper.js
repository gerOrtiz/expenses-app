'use client';
import { useState } from "react";
import BalanceView from "./balance";
import ExpensesView from "./expenses";
import IncomeView from "./income";
import SavingPotsView from "./saving-pots";

export default function AccountWrapper({ accountMovements }) {
  const [account, setAccount] = useState(accountMovements);

  return (
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <div className="grid grid-cols-3 grid-flow-col">
          <section className="flex flex-col col-span-2">
            <BalanceView accountData={account} />
            <IncomeView accountData={account} dataHandler={setAccount} />
            <ExpensesView />
          </section>
          <section className="flex flex-col">
            <SavingPotsView />
          </section>
        </div>
      </div>
    </main>
  );
}