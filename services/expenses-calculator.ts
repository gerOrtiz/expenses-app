'use server';

import { AddedIncomeI, ExpenseItemI, ExpensesTableI, IncomeI, PendingExpenseI, TotalsI, TotalsType } from "@/interfaces/expenses";
import { Session } from "next-auth";

/**Server functions called from API routes */

/**Table functions */
/**
 * 
 * @param newIncome AddedIncomeI Object to add
 * @param existingTable Current BD version of the Expenses Table
 * @returns An updated version of the table
 */
export async function processAddIncome(newIncome: AddedIncomeI, existingTable: ExpensesTableI): Promise<ExpensesTableI> { //
	const updatedTable: ExpensesTableI = JSON.parse(JSON.stringify(existingTable));
	const addedArray = updatedTable.added || [];
	const totalAdded = { cash: 0, card: 0, withdrawal: 0 };

	addedArray.push(newIncome);
	addedArray.forEach(addIncome => {
		totalAdded.cash += addIncome.cash;
		totalAdded.card += addIncome.card;
		if (addIncome.isWithdrawal) totalAdded.withdrawal += addIncome.cash;
	});
	const totalIncome = {
		cash: updatedTable.income.cash + totalAdded.cash,
		card: (updatedTable.income.card + totalAdded.card) - totalAdded.withdrawal
	};
	const remaining = {
		cash: totalIncome.cash - updatedTable.totals.total_expenses.cash,
		card: totalIncome.card - updatedTable.totals.total_expenses.card
	};
	updatedTable.added = addedArray;
	updatedTable.remaining = remaining;
	return updatedTable;
}

/**End table functions */

/**Expenses functions */
/**
 * 
 * @param newClientExpense Users latest expense
 * @param existingTable Fetched expenses table
 * @returns An unpadated version of the expenses table
 */
export async function processAddNewExpense(newClientExpense: ExpenseItemI, existingTable: ExpensesTableI): Promise<ExpensesTableI> { //
	const updatedTable: ExpensesTableI = JSON.parse(JSON.stringify(existingTable));
	const expensesArray: ExpenseItemI[] = updatedTable.expenses || [];
	// const newId: number = expensesArray.length > 0 ? expensesArray[expensesArray.length - 1].id + 1 : 1;
	const newId: string = (expensesArray.length + 1) + newClientExpense.description.slice(0, 2).toLocaleUpperCase() +
		'-' + (Math.floor(Math.random() * 100));

	newClientExpense.id = newId;
	expensesArray.push(newClientExpense);
	const { totalExpenses, totalPendingPaid } = calculateExpensesTotals(expensesArray);
	const { totalPending, pendingArray } = updatePendingAmount(expensesArray, updatedTable.pending);
	updatedTable.expenses = expensesArray;
	updatedTable.totals = updatedTable.totals || {
		total_expenses: { cash: 0, card: 0 },
		total_pending: { cash: 0, card: 0 },
		total_payments_made: { cash: 0, card: 0 }
	};
	updatedTable.totals.total_expenses = totalExpenses;
	updatedTable.totals.total_payments_made = totalPendingPaid;
	updatedTable.totals.total_pending = totalPending;
	updatedTable.pending = pendingArray;
	updatedTable.remaining = updateRemaining(updatedTable);
	return updatedTable;
}

/**
 * 
 * @param clientExpense An edited expense, could have updated the description, amount or date(pending)
 * @param existingTable The current expenes table
 * @returns An updated expenses table
 */
export async function processUpdateExpenses(clientExpense: ExpenseItemI, existingTable: ExpensesTableI): Promise<ExpensesTableI> { //
	const updatedTable: ExpensesTableI = JSON.parse(JSON.stringify(existingTable));
	const expensesArray: ExpenseItemI[] = existingTable.expenses;
	const index = expensesArray.findIndex(o => o.id == clientExpense.id);
	if (index === -1) return updatedTable;
	const copy = expensesArray[index];
	expensesArray[index] = clientExpense;
	// console.log(expensesArray);
	const { totalExpenses, totalPendingPaid } = calculateExpensesTotals(expensesArray);
	updatedTable.expenses = expensesArray;
	updatedTable.totals.total_expenses = totalExpenses;
	updatedTable.remaining = updateRemaining(updatedTable);
	if (clientExpense.pending_id || copy.pending_id) {
		const { totalPending, pendingArray } = updatePending(expensesArray, updatedTable.pending, copy.pending_id ?? clientExpense.pending_id);
		updatedTable.totals.total_payments_made = totalPendingPaid;
		updatedTable.totals.total_pending = totalPending;
		updatedTable.pending = pendingArray;
	}
	return updatedTable;
}

/**
 * 
 * @param clientExpenseId An id of a given pending expense to look for
 * @param existingTable The bd data of the expenses table
 * @returns An update version for the expenses table
 */
export async function processDeleteExpenses(clientExpenseId: string, existingTable: ExpensesTableI): Promise<ExpensesTableI> { //
	const updatedTable = JSON.parse(JSON.stringify(existingTable));
	const expensesArray: ExpenseItemI[] = updatedTable.expenses;
	const index = expensesArray.findIndex(o => o.id == clientExpenseId);
	if (index === -1) return updatedTable;
	// const expenseCopy = expensesArray[index];
	const expenseCopy = expensesArray.splice(index, 1)[0];
	const { totalExpenses, totalPendingPaid } = calculateExpensesTotals(expensesArray);
	updatedTable.expenses = expensesArray;
	updatedTable.totals.total_expenses = totalExpenses;
	updatedTable.totals.total_payments_made = totalPendingPaid;
	if (expenseCopy.pending_id) {
		// const { totalPending, pendingArray } = updatePendingArray(expenseCopy, existingTable.pending);
		const { totalPending, pendingArray } = updatePending(expensesArray, updatedTable.pending, expenseCopy.pending_id);
		updatedTable.totals.total_pending = totalPending;
		updatedTable.pending = pendingArray;
	}
	updatedTable.remaining = updateRemaining(updatedTable);
	return updatedTable;
}

/**End expenses functions */

/**Pending expenses functions */

/**
 * 
 * @param newClientPendingExpense A new payment pending to make to add to Expenses table
 * @param existingTable The current open table for the client
 * @returns An updated version of the expenses table
 */
export async function processAddPending(newClientPendingExpense: PendingExpenseI, existingTable: ExpensesTableI): Promise<ExpensesTableI> { //
	const updatedTable = JSON.parse(JSON.stringify(existingTable));
	const pendingArray: PendingExpenseI[] = updatedTable.pending || [];
	// const newId: number = pendingArray.length > 0 ? pendingArray[pendingArray.length - 1].id + 1 : 1;
	const newId: string = pendingArray.length + 1 + newClientPendingExpense.description.slice(0, 2).toLocaleUpperCase() +
		'-' + (Math.floor(Math.random() * 10));
	newClientPendingExpense.id = newId;
	pendingArray.push(newClientPendingExpense);
	const totalPending = getPendingTotal(pendingArray);
	updatedTable.totals.total_pending = totalPending;
	updatedTable.pending = pendingArray;

	return updatedTable;
}

/**
 * 
 * @param pendingExpense An edited pending expense object
 * @param existingTable The current open table for the client
 * @returns An updated version of the expenses table
 */
export async function processUpdatePendingExpenses(pendingExpense: PendingExpenseI, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable = JSON.parse(JSON.stringify(existingTable));
	const pendingArray: PendingExpenseI[] = updatedTable.pending;
	const index = pendingArray.findIndex(o => o.id === pendingExpense.id);
	if (index === -1) return updatedTable;
	let totalPending: TotalsType;
	// const updatedPendingExpense=pendingArray[index];
	const hasLinkedPayments = existingTable.expenses.some((e) => e.isPending && e.pending_id === pendingExpense.id);
	if (hasLinkedPayments) {
		pendingArray[index].description = pendingExpense.description;
	} else {
		pendingArray[index] = pendingExpense;
		totalPending = getPendingTotal(pendingArray);
		updatedTable.totals.total_pending = totalPending;
	}
	updatedTable.pending = pendingArray;
	return updatedTable;
}

/**
 * @param pendingExpenseId string to identify pending expense
 * @param existingTable Current DB table to process deletion from
 * @returns an updated version of the expenses table
 */
export async function processFulfillPendingExpense(pendingExpenseId: string, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable: ExpensesTableI = JSON.parse(JSON.stringify(existingTable));
	const pendingArray = updatedTable.pending;
	const index = pendingArray.findIndex(o => o.id === pendingExpenseId);
	if (index === -1) return updatedTable;
	pendingArray[index].amount = 0;
	pendingArray[index].fulfilled = true;
	const totalPending = getPendingTotal(pendingArray);
	updatedTable.totals.total_pending = totalPending;
	updatedTable.pending = pendingArray;

	return updatedTable;
}

/**
 * @param pendingExpenseId string to identify pending expense
 * @param existingTable Current DB table to process deletion from
 * @returns an updated version of the expenses table
 */
export async function processDeletePendingExpense(pendingExpenseId: string, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable: ExpensesTableI = JSON.parse(JSON.stringify(existingTable));
	const pendingArray = updatedTable.pending;
	const index = pendingArray.findIndex(o => o.id === pendingExpenseId);
	if (index === -1) return updatedTable;
	const removedPendingExpense = pendingArray.splice(index, 1)[0];
	const updatedExpenses = removePendingIdFromExpenses(removedPendingExpense.id, updatedTable.expenses);
	const { totalPendingPaid } = calculateExpensesTotals(updatedExpenses);
	const totalPending = getPendingTotal(pendingArray);
	updatedTable.pending = pendingArray;
	updatedTable.expenses = updatedExpenses;
	updatedTable.totals.total_payments_made = totalPendingPaid;
	updatedTable.totals.total_pending = totalPending;
	return updatedTable;
}

/**End pending expenses functions */

/**Start new expenses period functions */
/**
 * 
 * @param lastClosedTable Expenses table from previous period (ExpensesTableI[])
 * @param session auth session
 * @param initialIncome IncomeI granted by user
 * @returns new Expenses Table object (ExpensesTableI) to be stored
 */
export async function processStartNewPeriod(lastClosedTable: ExpensesTableI | null, session: Session, initialIncome: IncomeI): Promise<Omit<ExpensesTableI, 'id' | '_id'>> {
	let newPendingArray: PendingExpenseI[] = [];
	let totalPending: TotalsType = { cash: 0, card: 0 };
	if (lastClosedTable) {
		newPendingArray = lastClosedTable.pending.map(p => ({ ...p, amount: p.originalAmount, fulfilled: false }));
		totalPending = getPendingTotal(newPendingArray);
	}
	return {
		user_id: session.user.email,
		status: 'active',
		income: { ...initialIncome },
		sDate: new Date().getTime(),
		totals: {
			total_expenses: { cash: 0, card: 0 },
			total_pending: totalPending,
			total_payments_made: { cash: 0, card: 0 }
		},
		pending: newPendingArray,
		expenses: [],
		added: [],
		fDate: 0,
		remaining: { ...initialIncome }
	};
}

//Pure computational sever functions
/**
 * 
 * @param expenses An array of expenses
 * @returns An object with two attributes to set the expenses totals, might update paymenet made totals
 */
function calculateExpensesTotals(expenses: ExpenseItemI[]): { totalExpenses: TotalsType, totalPendingPaid: TotalsType } {
	const totalExpenses = { cash: 0, card: 0 };
	const totalPendingPaid = { cash: 0, card: 0 };
	if (expenses.length > 0) {
		expenses.forEach(element => {
			if (element.type == 'cash') {
				totalExpenses.cash += element.amount;
				if (element.isPending) totalPendingPaid.cash += element.amount;
			} else if (element.type == 'card') {
				totalExpenses.card += element.amount;
				if (element.isPending) totalPendingPaid.card += element.amount;
			}
		});
	}
	return { totalExpenses, totalPendingPaid };
}

/**
 * 
 * @param expensesArray The updated expenses array, should contain a new entry
 * @param currentPendingArray BD pending array from expenses table, no changes made
 * @returns totalPending a Totals type ({cash:number,card:number}) object to update part of the totals for expenses table
 * @description it should only be used when a new expense is made
 */

function updatePendingAmount(expensesArray: ExpenseItemI[], currentPendingArray: PendingExpenseI[]): { totalPending: TotalsType, pendingArray: PendingExpenseI[] } {
	const newPayment = expensesArray[expensesArray.length - 1]; //Make sure only the latest entry is the one that changes pending payments
	const pendingArray = [...currentPendingArray];

	const findCoincidence = (pending_id: string) => {
		let index = pendingArray.findIndex((e) => {
			return pending_id == e.id;
		});
		if (!isNaN(index)) return index;
		else return null;
	};
	if (newPayment.pending_id) {
		const pending_index = findCoincidence(newPayment.pending_id);
		if (pending_index != null) {
			if (pendingArray[pending_index].amount - newPayment.amount >= 0) pendingArray[pending_index].amount -= newPayment.amount;
			else pendingArray[pending_index].amount = 0;
		}
	}
	const totalPending = getPendingTotal(pendingArray);
	return { totalPending, pendingArray };
}

function getPendingTotal(pendingArray: PendingExpenseI[]): TotalsType {
	const totalPending = { cash: 0, card: 0 };
	if (pendingArray.length > 0) {
		pendingArray.forEach(pending => {
			if (pending.type == 'cash') totalPending.cash += pending.amount;
			else totalPending.card += pending.amount;
		});
	}
	return totalPending;
}

/**
 * 
 * @param existingTable A copy of the expenses table to set new values for remaining object
 * @returns An unpdated object for remaining income
 */
function updateRemaining(existingTable: ExpensesTableI): TotalsType {
	const totalAdded = { cash: 0, card: 0, withdrawal: 0 };
	const currentExpenses = { ...existingTable };
	if (currentExpenses.added) {
		currentExpenses.added.forEach(element => {
			totalAdded.cash += element.cash;
			totalAdded.card += element.card;
			if (element.isWithdrawal) totalAdded.withdrawal += element.cash;
		});
	}
	const totalIncome = {
		cash: currentExpenses.income.cash + totalAdded.cash,
		card: (currentExpenses.income.card + totalAdded.card) - totalAdded.withdrawal
	}
	const remaining = { ...totalIncome };
	remaining.cash -= currentExpenses.totals.total_expenses.cash;
	remaining.card -= currentExpenses.totals.total_expenses.card;
	return remaining;
}


function updatePending(expensesArray: ExpenseItemI[], pendingExpenses: PendingExpenseI[], pendingId: string): { totalPending: TotalsType, pendingArray: PendingExpenseI[] } {
	let totalPaid = 0;
	const pendingArray: PendingExpenseI[] = JSON.parse(JSON.stringify(pendingExpenses));
	for (let i = 0; i < expensesArray.length; i++) {
		const expense = expensesArray[i];
		if (!expense.pending_id) continue;
		if (expense.pending_id !== pendingId) continue;
		totalPaid += expense.amount;
	}
	const index = pendingArray.findIndex(o => o.id === pendingId);
	if (index !== -1) pendingArray[index].amount = pendingArray[index].originalAmount - totalPaid;
	const totalPending = getPendingTotal(pendingArray);
	return { totalPending, pendingArray };
};


/**
 * @param pendingId string to find a pending id inside expenses array
 * @param expensesArray the expenses array to iterate 
 * @returns an updated version of the expenses array removing the peding id flag
 */
function removePendingIdFromExpenses(pendingId: string, expensesArray: ExpenseItemI[]) {
	const [...expensesCopy] = expensesArray;
	for (let index = 0; index < expensesCopy.length; index++) {
		const expense = expensesCopy[index];
		if (!expense.isPending || !expense.pending_id) continue;
		if (expense.pending_id !== pendingId) continue;
		expense.isPending = false;
		delete expense.pending_id;
	}
	return expensesCopy;
}


// function processRemaining() {
// 	let totalAdded = { cash: 0, card: 0, withdrawal: 0 };
// 	if (currentExpenses.added) {
// 		currentExpenses.added.forEach(element => {
// 			totalAdded.cash += element.cash;
// 			totalAdded.card += element.card;
// 			if (element.isWithdrawal) totalAdded.withdrawal += element.cash;
// 		});
// 	}
// 	const totalIncome = {
// 		cash: currentExpenses.income.cash + totalAdded.cash,
// 		card: (currentExpenses.income.card + totalAdded.card) - totalAdded.withdrawal
// 	}
// 	currentExpenses.remaining = setRemaining(totalIncome, currentExpenses.totals.expenses);
// 	return currentExpenses.remaining;
// }

// export function updateRemaining(newIncomeData, existingTable) {
// 	if (!currentExpenses.added) currentExpenses.added = [newIncomeData];
// 	else if (Array.isArray(currentExpenses.added)) currentExpenses.added.push(newIncomeData);
// 	processRemaining();
// 	return currentExpenses;
// }

