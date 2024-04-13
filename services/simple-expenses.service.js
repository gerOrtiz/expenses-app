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
	let totalPending = { cash: 0, card: 0 };
	if (currentExpenses.pending.length > 0) {
		currentExpenses.pending.forEach(element => {
			if (element.type == 'cash') {
				totalPending.cash += element.amount;
			} else if (element.type == 'card') totalPending.card += element.amount;
		});
	}
	setTotals('pending_remain', totalPending);
	return currentExpenses;
}

/**
 * 
 * @returns The current pending expenses array
 */
export function getPending() {
	if (currentExpenses && currentExpenses.pending) return currentExpenses.pending;
	return [];
}

export function setExpenses(expensesArray, existingTable) {
	if (!Array.isArray(expensesArray)) return null;
	if (currentExpenses) currentExpenses.expenses = expensesArray;
	let totalExpenses = { cash: 0, card: 0 };
	let totalPendingPaid = { cash: 0, card: 0 };
	if (currentExpenses.expenses.length > 0) {
		currentExpenses.expenses.forEach(element => {
			if (element.type == 'cash') {
				totalExpenses.cash += element.amount;
				if (element.isPending) totalPendingPaid.cash += element.amount;
			} else if (element.type == 'card') {
				totalExpenses.card += element.amount;
				if (element.isPending) totalPendingPaid.card += element.amount;
			}
		});
	}
	currentExpenses.totals = existingTable.totals;
	setTotals('expenses', totalExpenses);
	setTotals('pending_paid', totalPendingPaid);
	addPaymentsToPending(expensesArray, existingTable.pending);
	existingTable.expenses = currentExpenses.expenses;
	existingTable.totals = currentExpenses.totals;
	existingTable.remaining = setRemaining(existingTable.income, existingTable.totals.expenses);
	existingTable.pending = currentExpenses.pending;
	return existingTable;
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

function setRemaining(currentRemaining, totals) {
	if (!currentRemaining) return {};
	let remaining = currentRemaining;
	remaining.cash -= totals.cash;
	remaining.card -= totals.card;
	return remaining;
}


function addPaymentsToPending(expensesArray, pendingArray) {
	let findCoincidence = (pending_id) => {
		let index = pendingArray.findIndex((e) => {
			return pending_id == e.id;
		});
		if (!isNaN(index)) return index;
		else return null;
	};
	expensesArray.forEach(expense => {
		if (expense.isPending) {
			const pending_index = findCoincidence(expense.pending_id);
			if (pending_index != null) {
				if (pendingArray[pending_index].amount - expense.amount >= 0) pendingArray[pending_index].amount -= expense.amount;
				else pendingArray[pending_index].amount = 0;
			}
		}
	});
	setPending(pendingArray);
}
