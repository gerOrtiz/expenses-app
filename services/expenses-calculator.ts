'use server';

import { AddedIncomeI, ExpenseItemI, ExpensesTableI, IncomeI, PendingExpenseI, TotalsType } from "@/interfaces/expenses";


/**
 * 
 * @param newClientExpense Users latest expense
 * @param existingTable Fetched expenses table
 * @returns An unpadated version of the expenses table
 */
export async function processAddNewExpense(newClientExpense: ExpenseItemI, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable = { ...existingTable };
	const expensesArray: ExpenseItemI[] = existingTable.expenses || [];
	const newId: number = expensesArray.length > 0 ? expensesArray[expensesArray.length - 1].id + 1 : 1;
	newClientExpense.id = newId;
	expensesArray.push(newClientExpense);
	const { totalExpenses, totalPendingPaid } = await calculateExpensesTotals(expensesArray);
	const { totalPending, pendingArray } = await processNewPendingIncome(expensesArray, existingTable.pending);
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
	updatedTable.remaining = await processRemaining(updatedTable);
	return updatedTable;
}

/**
 * 
 * @param expenses An array of expenses
 * @returns An object with two attributes to set the expenses totals, might update paymenet made totals
 */
export async function calculateExpensesTotals(expenses: ExpenseItemI[]): Promise<{ totalExpenses: TotalsType, totalPendingPaid: TotalsType }> {
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

export async function processNewPendingIncome(expensesArray: ExpenseItemI[], currentPendingArray: PendingExpenseI[]):
	Promise<{ totalPending: TotalsType, pendingArray: PendingExpenseI[] }> {
	const newPayment = expensesArray[expensesArray.length - 1]; //Make sure only the latest entry is the one that changes pending payments
	const pendingArray = [...currentPendingArray];

	const findCoincidence = (pending_id: number) => {
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
	const totalPending = await getTotalPending(pendingArray);
	return { totalPending, pendingArray };
}

export async function getTotalPending(pendingArray: PendingExpenseI[]): Promise<TotalsType> {
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
export async function processRemaining(existingTable: ExpensesTableI): Promise<TotalsType> {
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

/**
 * 
 * @param newClientPendingExpense A new payment pending to make to add to Expenses table
 * @param existingTable The current open table for the client
 * @returns An updated version of the expenses table
 */
export async function processAddPending(newClientPendingExpense: PendingExpenseI, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable = { ...existingTable };
	const pendingArray: PendingExpenseI[] = updatedTable.pending || [];
	const newId: number = pendingArray.length > 0 ? pendingArray[pendingArray.length - 1].id + 1 : 1;
	newClientPendingExpense.id = newId;
	pendingArray.push(newClientPendingExpense);
	const totalPending = await getTotalPending(pendingArray);
	updatedTable.totals.total_pending = totalPending;
	return updatedTable;
}

/**
 * 
 * @param clientExpense An edited expense, could have updated the description, amount or date(pending)
 * @param existingTable The current expenes table
 * @returns An updated expenses table
 */
export async function processUpdateExpenses(clientExpense: ExpenseItemI, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable = { ...existingTable };
	const expensesArray: ExpenseItemI[] = existingTable.expenses;
	const index = expensesArray.findIndex(o => o.id == clientExpense.id);
	if (index === -1) return updatedTable;
	expensesArray[index] = clientExpense;
	const { totalExpenses } = await calculateExpensesTotals(expensesArray);
	updatedTable.totals.total_expenses = totalExpenses;
	updatedTable.remaining = await processRemaining(updatedTable);
	return updatedTable;
}

/**
 * 
 * @param clientExpenseId An id of a given pending expense to look for
 * @param existingTable The bd data of the expenses table
 * @returns An update version for the expenses table
 */
export async function processDeleteExpenses(clientExpenseId: number, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable = { ...existingTable };
	const expensesArray: ExpenseItemI[] = existingTable.expenses;
	const index = expensesArray.findIndex(o => o.id == clientExpenseId);
	if (index === -1) return updatedTable;
	const expenseCopy = expensesArray[index];
	expensesArray.splice(index, 1);
	const { totalExpenses, totalPendingPaid } = await calculateExpensesTotals(expensesArray);
	updatedTable.expenses = expensesArray;
	updatedTable.totals.total_expenses = totalExpenses;
	updatedTable.totals.total_payments_made = totalPendingPaid;
	if (expenseCopy.pending_id) {
		const { totalPending, pendingArray } = await processUpdatePending(expenseCopy, existingTable.pending);
		updatedTable.totals.total_pending = totalPending;
		updatedTable.pending = pendingArray;
	}
	updatedTable.remaining = await processRemaining(updatedTable);
	return updatedTable;
}

/**
 * 
 * @param expense An expense item to look for in the expenses array and update it
 * @param currentPendingArray The bd version of the pending expenses array
 * @returns An updated pending totals and array
 */
export async function processUpdatePending(expense: ExpenseItemI, currentPendingArray: PendingExpenseI[]): Promise<{ totalPending: TotalsType, pendingArray: PendingExpenseI[] }> {
	const pendingArray = [...currentPendingArray];
	const index = pendingArray.findIndex(o => o.id == expense.pending_id);
	if (index != -1) {
		pendingArray[index].amount += expense.amount;
	}
	const totalPending = await getTotalPending(pendingArray);
	return { totalPending, pendingArray };
}

export async function processAddIncome(newIncome: AddedIncomeI, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable = { ...existingTable };
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

