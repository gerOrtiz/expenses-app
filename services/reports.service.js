export function setData(data) {
  let newData = [];
  let newObj = {};
  data.forEach((element, index) => {
    newObj = {
      sDate: element.sDate,
      fDate: element.fDate,
      total_expenditure: element.total_expenditure, total_withdrawals: element.total_withdrawals,
      total_incomes: setTotals(element.incomes, 'amount'),
      total_cumulative: setTotals(element.cumulative_section, 'movements'),
      cumulative_section: element.cumulative_section
    };
    const { totalExpenses, groupedExpenses } = groupExpenses(element.expenses);
    newObj.total_expenses = totalExpenses;
    newObj.groupedExpenses = groupedExpenses;
    newObj.total_expenditure = newObj.total_expenses + newObj.total_withdrawals + newObj.total_cumulative;
    newData.push(newObj);
  });
  return newData;
}

function setTotals(array, attribute) {
  let total = 0;
  array.forEach(element => {
    total += element[attribute];
  });
  total = parseFloat(total);
  return total;
}

function groupExpenses(expenses) { //Re-arrange 
  let groupedExpenses = [];
  let totalExpenses = 0, categoryIndex = -1;
  let getIndex = (array, attr, categoryName) => {
    if (array.length <= 0) return -1;
    const index = array.findIndex((e) => {
      return e[attr] == categoryName;
    });
    return index;
  };
  expenses.forEach(expense => {
    if (!expense.category) return;
    totalExpenses += expense.amount;
    categoryIndex = getIndex(groupedExpenses, 'category', expense.category);
    if (categoryIndex == -1) groupedExpenses.push({ category: expense.category, subcategories: [{ subcategory: expense.subcategory, amount: expense.amount }] });
    else {
      const subcategoryIndex = getIndex(groupedExpenses[categoryIndex].subcategories, 'subcategory', expense.subcategory);
      if (subcategoryIndex == -1) groupedExpenses[categoryIndex].subcategories.push({ subcategory: expense.subcategory, amount: expense.amount });
      else groupedExpenses[categoryIndex].subcategories[subcategoryIndex].amount += expense.amount;
    }
  });
  for (let index = 0; index < groupedExpenses.length; index++) {
    let expense = groupedExpenses[index];
    let total = 0;
    expense.subcategories.forEach(sub => {
      total += sub.amount;
    });
    expense.total = total;
  }
  return { groupedExpenses, totalExpenses };
}