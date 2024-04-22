'use cient';

import AccountDataContext from "@/components/providers/account-recurrent-context";
import { updateAccountExpenses } from "@/lib/user/account-movements";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardFooter, CardHeader, IconButton, Input, Option, Select, Spinner, Typography } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";

async function sendToServer(expensesArray, accountData) {
  if (!Array.isArray(expensesArray)) return;
  const res = await updateAccountExpenses(expensesArray, accountData);
  return res;
}


export default function ExpensesView({ accountData, dataHandler }) {
  const table_head = ['Categoría', 'Subcategoría', 'Monto', 'Descripción', 'Fecha', ''];
  const [expensesData, setExpensesData] = useState(accountData.expenses);
  const [totalExpenses, setTotalExpenses] = useState(accountData.total_expenses || 0)
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteExpense(index) {
    setIsDeleting(true);
    const newExpensesArray = [...expensesData];
    newExpensesArray.splice(index, 1);
    const response = await sendToServer(newExpensesArray, accountData);
    if (dataHandler) dataHandler(response);
    setExpensesData(newExpensesArray);
    setIsDeleting(false);
  }

  return (<>
    <section className="flex mb-4">
      <Card className="relative w-full">
        <CardHeader className="m-0 text-right " color="orange">
          <Typography variant="h5" className="mr-5">Gastos</Typography>
        </CardHeader>
        <CardBody className="flex flex-col">
          <ExpenseForm expensesData={expensesData} setExpensesData={setExpensesData} setTotalExpenses={setTotalExpenses} accountData={accountData} dataHandler={dataHandler} />
          <div className="gap-3">
            <table className="w-full min-w-max table-auto text-center" >
              <thead>
                <tr>
                  {table_head.map((head) => (
                    <th key={head} className="border-b p-3 border-orange-600 bg-orange-200">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expensesData.map((expense, index) => (
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className="border-b p-4 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {expense.category || 'N/A'}
                      </Typography>
                    </td>
                    <td className="border-b p-4 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {expense.subcategory || 'N/A'}
                      </Typography>
                    </td>
                    <td className="border-b p-4 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        ${expense.amount}
                      </Typography>
                    </td>
                    <td className="border-b p-4 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {expense.description}
                      </Typography>
                    </td>
                    <td className="border-b p-4 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(expense.date).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="border-b p-4 border-blue-gray-50">
                      <IconButton variant="text" onClick={() => deleteExpense(index)} disabled={isDeleting}>
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
        <CardFooter className="p-0 mb-3">
          <Typography variant="paragraph" color="blue-gray" className="font-bold text-center" >
            Total de gastos: ${totalExpenses}
          </Typography>
        </CardFooter>
      </Card>
    </section>
  </>)
}

function ExpenseForm({ expensesData, setExpensesData, accountData, dataHandler }) {
  const categoriesCtx = useContext(AccountDataContext);
  const [categoriesData, setCategoriesData] = useState([]);
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const newAccountData = categoriesCtx.getAccountData();
    if (newAccountData) {
      if (newAccountData.categories && newAccountData.categories.length > 0) setCategoriesData(newAccountData.categories);
    }
  }, [categoriesCtx]);

  function selectCategory(category) {
    if (!category) return;
    const currentCategory = categoriesData.find(cat => cat.name == category);
    setSelectedCategory(category);
    setSelectedSubcategory('');
    if (currentCategory.children && currentCategory.children.length > 0) setSubcategoriesData(currentCategory.children);
    else setSubcategoriesData([]);
  }

  async function submitHandler(event) {
    event.preventDefault();
    setIsPosting(true);
    const newExpenseObj = {
      amount: parseFloat(amount),
      date: new Date().getTime(),
      category: selectedCategory || null,
      subcategory: selectedSubcategory || null,
      description
    };

    let newExpensesArray = [...expensesData];
    newExpensesArray.push(newExpenseObj);
    const response = await sendToServer(newExpensesArray, accountData);
    if (dataHandler) dataHandler(response);
    if (response && response.total_expenses) setTotalExpenses(response.total_expenses);
    setExpensesData(newExpensesArray);
    setDefaultValues();
    setIsPosting(false);
  }

  function setDefaultValues() {
    setAmount(0);
    setDescription('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSubcategoriesData([]);
  }

  return (
    <div className="flex-col mb-4">
      <form className="flex flex-row gap-4 justify-center" onSubmit={submitHandler}>
        {categoriesData.length > 0 &&
          <Select label="Categoría" containerProps={{ className: "min-w-[24px] max-w-[160px]" }} value={selectedCategory} onChange={(val) => selectCategory(val)} >
            {categoriesData.map((category) => (
              <Option key={category.name} value={category.name}>{category.name}</Option>
            ))}
          </Select>
        }
        {subcategoriesData.length > 0 &&
          <Select label="Subcategoría" containerProps={{ className: "min-w-[24px] max-w-[160px]" }}
            disabled={subcategoriesData.length == 0} value={selectedSubcategory} onChange={(val) => setSelectedSubcategory(val)}>
            {subcategoriesData.map((subcategory, index) => (
              <Option key={index} value={subcategory.name}>{subcategory.name}</Option>
            ))}
          </Select>
        }
        <Input
          label="Monto"
          type="number"
          min={0.1}
          step={0.01}
          containerProps={{ className: "min-w-[24px] max-w-[100px] flex" }} value={amount} onChange={(ev) => setAmount(ev.target.value)} />
        <Input label="Detalle" type="text" containerProps={{ className: "flex-none max-w-[180px]" }} value={description} onChange={(ev) => setDescription(ev.target.value)} />
        {!isPosting && <IconButton className="flex-none" variant="outlined" type="submit" disabled={amount <= 0 || !description}>
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>}
        {isPosting && <Spinner className="h-6 w-6" />}
      </form>
    </div>
  );
}