import { createContext, useState } from "react";


const SimpleExpensesContext = createContext({
  expensesTable: null, //whole expenses object
  updateExpensesTable: function (expensesData) { }
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