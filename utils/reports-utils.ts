'use client';

import { ExpenseItemI } from "@/interfaces/expenses";

export function getActualPayments(expensesArray: ExpenseItemI[]): Map<string, number> {
	const paymentsMap: Map<string, number> = new Map();
	for (let index = 0; index < expensesArray.length; index++) {
		const expense = expensesArray[index];
		if (!expense.isPending) continue;
		paymentsMap.set(expense.pending_id, (paymentsMap.get(expense.pending_id) || 0) + expense.amount);
	}
	return paymentsMap;
}
