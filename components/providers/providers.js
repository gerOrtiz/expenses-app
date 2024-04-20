'use client';
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";
import { AccountDataContextProvider } from "./account-recurrent-context";
import { SimpleExpensesContextProvider } from "./simple-expenses-context";


export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <SimpleExpensesContextProvider>
        <AccountDataContextProvider>
          <SessionProvider>{children}</SessionProvider>
        </AccountDataContextProvider>
      </SimpleExpensesContextProvider>
    </ThemeProvider>
  );

}