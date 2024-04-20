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
  console.log('remaining: ', totalRemaining);
  let totalIncomes, totalWithdrawals, totalSavingPots, totalExpenses;
  totalIncomes = calculateTotal(account.incomes);
  totalWithdrawals = calculateTotal(account.withdrawals);
  totalSavingPots = calculateTotal(account.saving_pots);
  totalExpenses = account.total_expenses || 0;
  totalRemaining += totalIncomes;
  totalRemaining -= totalExpenses;
  totalRemaining -= totalWithdrawals;
  totalRemaining -= totalSavingPots;
  console.log('total: ', totalRemaining);
  account.remaining = totalRemaining;
  return account.remaining;
}