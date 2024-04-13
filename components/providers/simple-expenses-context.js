import { getCurrentExpenses } from "@/services/simple-expenses.service";
import { createContext, useState } from "react";


const SimpleExpensesContext = createContext({
  expensesTable: null, //whole expenses object
  updateExpensesTable: function (expensesData) { },
  getCurrentExpenses: function () { }
});

export function SimpleExpensesContextProvider(props) {
  const [currentExpenses, setCurrentExpenses] = useState();

  function updateExpensesTable(expensesData) {
    setCurrentExpenses(expensesData);
  }

  function getCurrentExpenses() {
    return currentExpenses;
  }

  const context = {
    expensesTable: currentExpenses,
    updateExpensesTable: updateExpensesTable,
    getCurrentExpenses
  };

  return (
    <SimpleExpensesContext.Provider value={context}>
      {props.children}
    </SimpleExpensesContext.Provider>
  );
}

export default SimpleExpensesContext;