'use server';

import { ExpenseItemI, ExpensesTableI, IncomeI, PendingExpenseI, TotalsType } from "@/interfaces/expenses";


/**
 * 
 * @param newClientExpense Users latest expense
 * @param existingTable Fetched expenses table
 * @returns An unpadated version of the expenses table
 */
export async function processUpdateExpenses(newClientExpense: ExpenseItemI, existingTable: ExpensesTableI): Promise<ExpensesTableI> {
	const updatedTable = { ...existingTable };
	const expensesArray: ExpenseItemI[] = updatedTable.expenses || [];
	expensesArray.push(newClientExpense);
	const { totalExpenses, totalPendingPaid } = await calculateExpensesTotals(expensesArray);
	const { totalPending, pendingArray } = await processPendingUpdates(expensesArray, existingTable.pending);
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

export async function processPendingUpdates(expensesArray: ExpenseItemI[], currentPendingArray: PendingExpenseI[]):
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

export async function processAddPending(newClientPendingExpense: PendingExpenseI, existingTable: ExpensesTableI) {
	const updatedTable = { ...existingTable };
	const pendingArray: PendingExpenseI[] = updatedTable.pending || [];
	pendingArray.push(newClientPendingExpense);
	const totalPending = await getTotalPending(pendingArray);
	updatedTable.totals.total_pending = totalPending;
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

