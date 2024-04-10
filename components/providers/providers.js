'use client';
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";


export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );

}