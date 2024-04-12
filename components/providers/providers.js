'use client';
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";
import { SimpleExpensesContextProvider } from "./simple-expenses-context";


export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <SimpleExpensesContextProvider>
        <SessionProvider>{children}</SessionProvider>
      </SimpleExpensesContextProvider>
    </ThemeProvider>
  );

}