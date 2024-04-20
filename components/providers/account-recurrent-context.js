const { createContext, useState } = require("react");

const AccountDataContext = createContext({
  account: null,
  updateAccountData: function () { },
  getAccountData: function () { }
});

export function AccountDataContextProvider(props) {
  const [accountData, setCategories] = useState(null);


  function updateAccountData(newData) {
    setCategories(newData);
  }

  function getAccountData() {
    return accountData;
  }

  const context = {
    account: accountData,
    updateAccountData,
    getAccountData
  };

  return <AccountDataContext.Provider value={context}>
    {props.children}
  </AccountDataContext.Provider>

}

export default AccountDataContext;