const { createContext, useState } = require("react");

const AccountCategoriesContext = createContext({
  categoriesList: [],
  updateCategoriesList: function () { },
  getCategoriesList: function () { }
});

export function AccountCategoriesCotextProvider(props) {
  const [categories, setCategories] = useState([]);


  function updateCategoriesList(list) {
    setCategories(list);
  }

  function getCategoriesList() {
    return categories;
  }

  const context = {
    categoriesList: categories,
    updateCategoriesList,
    getCategoriesList
  };

  return <AccountCategoriesContext.Provider value={context}>
    {props.children}
  </AccountCategoriesContext.Provider>

}

export default AccountCategoriesContext;