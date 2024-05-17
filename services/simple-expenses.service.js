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
	if (currentExpenses.expenses.length > 0) existingTable.remaining = processRemaining();
	else existingTable.remaining = setRemaining(existingTable.income, existingTable.totals.expenses);
	existingTable.pending = currentExpenses.pending;
	return existingTable;
}

function processRemaining() {
	let totalAdded = { cash: 0, card: 0, withdrawal: 0 };
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
	currentExpenses.remaining = setRemaining(totalIncome, currentExpenses.totals.expenses);
	return currentExpenses.remaining;
}

export function updateRemaining(newIncomeData, existingTable) {
	if (!currentExpenses.added) currentExpenses.added = [newIncomeData];
	else if (Array.isArray(currentExpenses.added)) currentExpenses.added.push(newIncomeData);
	processRemaining();
	return currentExpenses;
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
	const newPayment = expensesArray[expensesArray.length - 1]; //Make sure only the latest entry is the one that changes pending payments
	if (!newPayment.pending_id) return; // No need to change pending data
	let findCoincidence = (pending_id) => {
		let index = pendingArray.findIndex((e) => {
			return pending_id == e.id;
		});
		if (!isNaN(index)) return index;
		else return null;
	};
	const pending_index = findCoincidence(newPayment.pending_id);
	if (pending_index != null) {
		if (pendingArray[pending_index].amount - newPayment.amount >= 0) pendingArray[pending_index].amount -= newPayment.amount;
		else pendingArray[pending_index].amount = 0;
	}
	setPending(pendingArray);
}
