import { ExpensesTableI } from "@/interfaces/expenses";
import { ExpensesContextValuesI } from "@/interfaces/expensesContext";
import { createContext, useState } from "react";


const SimpleExpensesContext = createContext<ExpensesContextValuesI>({
	expensesTable: null, //whole expenses object
	updateExpensesTable: (expensesData) => { },
	getCurrentExpenses: () => null
});


export function SimpleExpensesContextProvider(props: any) {
	const [currentExpenses, setCurrentExpenses] = useState<ExpensesTableI | null>(null);

	function updateExpensesTable(expensesData: ExpensesTableI) {
		setCurrentExpenses(expensesData);
	}

	function getCurrentExpenses(): ExpensesTableI | null {
		return currentExpenses;
	}

	const context = {
		expensesTable: currentExpenses,
		updateExpensesTable: updateExpensesTable,
		getCurrentExpenses
	};

	return (
		<SimpleExpensesContext.Provider value={context}>
			{props.children}
		</SimpleExpensesContext.Provider>
	);
}

export default SimpleExpensesContext;
