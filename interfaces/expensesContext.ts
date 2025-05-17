import { ExpensesTableI } from "./expenses";

export interface ExpensesContextValuesI {
	expensesTable: ExpensesTableI | null;
	updateExpensesTable: (data: ExpensesTableI) => void;
	getCurrentExpenses: () => ExpensesTableI | null;
}
