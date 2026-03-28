'use client';
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";
import { AccountDataContextProvider } from "./account-recurrent-context";
import { SimpleExpensesContextProvider } from "./simple-expenses-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


export default function Providers({ children }: React.PropsWithChildren) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<SimpleExpensesContextProvider>
					<AccountDataContextProvider>
						<SessionProvider>{children}</SessionProvider>
						<ReactQueryDevtools initialIsOpen={false} />
					</AccountDataContextProvider>
				</SimpleExpensesContextProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);

}
