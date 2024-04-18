'use client';
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";
import { AccountCategoriesCotextProvider } from "./account-categories-context";
import { SimpleExpensesContextProvider } from "./simple-expenses-context";


export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <SimpleExpensesContextProvider>
        <AccountCategoriesCotextProvider>
          <SessionProvider>{children}</SessionProvider>
        </AccountCategoriesCotextProvider>
      </SimpleExpensesContextProvider>
    </ThemeProvider>
  );

}