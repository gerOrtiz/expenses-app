let currentExpenses = {};

/**
 * @param {*} expensesObj The whole expenses table object
 */
export function setCurrentExpenses(expensesObj) {
	if (!expensesObj) return;
	currentExpenses = expensesObj;
}

/**
 * 
 * @returns The whole simple expenses object currently showing
 */
export function getCurrentExpenses() {
	if (!currentExpenses) return null;
	return currentExpenses;
}

/**
 * 
 * @param {*} pendingArray The whole pending array returned from db
 */
export function setPending(pendingArray) {
	if (!Array.isArray(pendingArray)) return;
	if (currentExpenses) currentExpenses.pending = pendingArray;
	if (currentExpenses.pending.length > 0) {
		let totalPending = { cash: 0, card: 0 };
		currentExpenses.pending.forEach(element => {
			if (element.type == 'cash') {
				totalPending.cash += element.amount;
			} else if (element.type == 'card') totalPending.card += element.amount;
		});
		setTotals('pending_remain', totalPending);
		return currentExpenses;
	}
}

/**
 * 
 * @returns The current pending expenses array
 */
export function getPending() {
	if (currentExpenses && currentExpenses.pending) return currentExpenses.pending;
	return [];
}

export async function setTotals(type, totalObj) {
	if (!currentExpenses.totals) getTotals();
	currentExpenses.totals[type] = totalObj;
}

export function getTotals() {
	if (!currentExpenses) return null;
	if (!currentExpenses.totals) {
		currentExpenses.totals = {
			expenses: { cash: 0, card: 0 },
			pending_remain: { cash: 0, card: 0 },
			pending_paid: { cash: 0, card: 0 }
		};
	}
	return currentExpenses.totals;
}

