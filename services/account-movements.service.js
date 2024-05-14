let account = {};

export function setAccount(serverAccount) {
  account = serverAccount;
}

export function getAccount() {
  if (account._id) {
    account.id = account._id.toString();
    delete account._id;
  }
  return account;
}

export function setIncomes(incomeArray) {
  account.incomes = incomeArray;
}

export function setExpenses(expensesArray) {
  account.expenses = expensesArray;
  if (expensesArray.length <= 0) {
    account.total_expenses = 0;
  } else {
    account.total_expenses = calculateTotal(expensesArray);
  }
  return account;
}

export function setSavingPots(savingPotsArray) {
  account.saving_pots = savingPotsArray;
  if (savingPotsArray.length > 0) account.total_savingPots = calculateTotal(savingPotsArray);
  else account.total_savingPots = 0;
  return account;
}

export function setWithdrawals(withdrawalsArray) {
  account.withdrawals = withdrawalsArray;
  if (withdrawalsArray.length > 0) account.total_withdrawals = calculateTotal(withdrawalsArray);
  else account.total_withdrawals = 0;
  return account;
}

function calculateTotal(dataArray) {
  let total = 0;
  dataArray.forEach(element => {
    total += element.amount;
  });
  return total;
}

export function setRemaining() {
  if (!account.remaining) return null;
  let totalRemaining = account.initBalance;
  let totalIncomes, totalWithdrawals, totalSavingPots, totalExpenses, totalExpenditure;
  totalIncomes = calculateTotal(account.incomes);
  totalWithdrawals = calculateTotal(account.withdrawals);
  totalSavingPots = !isNaN(account.total_savingPots) ? account.total_savingPots : calculateTotal(account.saving_pots);
  totalExpenses = account.total_expenses || 0;
  totalExpenditure = totalWithdrawals + totalSavingPots + totalExpenses;
  totalRemaining += totalIncomes;
  totalRemaining -= totalExpenditure;
  account.total_expenditure = totalExpenditure;
  account.remaining = totalRemaining;
  return { remaining: account.remaining, total_expenditure: account.total_expenditure };
}

export function setCumulative(cumulativeArray) {
  account.cumulative_section = cumulativeArray;
  return account;
}